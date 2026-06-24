jest.mock("../models/Credential", () => ({
  create: jest.fn(async (payload) => payload),
  find: jest.fn(() => ({ sort: jest.fn(async () => []) })),
  findOne: jest.fn(async () => null),
}));

jest.mock("../services/stellarService", () => ({
  issueCredential: jest.fn(async () => ({ txHash: "stellar-test-hash" })),
  verifyCredential: jest.fn(async () => ({ isValid: true })),
  getReputationScore: jest.fn(async () => ({})),
  registerInstitution: jest.fn(async () => ({})),
}));

const request = require("supertest");
const { app } = require("../server");

describe("POST /api/credentials", () => {
  it("creates a credential response", async () => {
    const response = await request(app).post("/api/credentials").send({
      issuerAddress: "GABC",
      recipientAddress: "GRECIPIENT",
      credentialType: "course",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
