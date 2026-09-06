const http = require("http");
const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const { env, validateEnvironment } = require("./config/env");
const { connectDatabase } = require("./config/database");
const { errorHandler } = require("./middleware/errorHandler");
const institutionsRouter = require("./routes/institutions");
const credentialsRouter = require("./routes/credentials");
const reputationRouter = require("./routes/reputation");
const verificationRouter = require("./routes/verification");
const eventsRouter = require("./routes/events");
const { setWebSocketServer, startPolling } = require("./services/eventService");

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

app.use(errorHandler);

const port = env.port;

async function start() {
  validateEnvironment();
  await connectDatabase().catch((error) => {
    console.warn("Database connection skipped:", error.message);
  });

  startPolling();

  server.listen(port, () => {
    console.log(`GenuFi backend listening on ${port}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
