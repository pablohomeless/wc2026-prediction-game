targetScope = 'resourceGroup'

@description('Location for all resources')
param location string = resourceGroup().location

@description('Application name prefix')
param appName string = 'porra2026'

@description('PostgreSQL admin username')
param dbAdminUser string = 'porraadmin'

@secure()
@description('PostgreSQL admin password')
param dbAdminPassword string

@secure()
@description('Next.js app settings')
param nextAuthSecret string

@description('Email encryption key (32 chars)')
param emailEncryptionKey string

@description('Admin email address')
param adminEmail string = 'pablosanchez@microsoft.com'

@description('SMTP host')
param smtpHost string = ''

@description('SMTP username')
param smtpUser string = ''

@secure()
@description('SMTP password')
param smtpPassword string = ''

@description('Azure Developer Environment Name (used for tagging)')
param environmentName string = ''

var uniqueSuffix = uniqueString(resourceGroup().id)
var dbServerName = '${appName}-db-${uniqueSuffix}'
var appServicePlanName = '${appName}-plan'
var webAppName = '${appName}-web-${uniqueSuffix}'
var acrName = '${replace(appName, '-', '')}cr${uniqueSuffix}'
var dbName = 'porra2026'

// ---- Azure Container Registry ----
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
  tags: {
    'azd-env-name': environmentName
  }
}

// ---- App Service Plan (B2 minimum for Next.js) ----
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'B2'
    tier: 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// ---- PostgreSQL Flexible Server ----
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-06-01-preview' = {
  name: dbServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: dbAdminUser
    administratorLoginPassword: dbAdminPassword
    version: '16'
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
    authConfig: {
      activeDirectoryAuth: 'Disabled'
      passwordAuth: 'Enabled'
    }
  }
}

// ---- PostgreSQL Database ----
resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-06-01-preview' = {
  parent: postgresServer
  name: dbName
  properties: {
    charset: 'utf8'
    collation: 'en_US.utf8'
  }
}

// ---- Firewall rule: allow Azure services ----
resource postgresFirewallAzure 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-06-01-preview' = {
  parent: postgresServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// ---- Web App (container) ----
resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: webAppName
  location: location
  kind: 'app,linux'
  tags: {
    'azd-service-name': 'web'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOCKER|${containerRegistry.properties.loginServer}/${appName}:latest'
      alwaysOn: true
      http20Enabled: true
      ftpsState: 'Disabled'
      appSettings: [
        {
          name: 'DATABASE_URL'
          value: 'postgresql://${dbAdminUser}:${dbAdminPassword}@${postgresServer.properties.fullyQualifiedDomainName}:5432/${dbName}?sslmode=require'
        }
        {
          name: 'NEXTAUTH_URL'
          value: 'https://${webAppName}.azurewebsites.net'
        }
        {
          name: 'NEXTAUTH_SECRET'
          value: nextAuthSecret
        }
        {
          name: 'EMAIL_ENCRYPTION_KEY'
          value: emailEncryptionKey
        }
        {
          name: 'ADMIN_EMAIL'
          value: adminEmail
        }
        {
          name: 'SMTP_HOST'
          value: smtpHost
        }
        {
          name: 'SMTP_PORT'
          value: '587'
        }
        {
          name: 'SMTP_USER'
          value: smtpUser
        }
        {
          name: 'SMTP_PASS'
          value: smtpPassword
        }
        {
          name: 'SMTP_FROM'
          value: 'WC 2026 Porra <${smtpUser}>'
        }
        {
          name: 'APP_URL'
          value: 'https://${webAppName}.azurewebsites.net'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'WEBSITES_PORT'
          value: '3000'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: 'https://${containerRegistry.properties.loginServer}'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: containerRegistry.listCredentials().username
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: containerRegistry.listCredentials().passwords[0].value
        }
      ]
    }
  }
}

// ---- Outputs ----
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output webAppName string = webAppName
output dbServerFqdn string = postgresServer.properties.fullyQualifiedDomainName
output dbName string = dbName
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerRegistry.properties.loginServer
