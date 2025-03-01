// server.ts
import { Server } from 'bun';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { renderFile } from 'ejs';
import { TemplateData } from './src/server/types';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Map file extensions to content types
const contentTypeMap = {
  'css': 'text/css',
  'js': 'application/javascript',
  'json': 'application/json',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'svg': 'image/svg+xml',
  'ttf': 'font/ttf',
  'woff': 'font/woff',
  'woff2': 'font/woff2',
  'eot': 'application/vnd.ms-fontobject',
  'otf': 'font/otf',
  'ico': 'image/x-icon',
  'pdf': 'application/pdf',
  'mp4': 'video/mp4',
  'webm': 'video/webm',
  'mp3': 'audio/mpeg',
  'wav': 'audio/wav'
};

const server = Bun.serve({
  port: 4000,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    
    console.log(`Requested path: ${pathname}`);
    
    // Handle public assets
    if (pathname.startsWith('/public/')) {
      const publicPath = join(__dirname, pathname);
      console.log(`Serving public file: ${publicPath}`);
      
      const file = Bun.file(publicPath);
      const exists = await file.exists();
      
      if (!exists) {
        console.error('Public file not found:', publicPath);
        return new Response('File Not Found', { status: 404 });
      }
      
      // Set appropriate content type based on file extension
      const ext = pathname.split('.').pop()?.toLowerCase();
      const contentType = contentTypeMap[ext] || 'application/octet-stream';

      return new Response(file, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'max-age=3600',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Handle static files (both /dist/ and direct paths for CSS/JS)
    if (pathname.startsWith('/dist/') || pathname.endsWith('.css') || pathname.endsWith('.js')) {
      // Determine the correct file path
      let filePath;
      
      if (pathname.startsWith('/dist/')) {
        // For dist paths, look in src/dist or dist
        filePath = join(__dirname, 'src', pathname);
        
        // Fallback to a direct dist folder if the src/dist path doesn't exist
        if (!await Bun.file(filePath).exists()) {
          filePath = join(__dirname, pathname);
        }
      } else {
        // For direct file requests like main.css or app.js
        filePath = join(__dirname, 'src/dist', pathname);
      }
      
      console.log(`Trying to serve: ${filePath}`);
      const file = Bun.file(filePath);
      const exists = await file.exists();
      
      if (!exists) {
        console.error('Static file not found:', filePath);
        return new Response('File Not Found', { status: 404 });
      }
      
      // Set appropriate content type based on file extension
      const ext = pathname.split('.').pop()?.toLowerCase();
      const contentType = contentTypeMap[ext] || 'text/plain';

      return new Response(file, {
        headers: {
          'Content-Type': `${contentType}; charset=utf-8`,
          'Cache-Control': 'max-age=60',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // For all other routes, serve the main HTML
    try {
      const templatePath = join(__dirname, 'src/server/templates', 'app.ejs');
      const data: TemplateData = { title: 'MTRL Playground' };
      const html = await renderFile(templatePath, data);
      
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    } catch (error) {
      console.error('Template rendering error:', error);
      return new Response('Server Error', { status: 500 });
    }
  }
});

console.log(`Server running on port ${server.port}`);