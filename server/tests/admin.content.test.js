import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Admin content", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a blog post", async () => {
    prisma.blogPost.create.mockResolvedValue({
      id: "blog-1",
      title: "First Post",
      status: "DRAFT"
    });
    prisma.auditLog.create.mockResolvedValue({ id: "audit-1" });

    const token = signAccessToken({
      userId: "admin-1",
      role: "ADMIN",
      email: "admin@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/admin/blogs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "First Post",
        slug: "first-post",
        snippet: "Short snippet",
        content: "Full content",
        status: "DRAFT"
      });

    expect(response.status).toBe(201);
    expect(prisma.blogPost.create).toHaveBeenCalled();
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });

  it("creates a learning path", async () => {
    prisma.learningPath.create.mockResolvedValue({
      id: "path-1",
      slug: "beginner-path",
      title: "Beginner Path"
    });
    prisma.auditLog.create.mockResolvedValue({ id: "audit-2" });

    const token = signAccessToken({
      userId: "admin-1",
      role: "ADMIN",
      email: "admin@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/admin/learning-paths`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        slug: "beginner-path",
        title: "Beginner Path",
        description: "Learn from scratch",
        estimatedDuration: "4 weeks",
        level: "BEGINNER"
      });

    expect(response.status).toBe(201);
    expect(prisma.learningPath.create).toHaveBeenCalled();
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });
});
