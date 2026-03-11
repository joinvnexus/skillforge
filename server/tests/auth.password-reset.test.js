import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signPasswordResetToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Password reset flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates reset token for existing user", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
      status: "ACTIVE"
    });

    const response = await request(app)
      .post(`${baseUrl}/auth/forgot-password`)
      .send({ email: "user@example.com" });

    expect(response.status).toBe(200);
    expect(response.body?.data?.success).toBe(true);
    expect(response.body?.data?.debug?.resetToken).toBeTruthy();
  });

  it("returns success even if user does not exist", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post(`${baseUrl}/auth/forgot-password`)
      .send({ email: "missing@example.com" });

    expect(response.status).toBe(200);
    expect(response.body?.data?.success).toBe(true);
  });

  it("resets password with valid token", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-2",
      email: "reset@example.com",
      passwordHash: "old-hash"
    });
    prisma.user.update.mockResolvedValue({ id: "user-2" });
    prisma.authSession.updateMany.mockResolvedValue({ count: 1 });

    const token = signPasswordResetToken({
      userId: "user-2",
      email: "reset@example.com",
      purpose: "PASSWORD_RESET"
    });

    const response = await request(app)
      .post(`${baseUrl}/auth/reset-password`)
      .send({ token, newPassword: "newpassword123" });

    expect(response.status).toBe(200);
    expect(prisma.user.update).toHaveBeenCalled();
    expect(prisma.authSession.updateMany).toHaveBeenCalled();
  });

  it("rejects invalid reset token", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/reset-password`)
      .send({ token: "invalid-token", newPassword: "newpassword123" });

    expect(response.status).toBe(401);
  });
});
