// server/handlers/app.ts
import { getTemplateFile } from "../utils/paths.js";
import { renderTemplate, serveRenderedTemplate, renderErrorPage, TemplateData } from "../services/template.js";
import { getLiveReloadScript } from "../services/live-reload.js";
import { logError } from "../middleware/logger.js";
import config from "../config.js";

/**
 * Handle main app requests
 * @param url The request URL object
 * @returns A response object
 */
export async function handleAppRequest(url: URL): Promise<Response> {
  try {
    const templatePath = getTemplateFile("app.ejs");
    
    // Basic template data
    const templateData: TemplateData = {
      title: "MTRL Playground",
      isProduction: config.isProduction,
      timestamp: config.isProduction ? "" : `?v=${Date.now()}`,
      commonChunks: [], // Populate with code-split chunks if needed
      liveReloadScript: getLiveReloadScript()
    };
    
    // Render the template
    const html = await renderTemplate(templatePath, templateData);
    
    // Serve the rendered template
    return await serveRenderedTemplate(html);
  } catch (error: any) {
    logError(url.pathname, error);
    return renderErrorPage(error);
  }
}

/**
 * Handle 404 (not found) responses
 * @param url The request URL object
 * @returns A 404 response
 */
export function handleNotFound(url: URL): Response {
  const error = new Error(`Not Found: ${url.pathname}`);
  logError(url.pathname, error, false);
  
  return renderErrorPage(error, 404);
}

export default {
  handleAppRequest,
  handleNotFound
};