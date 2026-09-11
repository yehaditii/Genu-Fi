const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

const STELLAR_ADDRESS_REGEX = /^G[A-Z0-9]{55}$/;
const MAX_FEEDBACK_LENGTH = 2000;

function sanitizeString(str, maxLength = MAX_FEEDBACK_LENGTH) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, maxLength);
}

function isValidWalletAddress(address) {
  if (!address) return true;
  if (typeof address !== "string") return false;
  const trimmed = address.trim();
  return STELLAR_ADDRESS_REGEX.test(trimmed);
}

router.post("/", async (req, res, next) => {
  try {
    const {
      rating: rawRating,
      liked: rawLiked,
      improve: rawImprove,
      walletAddress: rawWalletAddress,
      featureUsed: rawFeatureUsed,
      clientSubmissionId: rawClientSubmissionId,
    } = req.body || {};

    const rating = Number(rawRating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_RATING",
          message: "Rating must be an integer between 1 and 5.",
        },
      });
    }

    const liked = sanitizeString(rawLiked, MAX_FEEDBACK_LENGTH);
    const improve = sanitizeString(rawImprove, MAX_FEEDBACK_LENGTH);
    const featureUsed = sanitizeString(rawFeatureUsed || "general", 100);
    const clientSubmissionId = sanitizeString(rawClientSubmissionId, 128);

    let walletAddress = null;
    if (rawWalletAddress && typeof rawWalletAddress === "string" && rawWalletAddress.trim()) {
      const trimmedWallet = rawWalletAddress.trim();
      if (!isValidWalletAddress(trimmedWallet)) {
        return res.status(400).json({
          success: false,
          error: {
            code: "INVALID_WALLET_ADDRESS",
            message: "Provided wallet address is not a valid Stellar public key.",
          },
        });
      }
      walletAddress = trimmedWallet;
    }

    // Protection against duplicate accidental submissions
    if (clientSubmissionId) {
      const existingById = await Feedback.findOne({
        clientSubmissionId,
        createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
      });
      if (existingById) {
        return res.status(409).json({
          success: false,
          error: {
            code: "DUPLICATE_SUBMISSION",
            message: "Feedback has already been submitted.",
          },
        });
      }
    }

    // Protection against identical rapid submissions within 15 seconds
    const duplicateWindow = new Date(Date.now() - 15 * 1000);
    const recentDuplicate = await Feedback.findOne({
      rating,
      liked,
      improve,
      walletAddress,
      createdAt: { $gte: duplicateWindow },
    });

    if (recentDuplicate) {
      return res.status(409).json({
        success: false,
        error: {
          code: "DUPLICATE_SUBMISSION",
          message: "Duplicate feedback submission detected. Please wait a moment.",
        },
      });
    }

    const feedback = await Feedback.create({
      rating,
      liked,
      improve,
      walletAddress,
      featureUsed,
      clientSubmissionId: clientSubmissionId || undefined,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      feedback: {
        id: feedback._id,
        rating: feedback.rating,
        liked: feedback.liked,
        improve: feedback.improve,
        walletAddress: feedback.walletAddress,
        featureUsed: feedback.featureUsed,
        createdAt: feedback.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/stats", async (_req, res, next) => {
  try {
    const [totalSubmissions, ratingDistribution] = await Promise.all([
      Feedback.countDocuments(),
      Feedback.aggregate([
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalScore = 0;

    ratingDistribution.forEach((item) => {
      if (item._id >= 1 && item._id <= 5) {
        distribution[item._id] = item.count;
        totalScore += item._id * item.count;
      }
    });

    const averageRating =
      totalSubmissions > 0 ? Number((totalScore / totalSubmissions).toFixed(2)) : 0;

    return res.json({
      success: true,
      stats: {
        totalSubmissions,
        averageRating,
        distribution,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const feedbackList = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("rating liked improve walletAddress featureUsed createdAt");

    return res.json({
      success: true,
      feedback: feedbackList,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
