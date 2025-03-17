// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'mtrl-app',
    script: './server.ts',
    interpreter: 'bun',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    env: {
      // Default environment variables (will be overridden by .env)
      NODE_ENV: 'production',
      PORT: 4000
    },
    env_production: {
      NODE_ENV: 'production'
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 4000
    }
  }]
}
