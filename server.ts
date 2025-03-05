// server.ts
import { Server } from 'bun';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { renderFile } from 'ejs';
import { TemplateData } from './src/server/types';
import { existsSync } from 'fs';

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

// Helper function to find the correct file path
async function findFile(basePaths, relativePath) {
  for (const basePath of basePaths) {
    const fullPath = join(basePath, relativePath);
    const file = Bun.file(fullPath);
    if (await file.exists()) {
      return { path: fullPath, file };
    }
  }
  return null;
}

const server = Bun.serve({
  port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
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
    
    // Handle static files from dist directory
    if (pathname.startsWith('/dist/') || pathname.endsWith('.css') || pathname.endsWith('.js')) {
      // Determine possible file locations
      const possiblePaths = [
        __dirname, // /dist/app.js -> {__dirname}/dist/app.js
        join(__dirname, 'src'), // /dist/app.js -> {__dirname}/src/dist/app.js
      ];
      
      let fullPath = '';
      let fileToServe = null;
      
      if (pathname.startsWith('/dist/')) {
        // Try to find the file in possible locations
        const result = await findFile(possiblePaths, pathname);
        
        if (result) {
          fullPath = result.path;
          fileToServe = result.file;
        }
      } else {
        // For direct CSS or JS requests, check in the dist folder
        const distPath = join(__dirname, 'dist', pathname);
        const file = Bun.file(distPath);
        
        if (await file.exists()) {
          fullPath = distPath;
          fileToServe = file;
        }
      }
      
      // If we couldn't find the file
      if (!fileToServe) {
        console.error(`Static file not found: ${pathname}`);
        console.error(`Tried paths: ${possiblePaths.map(p => join(p, pathname)).join(', ')}`);
        return new Response(`File Not Found: ${pathname}`, { status: 404 });
      }
      
      console.log(`Serving static file: ${fullPath}`);
      
      // Set content type based on file extension
      const ext = pathname.split('.').pop()?.toLowerCase();
      const contentType = contentTypeMap[ext] || 'application/octet-stream';

      return new Response(fileToServe, {
        headers: {
          'Content-Type': `${contentType}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate', // During development
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // For all other routes, serve the main HTML
    try {
      // Try to find the template in expected locations
      let templatePath = join(__dirname, 'src/server/templates', 'app.ejs');
      
      // If not found there, try another common location
      if (!existsSync(templatePath)) {
        templatePath = join(__dirname, 'app.ejs');
      }
      
      console.log(`Using template: ${templatePath}`);
      
      const data: TemplateData = { title: 'MTRL Playground' };
      const html = await renderFile(templatePath, data);
      
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    } catch (error) {
      console.error('Template rendering error:', error);
      return new Response(`Server Error: ${error.message}`, { status: 500 });
    }
  }
});

console.log(`Server running at http://localhost:${server.port}`);