# Porra Mundial 2026 — Deployment Guide

## Overview

This Next.js app uses:
- **Azure App Service** (Linux, B2) hosting a **Docker container** pulled from ACR
- **Azure Container Registry (ACR)** to store the built Docker image
- **Azure Database for PostgreSQL Flexible Server** (v16) for data storage
- **Prisma ORM** for database migrations and queries
- **Azure Developer CLI (azd)** for infrastructure provisioning

### Deployed resources

| Resource | Name |
|---|---|
| Resource group | `rg-porra2026` |
| App Service | `porra2026-web-4i7tl4lt7sf4o` |
| Container Registry | `porra2026cr4i7tl4lt7sf4o` |
| PostgreSQL server | `porra2026-db-4i7tl4lt7sf4o.postgres.database.azure.com` |
| App URL | https://porra2026-web-4i7tl4lt7sf4o.azurewebsites.net |

---

## Prerequisites

| Tool | Install |
|---|---|
| Node.js 20+ | https://nodejs.org |
| Azure CLI | https://aka.ms/installazurecliwindows |
| Azure Developer CLI | `winget install Microsoft.Azd` |
| Git | https://git-scm.com |

---

## 1. Local Development Setup

```powershell
# Install dependencies
npm install

# Create .env file (copy from example or create manually — see values below)
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed initial data (teams, matches, admin user)
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed.ts

# Start development server
npm run dev
```

Open http://localhost:3000

### Required .env values

```env
DATABASE_URL=postgresql://porraadmin:PASSWORD@porra2026-db-4i7tl4lt7sf4o.postgres.database.azure.com:5432/porra2026?sslmode=require

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-32-char-string-here!!

EMAIL_ENCRYPTION_KEY=exactly-32-characters-here12345

# SMTP (optional — dev shows temp password in API response if omitted)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=WC 2026 Porra <your@gmail.com>

APP_URL=http://localhost:3000
ADMIN_EMAIL=pablosanchez@microsoft.com
```

### Allow your local IP on the PostgreSQL firewall

```powershell
$myIp = (Invoke-RestMethod http://ipinfo.io/json).ip
az postgres flexible-server firewall-rule create `
  --resource-group rg-porra2026 `
  --name porra2026-db-4i7tl4lt7sf4o `
  --rule-name "LocalDev" `
  --start-ip-address $myIp `
  --end-ip-address $myIp
```

---

## 2. Re-deploying the Application (Docker via ACR)

> **Important**: `azd deploy` does NOT build Docker images for this project — it defaults to Oryx source deployment. Always use the steps below to deploy.

### Step 1 — Build and push the Docker image to ACR

The build must be done from a **clean temp folder** (no `node_modules` or `.next`) because `az acr build` on Windows ignores `.dockerignore` and would otherwise upload 600MB of Windows-compiled binaries that break Linux execute permissions inside the container.

```powershell
# Copy source files to a clean temp folder
$src = "C:\VSCode\src\wc2026-prediction-game"
$tmp = "$env:TEMP\porra_build"
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
New-Item $tmp -ItemType Directory | Out-Null
Get-ChildItem $src | Where-Object {
    $_.Name -notin @('node_modules', '.next', '.git', '.azure', 'OldPorras', 'alt-apache-php-mysql', 'mockup', 'NewSpecs')
} | ForEach-Object { Copy-Item $_.FullName $tmp -Recurse }
Copy-Item Dockerfile "$tmp\Dockerfile" -Force

# Build and push to ACR (cloud-side build — no local Docker needed)
az acr build --registry porra2026cr4i7tl4lt7sf4o --image porra2026:latest --file "$tmp\Dockerfile" $tmp
```

### Step 2 — Restart App Service to pull the new image

```powershell
az webapp restart --resource-group rg-porra2026 --name porra2026-web-4i7tl4lt7sf4o
```

### Step 3 — Verify

```powershell
# Wait ~60s for container to start, then check
Start-Sleep -Seconds 60
Invoke-WebRequest -Uri "https://porra2026-web-4i7tl4lt7sf4o.azurewebsites.net" -UseBasicParsing | Select-Object StatusCode
```

---

## 3. First-Time Infrastructure Provisioning (azd)

Only needed when setting up from scratch. If resources already exist, skip to section 2.

### 3a. Login

```powershell
az login
azd auth login
```

### 3b. Provision all Azure resources

```powershell
azd provision
```

This creates App Service, ACR, and PostgreSQL via `infra/main.bicep`. You will be prompted for:
- `dbAdminPassword` — PostgreSQL admin password
- `nextAuthSecret` — random 32+ char string
- `emailEncryptionKey` — exactly 32 characters
- `smtpHost`, `smtpUser`, `smtpPassword` — email settings

### 3c. Run database migrations and seed

```powershell
# Set DATABASE_URL to Azure connection string
$env:DATABASE_URL = "postgresql://porraadmin:PASSWORD@porra2026-db-4i7tl4lt7sf4o.postgres.database.azure.com:5432/porra2026?sslmode=require"

