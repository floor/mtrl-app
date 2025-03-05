// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'mtrl-app',
    script: './server.ts',
    interpreter: 'bun',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 4001
    }
  }]
}
