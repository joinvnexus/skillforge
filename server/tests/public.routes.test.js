import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

const baseUrl = "/api/v1";

describe("Public routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects mock webhook with invalid secret", async () => {
    const response = await request(app)
      .post(`${baseUrl}/payments/mock-webhook`)
      .set("x-payment-webhook-secret", "wrong-secret")
      .send({ paymentReference: "pi_123", outcome: "SUCCESS" });

    expect(response.status).toBe(401);
  });

  it("returns 404 when course not found", async () => {
    prisma.course.findFirst.mockResolvedValue(null);

    const response = await request(app).get(`${baseUrl}/courses/unknown-course`);

    expect(response.status).toBe(404);
  });
});
