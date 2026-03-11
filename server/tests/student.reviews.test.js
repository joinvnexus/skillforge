import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Student reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates or updates a review for enrolled student", async () => {
    prisma.enrollment.findUnique.mockResolvedValue({
      id: "enroll-1",
      userId: "student-1",
      courseId: "course-1"
    });
    prisma.review.upsert.mockResolvedValue({
      id: "review-1",
      rating: 5,
      comment: "Great course"
    });
    prisma.review.aggregate.mockResolvedValue({
      _avg: { rating: 4.5 },
      _count: { _all: 2 }
    });
    prisma.course.update.mockResolvedValue({ id: "course-1" });

    const token = signAccessToken({
      userId: "student-1",
      role: "STUDENT",
      email: "student@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/student/me/reviews`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        courseId: "course-1",
        rating: 5,
        comment: "Great course"
      });

    expect(response.status).toBe(201);
    expect(prisma.review.upsert).toHaveBeenCalled();
    expect(prisma.course.update).toHaveBeenCalled();
  });
});