npx prisma migrate deploy
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed.ts
```

Admin credentials after seed: `pablosanchez@microsoft.com` / `PORRAMUNDIAL2026!`

---

## 4. Post-Deployment Checklist

- [ ] Visit the app URL — scoreboard loads
- [ ] Visit `/rules` — rules page works
- [ ] Register a test user — welcome email received (or check API response for temp password)
- [ ] Login with test user — predictions form accessible
- [ ] Login as admin (`pablosanchez@microsoft.com` / `PORRAMUNDIAL2026!`)
- [ ] Admin dashboard loads at `/admin`
- [ ] Enter a test match result → Recalculate scores → Scoreboard updates

---

## 5. Troubleshooting

### View live container logs

```powershell
az webapp log tail --resource-group rg-porra2026 --name porra2026-web-4i7tl4lt7sf4o
```

### App returns 503 / container not starting

Check logs for errors. Common causes:
- Missing environment variable (especially `DATABASE_URL` or `NEXTAUTH_SECRET`)
- PostgreSQL firewall blocking App Service — ensure "Allow Azure services" rule is on
- Image not yet pulled after restart — wait 2 min and retry

### Force App Service to re-pull image

```powershell
az webapp config appsettings set --resource-group rg-porra2026 --name porra2026-web-4i7tl4lt7sf4o --settings REDEPLOY_TRIGGER=$(Get-Date -Format 'yyyyMMddHHmmss')
az webapp restart --resource-group rg-porra2026 --name porra2026-web-4i7tl4lt7sf4o
```

---

## 6. Email Configuration Options

### Gmail (recommended for small scale)
1. Enable 2FA on Gmail
2. Create App Password: Google Account → Security → App passwords
3. Use `smtp.gmail.com:587` with your Gmail address and app password

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
```

---

## 7. Cost Estimate (Azure)

| Resource | SKU | Est. Monthly Cost |
|---|---|---|
| App Service Plan | B2 Linux | ~$30 |
| Container Registry | Basic | ~$5 |
| PostgreSQL Flexible | B1ms | ~$15 |
| **Total** | | **~$50/month** |


## Overview

This Next.js 14 app uses:
- **Azure App Service** (Linux, Node 20) to host the Next.js app
- **Azure Database for PostgreSQL Flexible Server** (v16) for data storage
- **Prisma ORM** for database migrations and queries
- **Azure Developer CLI (azd)** for infrastructure provisioning

---

## Prerequisites

| Tool | Install |
|---|---|
| Node.js 20+ | https://nodejs.org |
| Azure CLI | https://aka.ms/installazurecliwindows |
| Azure Developer CLI | `winget install Microsoft.Azd` |
| Git | https://git-scm.com |

---

## 1. Local Development Setup

```bash
# Clone / enter project
cd c:\VSCode\src\wc2026-prediction-game

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env — fill in all values (see below)
notepad .env

# Generate Prisma client
npm run db:generate

# Run database migrations (requires local or cloud PostgreSQL)
npm run db:migrate

# Seed initial data (teams, matches, admin user)
npm run db:seed

# Start development server
npm run dev
```

Open http://localhost:3000

### Required .env values for local dev

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/porra2026

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-32-char-string-here!!

EMAIL_ENCRYPTION_KEY=exactly-32-characters-here12345

# SMTP (use Gmail or skip — dev shows temp password in API response)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=WC 2026 Porra <your@gmail.com>

APP_URL=http://localhost:3000
ADMIN_EMAIL=pablosanchez@microsoft.com
```

---

## 2. Azure Deployment with azd

### 2a. Login and initialize

```bash
az login
azd auth login
```

### 2b. Create a resource group (optional — azd can do it)

```bash
az group create --name rg-porra2026 --location eastus
```

### 2c. Provision infrastructure

```bash
azd provision
```

This creates:
- Azure App Service Plan (B2 Linux)
- Azure App Service (Node 20)
- Azure PostgreSQL Flexible Server (Burstable B1ms, 32GB)

You will be prompted for:
- `dbAdminPassword` — PostgreSQL admin password (min 8 chars, uppercase + number)
- `nextAuthSecret` — random 32+ char string
- `emailEncryptionKey` — exactly 32 characters
- `smtpHost`, `smtpUser`, `smtpPassword` — email settings

### 2d. Run migrations against Azure PostgreSQL

After provisioning, get the connection string from Azure Portal or azd output, then:

```bash
# Set DATABASE_URL to Azure connection string temporarily
$env:DATABASE_URL="postgresql://porraadmin:PASSWORD@your-server.postgres.database.azure.com:5432/porra2026?sslmode=require"

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

