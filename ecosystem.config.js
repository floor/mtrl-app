module.exports = {
  apps: [{
    name: 'mtrl-app',
    script: 'server.ts',
    interpreter: 'bun',
    watch: ['server.ts', 'src/server'],
    ignore_watch: ['node_modules', 'dist'],
    env: {
      NODE_ENV: 'development',
      PORT: 4000
    },
    min_uptime: 5000,
    max_restarts: 5,
    restart_delay: 4000
  }]
}
