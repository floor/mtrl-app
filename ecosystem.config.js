module.exports = {
  apps: [{
    name: 'mtrl-app',
    script: 'server.ts',
    interpreter: 'bun',
    watch: true,
    ignore_watch: ['node_modules', 'src/client'],
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }, {
    name: 'mtrl-build',
    script: 'build.js',
    interpreter: 'bun',
    watch: ['src/client'],
    ignore_watch: ['node_modules', 'src/server'],
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
