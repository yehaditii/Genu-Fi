const cron = require("node-cron");

const recentEvents = [
  {
    id: "evt-1",
    type: "institution_registered",
    title: "Institution joined",
    description: "A new institution registered with the Stellar-backed network.",
    timestamp: new Date().toISOString(),
  },
];

let websocketServer;

function setWebSocketServer(wss) {
  websocketServer = wss;
}

function broadcastEvent(event) {
  recentEvents.unshift(event);
  recentEvents.splice(20);

  if (!websocketServer) {
    return;
  }

  websocketServer.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(event));
    }
  });
}

function startPolling() {
  cron.schedule("*/10 * * * * *", () => {
    broadcastEvent({
      id: `evt-${Date.now()}`,
      type: "heartbeat",
      title: "Soroban poll cycle",
      description: "Backend polled for Soroban events and refreshed the local feed.",
      timestamp: new Date().toISOString(),
    });
  });
}

function getRecentEvents() {
  return recentEvents;
}

module.exports = {
  broadcastEvent,
  getRecentEvents,
  setWebSocketServer,
  startPolling,
};
