// server/handlers/api.ts
import { handleApiRequest } from "../api/index.js";

// Re-export the API handler from the new location
export { handleApiRequest };

export default {
  handleApiRequest
};