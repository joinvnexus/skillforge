import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Student orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a pending order for paid courses", async () => {
    prisma.course.findMany.mockResolvedValue([
      {
        id: "course-1",
        slug: "course-1",
        title: "Course One",
        price: 50,
        salePrice: null
      }
    ]);
    prisma.order.create.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-1",
      userId: "student-1",
      status: "PENDING",
      totalAmount: 50,
      paymentReference: "pi_123"
    });
    prisma.orderItem.createMany.mockResolvedValue({ count: 1 });
    prisma.notification.create.mockResolvedValue({ id: "notif-1" });
    prisma.order.findUnique.mockResolvedValue({
      id: "order-1",
      orderNumber: "ORD-1",
      status: "PENDING",
      items: []
    });

    const token = signAccessToken({
      userId: "student-1",
      role: "STUDENT",
      email: "student@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/student/me/orders`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        courseIds: ["course-1"],
        paymentMethod: "CARD"
      });

    expect(response.status).toBe(201);
    expect(prisma.order.create).toHaveBeenCalled();
    expect(prisma.orderItem.createMany).toHaveBeenCalled();
  });
});
