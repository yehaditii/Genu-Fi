const http = require("http");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { WebSocketServer } = require("ws");
const { connectDatabase } = require("./config/database");
const { errorHandler } = require("./middleware/errorHandler");
const institutionsRouter = require("./routes/institutions");
const credentialsRouter = require("./routes/credentials");
const reputationRouter = require("./routes/reputation");
const verificationRouter = require("./routes/verification");
const eventsRouter = require("./routes/events");
const { setWebSocketServer, startPolling } = require("./services/eventService");

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/events" });

setWebSocketServer(wss);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "genufi-backend" });
});

app.use("/api/institutions", institutionsRouter);
app.use("/api/credentials", credentialsRouter);
app.use("/api/reputation", reputationRouter);
app.use("/api/verification", verificationRouter);
app.use("/api/events", eventsRouter);

app.use(errorHandler);

const port = process.env.PORT || 5000;

async function start() {
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
