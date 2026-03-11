import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Validation and error responses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects empty course list on order creation", async () => {
    const token = signAccessToken({
      userId: "student-1",
      role: "STUDENT",
      email: "student@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/student/me/orders`)
      .set("Authorization", `Bearer ${token}`)
      .send({ courseIds: [] });

    expect(response.status).toBe(400);
  });

  it("rejects review with invalid rating", async () => {
    const token = signAccessToken({
      userId: "student-1",
      role: "STUDENT",
      email: "student@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/student/me/reviews`)
      .set("Authorization", `Bearer ${token}`)
      .send({ courseId: "course-1", rating: 10 });

    expect(response.status).toBe(400);
  });

  it("rejects instructor profile update with no fields", async () => {
    prisma.instructorProfile.findUnique.mockResolvedValue({
      id: "inst-1",
      userId: "instructor-1"
    });

    const token = signAccessToken({
      userId: "instructor-1",
      role: "INSTRUCTOR",
      email: "instructor@example.com"
    });

    const response = await request(app)
      .patch(`${baseUrl}/instructor/me/profile`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("rejects admin user update with invalid role", async () => {
    const token = signAccessToken({
      userId: "admin-1",
      role: "ADMIN",
      email: "admin@example.com"
    });

    const response = await request(app)
      .patch(`${baseUrl}/admin/users/user-1`)
      .set("Authorization", `Bearer ${token}`)
      .send({ role: "SUPERADMIN" });

    expect(response.status).toBe(400);
  });

  it("rejects instructor announcements when no enrollments", async () => {
    prisma.instructorProfile.findUnique.mockResolvedValue({
      id: "inst-1",
      userId: "instructor-1"
    });
    prisma.enrollment.findMany.mockResolvedValue([]);

    const token = signAccessToken({
      userId: "instructor-1",
      role: "INSTRUCTOR",
      email: "instructor@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/instructor/announcements`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Update",
        message: "Hello",
        type: "COURSE"
      });

    expect(response.status).toBe(404);
  });

  it("rejects lesson progress without enrollmentId", async () => {
    const token = signAccessToken({
      userId: "student-1",
      role: "STUDENT",
      email: "student@example.com"
    });

    const response = await request(app)
      .patch(`${baseUrl}/student/me/lessons/lesson-1/progress`)
      .set("Authorization", `Bearer ${token}`)
      .send({ isCompleted: true });

    expect(response.status).toBe(400);
  });
});
