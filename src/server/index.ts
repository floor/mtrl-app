// src/server/index.ts
import { handleFileRequest } from './file-handler'
import { handleReloadCheck } from './reload-handler'

const clients = new Set()

const server = Bun.serve({
    port: 4000,
    async fetch(request) {
        const url = new URL(request.url)
        
        if (url.pathname === '/ws') {
          const upgraded = server.upgrade(request)
          return upgraded ? undefined : new Response('WebSocket upgrade failed', { status: 400 })
        }

        if (url.pathname === '/reload-check') {
          return handleReloadCheck()
        }

        return handleFileRequest(url.pathname)
    },

    websocket: {
      open(ws) { clients.add(ws) },
      close(ws) { clients.delete(ws) },
      message() {}
    }
})

console.log(`Server running at http://localhost:${server.port}`)