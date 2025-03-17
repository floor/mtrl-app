// server.ts
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import compression from 'compression'; // Import compression middleware
import dotenv from 'dotenv'; // Add dotenv for .env file support

// Load environment variables from .env file
dotenv.config();

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

// Configure compression middleware - only in production
if (isProduction) {
  app.use(compression({
    // Configure compression level (0-9, where 9 is maximum compression)
    level: 6, // Good balance between compression ratio and CPU usage
    // Only compress responses larger than 1KB
    threshold: 1024,
    // Only compress specific mime types
    filter: (req, res) => {
      const contentType = res.getHeader('Content-Type') || '';
      if (typeof contentType === 'string') {
        // Include JavaScript, TypeScript, CSS, HTML, JSON, and plain text
        return /javascript|typescript|text\/css|text\/html|application\/json|text\/plain/.test(contentType);
      }
      return false;
    }
  }));
};

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'server', 'templates'));

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CSS files with caching in production
app.use('/dist/styles', express.static(path.join(__dirname, 'dist', 'styles'), {
  maxAge: isProduction ? '1d' : '1h', // Longer cache in production
  etag: true,
  lastModified: true,
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Encourage browsers to use compression
    res.setHeader('Vary', 'Accept-Encoding');
  }
}));

// JS/TS files with appropriate caching based on environment
app.use('/dist', express.static(path.join(__dirname, 'dist'), {
  maxAge: isProduction ? '1d' : 0, // No cache in dev, 1 day in production
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath);
    
    // Handle both JS and TS files
    if (ext === '.js' || ext === '.ts' || ext === '.mjs') {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      
      if (!isProduction) {
        // No cache for JavaScript/TypeScript files in development
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
    
    // Always set CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Encourage browsers to use compression
    res.setHeader('Vary', 'Accept-Encoding');
  }
}));

// Fallback for static files in src/dist
app.use('/dist', (req, res, next) => {
  const srcPath = path.join(__dirname, 'src', req.path);
  
  // Check if file exists in src path
  if (fs.existsSync(srcPath)) {
    const ext = path.extname(srcPath);
    
    // Set appropriate headers based on file type
    if (ext === '.js' || ext === '.ts' || ext === '.mjs') {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      if (!isProduction) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      }
    } else if (ext === '.css') {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Vary', 'Accept-Encoding'); // Important for compression
    return res.sendFile(srcPath);
  }
  
  next();
});

// Serve public files if they exist
app.use('/public', express.static(path.join(__dirname, 'public'), {
  maxAge: isProduction ? '7d' : '1d', // Longer cache in production
  etag: true,
  lastModified: true,
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Vary', 'Accept-Encoding');
  }
}));

app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send('User-agent: *\nDisallow:');
});

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
  const timestamp = Date.now(); // For cache busting in development
  res.render('app', { 
    title: 'MTRL Playground',
    timestamp: isProduction ? '' : `?v=${timestamp}`  // Only use timestamp in development
  });
});

// Start the server with Express directly
app.listen(PORT, () => {
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  if (isProduction) {
    console.log(`🚀 Express server running on port ${PORT}`);
    console.log(`🔧 Mode: 🏭 Production`);
    console.log(`📦 Compression: Enabled (level: 6)`);
    console.log(`📁 Serving JS/TS and CSS with GZIP compression`);
  } else {
    console.log(`🚀 Express server running at http://localhost:${PORT}`);
    console.log(`🔧 Mode: 🔨 Development`);
    console.log(`📦 Compression: Disabled`);
  }
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
});