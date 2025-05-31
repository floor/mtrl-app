// server/config.ts
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Get directory name in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");

// Cache settings interface
interface CacheSettings {
  production: number;
  development: number;
}

// Config interface
export interface ServerConfig {
  port: number;
  isProduction: boolean;
  baseUrl: string; // Added baseUrl property
  paths: {
    root: string;
    dist: string;
    srcDist: string;
    public: string;
    templates: string;
    reloadFile: string;
  };
  compression: {
    level: number;
    threshold: number;
  };
  cache: {
    css: CacheSettings;
    js: CacheSettings;
    assets: CacheSettings;
  };
}

// Environment configuration
const config: ServerConfig = {
  // Server settings
  port: Number(process.env.PORT) || 4000,
  isProduction: process.env.NODE_ENV === "production",
  
  // Base URL - automatically determined based on environment
  baseUrl: process.env.NODE_ENV === "production" 
    ? "https://mtrl.app" 
    : `http://localhost:${Number(process.env.PORT) || 4000}`,
  
  // Paths
  paths: {
    root: PROJECT_ROOT,
    dist: join(PROJECT_ROOT, "dist"),
    srcDist: join(PROJECT_ROOT, "server", "dist"),
    public: join(PROJECT_ROOT, "public"),
    templates: join(PROJECT_ROOT, "server", "templates"),
    reloadFile: join(PROJECT_ROOT, "server", "dist", "reload")
  },
  
  // Compression settings
  compression: {
    level: 6, // 0-9, higher = more compression but slower
    threshold: 1024, // Only compress responses larger than 1KB
  },
  
  // Cache settings (durations in seconds)
  cache: {
    css: {
      production: 86400, // 1 day
      development: 3600  // 1 hour
    },
    js: {
      production: 86400, // 1 day
      development: 0     // No cache
    },
    assets: {
      production: 604800, // 7 days
      development: 86400  // 1 day
    }
  }
};

export default config;