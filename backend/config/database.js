const mongoose = require("mongoose");
const { env } = require("./env");

async function connectDatabase() {
  const mongoUri = env.mongodbUri;
  if (!mongoUri) {
    return;
  }

  await mongoose.connect(mongoUri);
}

module.exports = { connectDatabase };
