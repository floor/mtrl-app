// src/server/file-handler.ts
import { mimeTypes } from './mime-types'
import { injectReloadScript } from './reload-handler'

export const componentPaths = ['/buttons', '/textfields']

const normalizeFilePath = (path: string): string => {
    let filePath = path.replace(/\/$/, '')
    if (filePath === '') return '/index.html'
    if (componentPaths.includes(filePath)) return `${filePath}/index.html`
    return filePath
}

export const handleFileRequest = async (path: string): Promise<Response> => {
    const filePath = normalizeFilePath(path)
    const fullPath = `playground${filePath}`
    
    try {
        const file = Bun.file(fullPath)
        const exists = await file.exists()
        
        if (!exists) {
            console.log(`File not found: ${fullPath}`)
            return new Response("Not Found", { status: 404 })
        }

        let content = await file.text()
        if (fullPath.endsWith('.html')) {
            content = injectReloadScript(content)
        }

        const ext = '.' + fullPath.split('.').pop() || ''
        const contentType = mimeTypes[ext.toLowerCase()] || 'application/octet-stream'

        return new Response(content, {
            headers: { 
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        })
    } catch (error) {
        console.error(`Error serving ${fullPath}:`, error)
        return new Response("Server Error", { status: 500 })
    }
}