import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Student lesson progress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates lesson progress and enrollment status", async () => {
    prisma.enrollment.findFirst.mockResolvedValue({
      id: "enroll-1",
      userId: "student-1",
      courseId: "course-1"
    });
    prisma.lesson.findFirst.mockResolvedValue({
      id: "lesson-1",
      section: { courseId: "course-1" }
    });
    prisma.lessonProgress.upsert.mockResolvedValue({
      id: "progress-1",
      isCompleted: true
    });
    prisma.lesson.count.mockResolvedValue(1);
    prisma.lessonProgress.count.mockResolvedValue(1);
    prisma.enrollment.update.mockResolvedValue({
      id: "enroll-1",
      status: "COMPLETED",
      progressPercent: 100
    });

    const token = signAccessToken({
      userId: "student-1",
      role: "STUDENT",
      email: "student@example.com"
    });

    const response = await request(app)
      .patch(`${baseUrl}/student/me/lessons/lesson-1/progress`)
      .set("Authorization", `Bearer ${token}`)
      .send({ enrollmentId: "enroll-1", isCompleted: true, watchSeconds: 120 });

    expect(response.status).toBe(200);
    expect(prisma.lessonProgress.upsert).toHaveBeenCalled();
    expect(prisma.enrollment.update).toHaveBeenCalled();
  });
});
