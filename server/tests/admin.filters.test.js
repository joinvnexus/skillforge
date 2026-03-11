import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Admin filters and pagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters users by role and status with pagination", async () => {
    prisma.user.findMany.mockResolvedValue([]);
    prisma.user.count.mockResolvedValue(0);

    const token = signAccessToken({
      userId: "admin-1",
      role: "ADMIN",
      email: "admin@example.com"
    });

    const response = await request(app)
      .get(`${baseUrl}/admin/users?role=STUDENT&status=ACTIVE&page=2&limit=5`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    const call = prisma.user.findMany.mock.calls[0][0];
    expect(call.where).toBeTruthy();
    expect(call.take).toBe(5);
    expect(call.skip).toBe(5);
  });

  it("filters orders by status and search term", async () => {
    prisma.order.findMany.mockResolvedValue([]);
    prisma.order.count.mockResolvedValue(0);

    const token = signAccessToken({
      userId: "admin-1",
      role: "ADMIN",
      email: "admin@example.com"
    });

    const response = await request(app)
      .get(`${baseUrl}/admin/orders?status=PAID&search=ORD-123&page=1&limit=10`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    const call = prisma.order.findMany.mock.calls[0][0];
    expect(call.where).toBeTruthy();
  });

  it("filters testimonials by approval and search term", async () => {
    prisma.testimonial.findMany.mockResolvedValue([]);
    prisma.testimonial.count.mockResolvedValue(0);

    const token = signAccessToken({
      userId: "admin-1",
      role: "ADMIN",
      email: "admin@example.com"
    });

    const response = await request(app)
      .get(`${baseUrl}/admin/testimonials?approved=false&search=great`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    const call = prisma.testimonial.findMany.mock.calls[0][0];
    expect(call.where).toBeTruthy();
  });
});
