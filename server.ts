// server.ts
import { Server } from 'bun';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { renderFile } from 'ejs';
import { TemplateData } from './src/server/types';

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = Bun.serve({
  port: process.env.PORT || 4000,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Handle static files with better error handling
    if (url.pathname.startsWith('/dist/')) {
      try {
        // Remove leading slash and join with project root
        const filePath = join(__dirname, url.pathname);
        const file = Bun.file(filePath);
        const exists = await file.exists();
        
        if (!exists) {
          console.error('Static file not found:', filePath);
          return new Response('File Not Found', { status: 404 });
        }
        
        // Set appropriate content type based on file extension
        const ext = url.pathname.split('.').pop()?.toLowerCase();
        const contentType = {
          'css': 'text/css',
          'js': 'application/javascript',
          'json': 'application/json',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'gif': 'image/gif',
          'svg': 'image/svg+xml'
        }[ext] || 'application/octet-stream';  // Better default content type

        // Add caching headers for production
        const headers = {
          'Content-Type': `${contentType}; charset=utf-8`,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'max-age=86400'  // Cache for 24 hours in production
        };

        return new Response(file, { headers });
      } catch (error) {
        console.error('Static file error:', error);
        return new Response('Server Error', { status: 500 });
      }
    }

    // For all other routes, serve the main HTML
    try {
      const templatePath = join(__dirname, 'src/server/templates', 'app.ejs');
      const data: TemplateData = { title: 'MTRL Playground' };
      const html = await renderFile(templatePath, data);
      
      return new Response(html, {
        headers: { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache' // Don't cache the HTML
        },
      });
    } catch (error) {
      console.error('Template rendering error:', error);
      return new Response('Server Error', { status: 500 });
    }
  }
});

console.log(`Server running on port ${server.port}`);