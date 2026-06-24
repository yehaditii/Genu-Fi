jest.mock("../models/Reputation", () => ({
  findOne: jest.fn(async () => null),
}));

jest.mock("../services/stellarService", () => ({
  issueCredential: jest.fn(async () => ({ txHash: "stellar-test-hash" })),
  verifyCredential: jest.fn(async () => ({ isValid: true })),
  getReputationScore: jest.fn(async (address) => ({
    userAddress: address,
    totalScore: 42,
    hackathonCount: 0,
    internshipCount: 1,
    courseCount: 1,
  })),
  registerInstitution: jest.fn(async () => ({ contractId: "inst-contract" })),
}));

const request = require("supertest");
const { app } = require("../server");

describe("GET /api/reputation/:address", () => {
  it("returns a reputation score", async () => {
    const response = await request(app).get("/api/reputation/GTESTADDRESS");
    expect(response.statusCode).toBe(200);
    expect(response.body.totalScore).toBe(42);
  });
});