### 2e. Deploy the application

```bash
azd deploy
```

---

## 3. Manual Azure CLI Deployment (alternative)

### 3a. Create resources manually

```bash
# Variables
$RG="rg-porra2026"
$LOCATION="eastus"
$PLAN="porra2026-plan"
$APP="porra2026-web"
$DB="porra2026-db"
$DB_USER="porraadmin"
$DB_PASS="SecurePassword123!"  # Change this!

# PostgreSQL server
az postgres flexible-server create \
  --resource-group $RG \
  --name $DB \
  --location $LOCATION \
  --admin-user $DB_USER \
  --admin-password $DB_PASS \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --version 16 \
  --storage-size 32 \
  --yes

# Create database
az postgres flexible-server db create \
  --resource-group $RG \
  --server-name $DB \
  --database-name porra2026

# Allow Azure services
az postgres flexible-server firewall-rule create \
  --resource-group $RG \
  --name $DB \
  --rule-name AllowAzure \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# App Service plan
az appservice plan create \
  --resource-group $RG \
  --name $PLAN \
  --location $LOCATION \
  --sku B2 \
  --is-linux

# Web app
az webapp create \
  --resource-group $RG \
  --plan $PLAN \
  --name $APP \
  --runtime "NODE:20-lts"
```

### 3b. Configure app settings

```bash
az webapp config appsettings set \
  --resource-group $RG \
  --name $APP \
  --settings \
    DATABASE_URL="postgresql://porraadmin:PASSWORD@$DB.postgres.database.azure.com:5432/porra2026?sslmode=require" \
    NEXTAUTH_URL="https://$APP.azurewebsites.net" \
    NEXTAUTH_SECRET="your-32-char-secret" \
    EMAIL_ENCRYPTION_KEY="exactly-32-characters-here12345" \
    ADMIN_EMAIL="pablosanchez@microsoft.com" \
    SMTP_HOST="smtp.gmail.com" \
    SMTP_PORT="587" \
    SMTP_USER="your@email.com" \
    SMTP_PASS="your-app-password" \
    NODE_ENV="production"
```

### 3c. Build and deploy

```bash
npm run build
az webapp deploy \
  --resource-group $RG \
  --name $APP \
  --src-path . \
  --type zip
```

---

## 4. Post-Deployment Checklist

- [ ] Visit `https://your-app.azurewebsites.net/` — scoreboard loads
- [ ] Visit `/rules` — rules page works
- [ ] Register a test user — welcome email received
- [ ] Login with test user — predictions form accessible
- [ ] Login as admin (`pablosanchez@microsoft.com` / `PORRAMUNDIAL2026!`)
- [ ] Admin dashboard loads at `/admin`
- [ ] Enter a test match result → Recalculate scores → Scoreboard updates

---

## 5. Email Configuration Options

### Gmail (recommended for small scale)
1. Enable 2FA on Gmail
2. Create App Password: Google Account → Security → App passwords
3. Use `smtp.gmail.com:587` with your Gmail address and app password

### Azure Communication Services
1. Create Azure Communication Services resource
2. Get SMTP credentials from the portal
3. Use `smtp.azurecomm.net:587`

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key
```

---

## 6. Maintenance

### Recalculate all scores after entering results
Visit `/admin` → Matches tab → Enter result → Save → "Recalculate All Scores"

### Database backup
```bash
az postgres flexible-server backup list \
  --resource-group rg-porra2026 \
  --name porra2026-db
```

### View application logs
```bash
az webapp log tail \
  --resource-group rg-porra2026 \
  --name your-app-name
```

---

## 7. Cost Estimate (Azure)

| Resource | SKU | Est. Monthly Cost |
|---|---|---|
| App Service Plan | B2 Linux | ~$30 |
| PostgreSQL Flexible | B1ms | ~$15 |
| **Total** | | **~$45/month** |

To reduce costs during development, use B1 App Service Plan (~$15) and pause PostgreSQL when not in use.
