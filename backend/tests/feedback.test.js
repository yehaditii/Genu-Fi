const mockFeedbackStore = [];

jest.mock("../models/Feedback", () => ({
  create: jest.fn(async (payload) => {
    const doc = {
      _id: "mock-feedback-id-" + Date.now(),
      createdAt: new Date(),
      liked: "",
      improve: "",
      walletAddress: null,
      featureUsed: "general",
      ...payload,
    };
    mockFeedbackStore.push(doc);
    return doc;
  }),
  findOne: jest.fn(async (query) => {
    if (query.clientSubmissionId) {
      return (
        mockFeedbackStore.find(
          (item) => item.clientSubmissionId === query.clientSubmissionId
        ) || null
      );
    }
    if (query.rating && query.liked !== undefined) {
      return (
        mockFeedbackStore.find(
          (item) =>
            item.rating === query.rating &&
            item.liked === query.liked &&
            item.improve === query.improve &&
            item.walletAddress === query.walletAddress
        ) || null
      );
    }
    return null;
  }),
  find: jest.fn(() => ({
    sort: jest.fn(() => ({
      limit: jest.fn(() => ({
        select: jest.fn(async () => mockFeedbackStore),
      })),
    })),
  })),
  countDocuments: jest.fn(async () => mockFeedbackStore.length),
  aggregate: jest.fn(async () => [
    { _id: 5, count: 2 },
    { _id: 4, count: 1 },
  ]),
}));

const request = require("supertest");
const { app } = require("../server");
const Feedback = require("../models/Feedback");

describe("Feedback API", () => {
  beforeEach(() => {
    mockFeedbackStore.length = 0;
    jest.clearAllMocks();
  });

  describe("POST /api/feedback", () => {
    it("successfully creates feedback with valid rating and comments", async () => {
      const response = await request(app)
        .post("/api/feedback")
        .send({
          rating: 5,
          liked: "Super fast credential verification!",
          improve: "Add dark mode toggle in header.",
          walletAddress: "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVTH5",
          featureUsed: "student",
          clientSubmissionId: "sub-123",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.feedback.rating).toBe(5);
      expect(response.body.feedback.liked).toBe("Super fast credential verification!");
      expect(response.body.feedback.improve).toBe("Add dark mode toggle in header.");
      expect(response.body.feedback.walletAddress).toBe(
        "GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVTH5"
      );
    });

    it("successfully creates anonymous feedback without wallet address", async () => {
      const response = await request(app)
        .post("/api/feedback")
        .send({
          rating: 4,
          liked: "Great UI design",
          improve: "Faster loading for large lists",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.feedback.rating).toBe(4);
      expect(response.body.feedback.walletAddress).toBeNull();
    });

    it("rejects feedback with missing rating", async () => {
      const response = await request(app)
        .post("/api/feedback")
        .send({
          liked: "Nice product",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("INVALID_RATING");
    });

    it("rejects feedback with out-of-bounds or non-integer rating", async () => {
      const responseLow = await request(app)
        .post("/api/feedback")
        .send({ rating: 0 });
      expect(responseLow.statusCode).toBe(400);

      const responseHigh = await request(app)
        .post("/api/feedback")
        .send({ rating: 6 });
      expect(responseHigh.statusCode).toBe(400);

      const responseFloat = await request(app)
        .post("/api/feedback")
        .send({ rating: 4.5 });
      expect(responseFloat.statusCode).toBe(400);
    });

    it("rejects feedback with invalid wallet address format", async () => {
      const response = await request(app)
        .post("/api/feedback")
        .send({
          rating: 5,
          walletAddress: "INVALID_NOT_STELLAR_KEY",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("INVALID_WALLET_ADDRESS");
    });

    it("prevents duplicate submissions with same clientSubmissionId", async () => {
      await request(app).post("/api/feedback").send({
        rating: 5,
        liked: "Great",
        clientSubmissionId: "unique-sub-1",
      });

      const duplicateResponse = await request(app).post("/api/feedback").send({
        rating: 5,
        liked: "Great",
        clientSubmissionId: "unique-sub-1",
      });

      expect(duplicateResponse.statusCode).toBe(409);
      expect(duplicateResponse.body.success).toBe(false);
      expect(duplicateResponse.body.error.code).toBe("DUPLICATE_SUBMISSION");
    });

    it("handles database errors with a service-unavailable response", async () => {
      Feedback.create.mockImplementationOnce(async () => {
        const error = new Error("Database connection lost");
        error.name = "MongoNetworkError";
        throw error;
      });

      const response = await request(app)
        .post("/api/feedback")
        .send({
          rating: 5,
          liked: "Great app",
        });

      expect(response.statusCode).toBe(503);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("DATABASE_ERROR");
    });

    it("handles database duplicate key races as duplicate submissions", async () => {
      Feedback.create.mockImplementationOnce(async () => {
        const error = new Error("Duplicate key");
        error.name = "MongoServerError";
        error.code = 11000;
        throw error;
      });

      const response = await request(app)
        .post("/api/feedback")
        .send({
          rating: 5,
          liked: "Great app",
          clientSubmissionId: "race-submission-id",
        });

      expect(response.statusCode).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("DUPLICATE_SUBMISSION");
    });
  });

  describe("GET /api/feedback/stats", () => {
    it("returns aggregated feedback statistics", async () => {
      const response = await request(app).get("/api/feedback/stats");
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stats).toBeDefined();
      expect(response.body.stats.distribution).toBeDefined();
    });
  });

  describe("GET /api/feedback", () => {
    it("returns feedback list", async () => {
      const response = await request(app).get("/api/feedback");
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.feedback)).toBe(true);
    });
  });
});
