import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Admin courses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates course status with reviewer note", async () => {
    prisma.course.update.mockResolvedValue({
      id: "course-1",
      status: "PUBLISHED",
      reviewerNote: "Looks good"
    });
    prisma.auditLog.create.mockResolvedValue({ id: "audit-1" });

    const token = signAccessToken({
      userId: "admin-1",
      role: "ADMIN",
      email: "admin@example.com"
    });

    const response = await request(app)
      .patch(`${baseUrl}/admin/courses/course-1/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "PUBLISHED", note: "Looks good" });

    expect(response.status).toBe(200);
    const updateArgs = prisma.course.update.mock.calls[0][0];
    expect(updateArgs.data.status).toBe("PUBLISHED");
    expect(updateArgs.data.reviewerNote).toBe("Looks good");
    expect(updateArgs.data.publishedAt).toBeInstanceOf(Date);
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });

  it("approves testimonial", async () => {
    prisma.testimonial.update.mockResolvedValue({
      id: "testimonial-1",
      isApproved: true,
      isFeatured: false
    });
    prisma.auditLog.create.mockResolvedValue({ id: "audit-2" });

    const token = signAccessToken({
      userId: "admin-1",
      role: "ADMIN",
      email: "admin@example.com"
    });

    const response = await request(app)
      .patch(`${baseUrl}/admin/testimonials/testimonial-1`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isApproved: true });

    expect(response.status).toBe(200);
    expect(prisma.testimonial.update).toHaveBeenCalled();
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });
});
