const http = require("http");
const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const { env, validateEnvironment } = require("./config/env");
const { captureError, initMonitoring } = require("./services/monitoring");
const { connectDatabase } = require("./config/database");
const { errorHandler } = require("./middleware/errorHandler");
const institutionsRouter = require("./routes/institutions");
const credentialsRouter = require("./routes/credentials");
const reputationRouter = require("./routes/reputation");
const verificationRouter = require("./routes/verification");
const eventsRouter = require("./routes/events");
const feedbackRouter = require("./routes/feedback");
const { setWebSocketServer, startPolling } = require("./services/eventService");

initMonitoring();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/events" });

setWebSocketServer(wss);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS."));
    },
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "genufi-backend" });
});

app.use("/api/institutions", institutionsRouter);
app.use("/api/credentials", credentialsRouter);
app.use("/api/reputation", reputationRouter);
app.use("/api/verification", verificationRouter);
app.use("/api/events", eventsRouter);
app.use("/api/feedback", feedbackRouter);

app.use(errorHandler);

const port = env.port;

async function start() {
  try {
    validateEnvironment();
  } catch (error) {
    captureError(error, { category: "configuration_failure", operation: "startup" });
    throw error;
  }
  await connectDatabase().catch((error) => {
    captureError(error, { category: "database_failure", operation: "connect" });
    console.warn("Database connection skipped:", error.message);
  });

  startPolling();

  server.listen(port, () => {
    console.log(`GenuFi backend listening on ${port}`);
  });
}

process.on("uncaughtException", (error) => {
  captureError(error, { category: "uncaught_exception" });
  console.error("Unhandled backend exception.");
});

process.on("unhandledRejection", (reason) => {
  captureError(reason, { category: "unhandled_rejection" });
  console.error("Unhandled backend rejection.");
});

if (require.main === module) {
  start();
}

module.exports = { app, start };
