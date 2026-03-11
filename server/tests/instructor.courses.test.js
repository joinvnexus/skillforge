import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Instructor courses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a course for instructor", async () => {
    prisma.instructorProfile.findUnique.mockResolvedValue({
      id: "inst-1",
      userId: "instructor-1"
    });
    prisma.course.create.mockResolvedValue({
      id: "course-1",
      slug: "intro-course",
      title: "Intro Course"
    });
    prisma.instructorProfile.update.mockResolvedValue({ id: "inst-1" });

    const token = signAccessToken({
      userId: "instructor-1",
      role: "INSTRUCTOR",
      email: "instructor@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/instructor/courses`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        slug: "intro-course",
        title: "Intro Course",
        shortDescription: "Learn the basics.",
        level: "Beginner"
      });

    expect(response.status).toBe(201);
    expect(prisma.course.create).toHaveBeenCalled();
    expect(prisma.instructorProfile.update).toHaveBeenCalled();
  });
});
