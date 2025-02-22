// src/server/reload-handler.ts
const reloadScript = `
<script>
    let lastReload = 0
    const checkReload = async () => {
        try {
            const res = await fetch('/reload-check')
            const time = parseInt(await res.text())
            if (time > lastReload) {
                lastReload = time
                location.reload()
            }
        } catch (err) {
            console.error('Reload check failed:', err)
        }
    }
    setInterval(checkReload, 1000)
</script>
</body>`

export const injectReloadScript = (content: string): string => 
    content.replace('</body>', reloadScript)

export const handleReloadCheck = async (): Promise<Response> => {
    try {
        const reloadFile = Bun.file('./src/dist/reload')
        const exists = await reloadFile.exists()
        if (exists) {
            const time = parseInt(await reloadFile.text())
            return new Response(time.toString())
        }
    } catch (err) {
        console.error('Reload check error:', err)
    }
    return new Response('0')
}