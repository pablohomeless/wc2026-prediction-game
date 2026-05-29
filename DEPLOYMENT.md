# Porra Mundial 2026 — Deployment Guide

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
