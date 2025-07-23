// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'mtrl-app',
    script: 'bun',
    args: 'run server.ts',
    cwd: './',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '600M',  // Increased to 600M for safety
    env: {
      NODE_ENV: 'production',
      PORT: 4000,
      COMPRESSION_ENABLED: 'true',
      COMPRESSION_LEVEL: '6',
      DB_TYPE: 'mongodb'  // Use MongoDB instead of JSON file
    },
    env_production: {
      NODE_ENV: 'production',
      DB_TYPE: 'mongodb'
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 4000,
      DB_TYPE: 'mongodb'  // Use MongoDB in development too
    }
  }]
}
