module.exports = {
  apps: [{
    name: 'mtrl-app',
    script: 'server.ts',
    interpreter: 'bun',
    watch: ['server.ts', 'src/server'],
    ignore_watch: [
      'node_modules',
      'src/client',
      'dist' // Don't watch dist directory
    ],
    env: {
      NODE_ENV: 'development',
      PORT: 4000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000
    }
  }, {
    name: 'mtrl-build',
    script: 'build.js',
    interpreter: 'bun',
    watch: ['src/client'],
    ignore_watch: [
      'node_modules',
      'src/server',
      'dist' // Don't watch dist directory
    ],
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
