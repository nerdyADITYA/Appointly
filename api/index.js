import { app, startServer } from "../server/index.js";

export default async function handler(req, res) {
    // Ensure routes are registered
    await startServer();
    // Pass the request to Express
    app(req, res);
}
