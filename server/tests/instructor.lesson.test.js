import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Instructor sections and lessons", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a section for instructor course", async () => {
    prisma.instructorProfile.findUnique.mockResolvedValue({
      id: "inst-1",
      userId: "instructor-1"
    });
    prisma.course.findFirst.mockResolvedValue({
      id: "course-1",
      instructorId: "inst-1"
    });
    prisma.courseSection.count.mockResolvedValue(0);
    prisma.courseSection.create.mockResolvedValue({
      id: "section-1",
      courseId: "course-1",
      title: "Intro"
    });

    const token = signAccessToken({
      userId: "instructor-1",
      role: "INSTRUCTOR",
      email: "instructor@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/instructor/courses/course-1/sections`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Intro" });

    expect(response.status).toBe(201);
    expect(prisma.courseSection.create).toHaveBeenCalled();
  });

  it("rejects invalid lesson attachments on update", async () => {
    prisma.instructorProfile.findUnique.mockResolvedValue({
      id: "inst-1",
      userId: "instructor-1"
    });
    prisma.lesson.findFirst.mockResolvedValue({
      id: "lesson-1"
    });

    const token = signAccessToken({
      userId: "instructor-1",
      role: "INSTRUCTOR",
      email: "instructor@example.com"
    });

    const response = await request(app)
      .patch(`${baseUrl}/instructor/lessons/lesson-1`)
      .set("Authorization", `Bearer ${token}`)
      .send({ attachments: ["not-a-url"] });

    expect(response.status).toBe(400);
    expect(prisma.lesson.update).not.toHaveBeenCalled();
  });
});
