// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 4000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'server', 'templates'));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CSS files with caching
app.use('/dist/styles', express.static(path.join(__dirname, 'dist', 'styles'), {
  maxAge: '1h',
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// JS files with no caching for development
app.use('/dist', express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    if (path.extname(filePath) === '.js') {
      // No cache for JavaScript files
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    
    // Always set CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Fallback for static files in src/dist
app.use('/dist', (req, res, next) => {
  const srcPath = path.join(__dirname, 'src', req.path);
  
  // Check if file exists in src path
  if (fs.existsSync(srcPath)) {
    const ext = path.extname(srcPath);
    
    // Set appropriate headers based on file type
    if (ext === '.js') {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    } else if (ext === '.css') {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.sendFile(srcPath);
  }
  
  next();
});

// Serve public files if they exist
app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Handle sourcemaps specifically
app.get('*.map', (req, res) => {
  const mapPath = path.join(__dirname, req.path);
  
  if (fs.existsSync(mapPath)) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.sendFile(mapPath);
  } else {
    res.status(404).send('Source map not found');
  }
});

// For all other routes, serve the main app
app.get('*', (req, res) => {
  const timestamp = Date.now(); // For cache busting
  res.render('app', { 
    title: 'MTRL Playground',
    timestamp 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send(`
    <html>
      <head>
        <title>Server Error</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 2rem; }
          .error { color: #e53935; }
          .container { max-width: 800px; margin: 0 auto; }
          pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow: auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="error">Server Error</h1>
          <p>The server encountered an error while processing your request.</p>
          <pre>${err.stack || err.message || 'Unknown error'}</pre>
        </div>
      </body>
    </html>
  `);
});

// Start the server with Express directly
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
