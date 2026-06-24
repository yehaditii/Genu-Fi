const mongoose = require("mongoose");

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    return;
  }

  await mongoose.connect(mongoUri);
}

module.exports = { connectDatabase };
