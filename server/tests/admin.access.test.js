import request from "supertest";

import app from "../src/app.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Admin access control", () => {
  it("blocks non-admin users from admin routes", async () => {
    const token = signAccessToken({
      userId: "student-1",
      role: "STUDENT",
      email: "student@example.com"
    });

    const response = await request(app)
      .get(`${baseUrl}/admin/users`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});
