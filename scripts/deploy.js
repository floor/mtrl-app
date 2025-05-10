#!/usr/bin/env bun
// scripts/deploy.js
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)

// Configuration
const config = {
  staging: {
    host: process.env.DEPLOY_HOST || 'staging.mtrl-app',
    user: process.env.DEPLOY_USER || 'admin',
    path: process.env.DEPLOY_PATH || '/home/floor/staging.mtrl-app',
    port: process.env.SSH_PORT || 22
  },
  production: {
    host: process.env.DEPLOY_HOST || 'mtrl-app',
    user: process.env.DEPLOY_USER || 'admin',
    path: process.env.DEPLOY_PATH || '/home/floor/mtrl-app',
    port: process.env.SSH_PORT || 22
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const environment = args[0] || 'staging'

if (!['staging', 'production'].includes(environment)) {
  console.error('Invalid environment. Use "staging" or "production"')
  process.exit(1)
}

const { host, user, path, port } = config[environment]

async function deploy () {
  try {
    console.log(`Starting deployment to ${environment} environment...`)

    // Build the project
    console.log('Building the project...')
    await execAsync('bun run ./build.js')

    // Synchronize the dist folder to the server
    console.log(`Syncing files to ${user}@${host}:${path}...`)
    await execAsync(`rsync -avz --delete -e "ssh -p ${port}" ./dist/ ${user}@${host}:${path}/dist/`)

    // Deploy server files
    console.log('Syncing server files...')
    await execAsync(`rsync -avz -e "ssh -p ${port}" ./server.ts ./package.json ./ecosystem.config.js ${user}@${host}:${path}/`)

    // Install dependencies and restart the server
    console.log('Installing dependencies and restarting the server...')
    await execAsync(`ssh -p ${port} ${user}@${host} "cd ${path} && bun install && npx pm2 restart mtrl-app"`)

    console.log(`Deployment to ${environment} completed successfully!`)
  } catch (error) {
    console.error('Deployment failed:', error)
    process.exit(1)
  }
}

deploy()
