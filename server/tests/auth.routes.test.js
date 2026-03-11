import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken, signRefreshToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Auth routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects admin registration from public endpoint", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/register`)
      .send({
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "ADMIN"
      });

    expect(response.status).toBe(403);
    expect(response.body?.error?.message).toMatch(/Admin accounts cannot be created/i);
  });

  it("registers a student and returns tokens", async () => {
    const createdAt = new Date();
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: "user-1",
      name: "Student",
      email: "student@example.com",
      role: "STUDENT",
      status: "ACTIVE",
      avatarUrl: null,
      headline: null,
      bio: null,
      phone: null,
      timezone: "UTC",
      createdAt
    });
    prisma.authSession.create.mockResolvedValue({ id: "session-1" });

    const response = await request(app)
      .post(`${baseUrl}/auth/register`)
      .send({
        name: "Student",
        email: "student@example.com",
        password: "password123",
        role: "STUDENT"
      });

    expect(response.status).toBe(201);
    expect(response.body?.data?.user?.email).toBe("student@example.com");
    expect(response.body?.data?.accessToken).toBeTruthy();
    expect(response.body?.data?.refreshToken).toBeTruthy();
  });

  it("logs in with valid credentials", async () => {
    const passwordHash = await bcrypt.hash("password123", 10);
    prisma.user.findUnique.mockResolvedValue({
      id: "user-2",
      name: "Login User",
      email: "login@example.com",
      role: "STUDENT",
      status: "ACTIVE",
      passwordHash
    });
    prisma.user.update.mockResolvedValue({ id: "user-2" });
    prisma.authSession.create.mockResolvedValue({ id: "session-2" });

    const response = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send({
        email: "login@example.com",
        password: "password123"
      });

    expect(response.status).toBe(200);
    expect(response.body?.data?.user?.email).toBe("login@example.com");
    expect(response.body?.data?.accessToken).toBeTruthy();
    expect(response.body?.data?.refreshToken).toBeTruthy();
  });

  it("requires auth for /auth/me", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: "user-3",
      name: "Profile User",
      email: "profile@example.com",
      role: "STUDENT",
      status: "ACTIVE",
      avatarUrl: null,
      headline: null,
      bio: null,
      phone: null,
      timezone: "UTC",
      createdAt: new Date()
    });

    const token = signAccessToken({
      userId: "user-3",
      role: "STUDENT",
      email: "profile@example.com"
    });

    const response = await request(app)
      .get(`${baseUrl}/auth/me`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body?.data?.email).toBe("profile@example.com");
  });

  it("rejects /auth/me without token", async () => {
    const response = await request(app).get(`${baseUrl}/auth/me`);

    expect(response.status).toBe(401);
  });

  it("refreshes tokens with a valid refresh token", async () => {
    prisma.authSession.findFirst.mockResolvedValue({
      id: "session-3",
      userId: "user-4",
      refreshTokenHash: "hash",
      revokedAt: null,
      expiresAt: new Date(Date.now() + 1000),
      user: {
        id: "user-4",
        name: "Refresh User",
        email: "refresh@example.com",
        role: "STUDENT",
        status: "ACTIVE"
      }
    });
    prisma.authSession.update.mockResolvedValue({ id: "session-3" });
    prisma.authSession.create.mockResolvedValue({ id: "session-4" });

    const refreshToken = signRefreshToken({
      userId: "user-4",
      role: "STUDENT",
      email: "refresh@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/auth/refresh`)
      .send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body?.data?.accessToken).toBeTruthy();
    expect(response.body?.data?.refreshToken).toBeTruthy();
  });

  it("rejects invalid refresh token", async () => {
    const response = await request(app)
      .post(`${baseUrl}/auth/refresh`)
      .send({ refreshToken: "invalid-token" });

    expect(response.status).toBe(401);
  });

  it("logs out and revokes refresh token", async () => {
    prisma.authSession.updateMany.mockResolvedValue({ count: 1 });

    const response = await request(app)
      .post(`${baseUrl}/auth/logout`)
      .send({ refreshToken: "refresh-token" });

    expect(response.status).toBe(200);
    expect(prisma.authSession.updateMany).toHaveBeenCalled();
  });
});
