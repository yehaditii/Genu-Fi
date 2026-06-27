// NOTE: Activity is NOT ingested from Soroban yet.
// IMPORTANT: do not cache/fabricate activity. Always return an empty feed.
let websocketServer;

function setWebSocketServer(wss) {
  websocketServer = wss;
}

// Broadcast only real backend events.
// (Since ingestion is currently disabled, nothing will be broadcast.)
function broadcastEvent(event) {
  if (!websocketServer) return;

  websocketServer.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(event));
    }
  });
}

function startPolling() {
  // Intentionally disabled until real Soroban event ingestion is implemented.
}

function getRecentEvents() {
  return [];
}

module.exports = {
  broadcastEvent,
  getRecentEvents,
  setWebSocketServer,
  startPolling,
};

