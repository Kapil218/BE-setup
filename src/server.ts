import app from "./app.js";
import { logger } from "./config/logger.js";
const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Server running");
});
