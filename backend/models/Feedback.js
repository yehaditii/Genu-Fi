const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must be at most 5"],
    validate: {
      validator: Number.isInteger,
      message: "Rating must be an integer",
    },
  },
  liked: {
    type: String,
    trim: true,
    maxlength: [2000, "Liked feedback cannot exceed 2000 characters"],
    default: "",
  },
  improve: {
    type: String,
    trim: true,
    maxlength: [2000, "Improve feedback cannot exceed 2000 characters"],
    default: "",
  },
  walletAddress: {
    type: String,
    trim: true,
    maxlength: [100, "Wallet address cannot exceed 100 characters"],
    default: null,
  },
  featureUsed: {
    type: String,
    trim: true,
    maxlength: [100, "Feature name cannot exceed 100 characters"],
    default: "general",
  },
  clientSubmissionId: {
    type: String,
    trim: true,
    maxlength: [128, "Client submission ID cannot exceed 128 characters"],
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

feedbackSchema.index({ walletAddress: 1, createdAt: -1 });
feedbackSchema.index(
  { clientSubmissionId: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { clientSubmissionId: { $type: "string" } },
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
