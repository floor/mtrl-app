// server.ts
import { Server } from 'bun';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { renderFile } from 'ejs';
import { MongoClient, ObjectId } from 'mongodb';
import { TemplateData } from './src/server/types';

const __dirname = dirname(fileURLToPath(import.meta.url));

let client;

const api = {
  // API methods remain the same...
};

const server = Bun.serve({
  port: 4000,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Handle static files
    if (url.pathname.startsWith('/dist/')) {
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
      }[ext] || 'text/plain';

      return new Response(file, {
        headers: {
          'Content-Type': `${contentType}; charset=utf-8`
        }
      });
    }


    // // Handle API routes
    // if (url.pathname.startsWith('/api/')) {
    //   const headers = {
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET',
    //     'Access-Control-Allow-Headers': 'Content-Type',
    //     'Content-Type': 'application/json'
    //   };

    //   if (req.method === 'OPTIONS') {
    //     return new Response(null, { headers });
    //   }

    //   const [, , collection] = url.pathname.split('/');
      
    //   try {
    //     if (req.method === 'GET') {
    //       const params = {};
    //       url.searchParams.forEach((value, key) => {
    //         params[key] = value;
    //       });

    //       const data = await api.get(collection, params);
    //       return new Response(JSON.stringify(data), { headers });
    //     }

    //     return new Response('Method Not Allowed', { 
    //       status: 405,
    //       headers
    //     });
    //   } catch (error) {
    //     console.error(`API Error:`, error);
    //     return new Response(JSON.stringify({ error: 'Server Error' }), { 
    //       status: 500,
    //       headers
    //     });
    //   }
    // }

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

console.log(`Server running at http://localhost:${server.port}`);