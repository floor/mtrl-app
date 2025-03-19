// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'mtrl-app',
    script: './server.ts',
    interpreter: 'bun',
    instances: 1, // Use a single instance to avoid conflicts
    exec_mode: 'fork', // Use fork mode instead of cluster for Bun
    watch: false,
    max_memory_restart: '200M',
    env: {
      // Default environment variables (will be overridden by .env)
      NODE_ENV: 'production',
      PORT: 4000,
      COMPRESSION_ENABLED: 'true',
      COMPRESSION_LEVEL: '6'
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
