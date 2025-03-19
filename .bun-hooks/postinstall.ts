// .bun-hooks/postinstall.ts
import fs from 'fs';
import path from 'path';

async function setupDevLink(): Promise<void> {
  // Using a relative path from the current project directory
  const mtrlPath: string = path.resolve('..', 'mtrl');
  const nodeModulesPath: string = path.resolve('node_modules/mtrl');
  
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Setting up development link for mtrl...');
    
    try {
      // Check if the mtrl directory exists
      if (!fs.existsSync(mtrlPath)) {
        console.error(`Cannot find mtrl library at ${mtrlPath}`);
        return;
      }
      
      // Remove existing if needed
      if (fs.existsSync(nodeModulesPath)) {
        fs.rmSync(nodeModulesPath, { recursive: true, force: true });
      }
      
      // Create the symlink
      fs.symlinkSync(mtrlPath, nodeModulesPath, 'dir');
      console.log(`Development link created successfully (${mtrlPath} -> ${nodeModulesPath})`);
    } catch (error) {
      console.error('Failed to create development link:', error);
    }
  }
}

setupDevLink();