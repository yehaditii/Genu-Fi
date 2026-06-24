jest.mock("../models/Institution", () => ({
  create: jest.fn(async (payload) => payload),
  find: jest.fn(() => ({ sort: jest.fn(async () => []) })),
  findById: jest.fn(async () => null),
  findByIdAndUpdate: jest.fn(async () => ({ isVerified: true })),
}));

jest.mock("../services/stellarService", () => ({
  issueCredential: jest.fn(async () => ({ txHash: "stellar-test-hash" })),
  verifyCredential: jest.fn(async () => ({ isValid: true })),
  getReputationScore: jest.fn(async () => ({})),
  registerInstitution: jest.fn(async () => ({ contractId: "inst-contract" })),
}));

const request = require("supertest");
const { app } = require("../server");

describe("GET /api/institutions", () => {
  it("lists institutions", async () => {
    const response = await request(app).get("/api/institutions");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
