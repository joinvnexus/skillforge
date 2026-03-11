import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken, signEmailChangeToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Email change flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests email change and returns token in debug", async () => {
    const passwordHash = await bcrypt.hash("password123", 10);
    prisma.user.findUnique
      .mockResolvedValueOnce({
        id: "user-1",
        email: "old@example.com",
        passwordHash
      })
      .mockResolvedValueOnce(null);

    const token = signAccessToken({
      userId: "user-1",
      role: "STUDENT",
      email: "old@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/auth/change-email/request`)
      .set("Authorization", `Bearer ${token}`)
      .send({ newEmail: "new@example.com", currentPassword: "password123" });

    expect(response.status).toBe(200);
    expect(response.body?.data?.success).toBe(true);
    expect(response.body?.data?.debug?.token).toBeTruthy();
  });

  it("confirms email change with valid token", async () => {
    prisma.user.findUnique
      .mockResolvedValueOnce({
        id: "user-2",
        email: "old@example.com"
      })
      .mockResolvedValueOnce(null);
    prisma.user.update.mockResolvedValue({
      id: "user-2",
      email: "new@example.com"
    });

    const token = signEmailChangeToken({
      userId: "user-2",
      currentEmail: "old@example.com",
      newEmail: "new@example.com",
      purpose: "EMAIL_CHANGE"
    });

    const response = await request(app)
      .post(`${baseUrl}/auth/change-email/confirm`)
      .send({ token });

    expect(response.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it("rejects invalid email change token", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/change-email/confirm`)
      .send({ token: "invalid-token" });

    expect(response.status).toBe(401);
  });
});
