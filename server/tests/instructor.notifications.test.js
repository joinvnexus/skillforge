import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Instructor notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends announcement to enrolled students", async () => {
    prisma.instructorProfile.findUnique.mockResolvedValue({
      id: "inst-1",
      userId: "instructor-1"
    });
    prisma.enrollment.findMany.mockResolvedValue([
      { userId: "student-1" },
      { userId: "student-2" }
    ]);
    prisma.notification.createMany.mockResolvedValue({ count: 2 });

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
        message: "New lesson added",
        type: "COURSE"
      });

    expect(response.status).toBe(201);
    expect(prisma.notification.createMany).toHaveBeenCalled();
  });

  it("replies to a review and creates notification", async () => {
    prisma.instructorProfile.findUnique.mockResolvedValue({
      id: "inst-1",
      userId: "instructor-1"
    });
    prisma.review.findFirst.mockResolvedValue({
      id: "review-1",
      userId: "student-1",
      course: { title: "Course A" }
    });
    prisma.notification.create.mockResolvedValue({ id: "notif-1" });

    const token = signAccessToken({
      userId: "instructor-1",
      role: "INSTRUCTOR",
      email: "instructor@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/instructor/reviews/review-1/reply`)
      .set("Authorization", `Bearer ${token}`)
      .send({ message: "Thanks!" });

    expect(response.status).toBe(200);
    expect(prisma.notification.create).toHaveBeenCalled();
  });
});
