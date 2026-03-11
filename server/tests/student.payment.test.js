import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Student payment verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("verifies payment success and grants enrollments", async () => {
    prisma.order.findFirst.mockResolvedValue({
      id: "order-1",
      userId: "student-1",
      status: "PENDING",
      paymentReference: "pi_123",
      orderNumber: "ORD-123",
      paymentMethod: "CARD"
    });
    prisma.order.update.mockResolvedValue({
      id: "order-1",
      status: "PAID",
      orderNumber: "ORD-123"
    });
    prisma.orderItem.findMany.mockResolvedValue([{ courseId: "course-1" }]);
    prisma.enrollment.findMany.mockResolvedValue([]);
    prisma.enrollment.create.mockResolvedValue({ id: "enroll-1" });
    prisma.course.update.mockResolvedValue({ id: "course-1" });
    prisma.notification.create.mockResolvedValue({ id: "notif-1" });
    prisma.order.findUnique.mockResolvedValue({
      id: "order-1",
      status: "PAID",
      items: []
    });

    const token = signAccessToken({
      userId: "student-1",
      role: "STUDENT",
      email: "student@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/student/me/orders/order-1/payment-verify`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        paymentReference: "pi_123",
        outcome: "SUCCESS",
        paymentMethod: "CARD"
      });

    expect(response.status).toBe(200);
    expect(prisma.enrollment.create).toHaveBeenCalled();
    expect(prisma.order.update).toHaveBeenCalled();
  });

  it("rejects payment verify if reference mismatch", async () => {
    prisma.order.findFirst.mockResolvedValue({
      id: "order-2",
      userId: "student-1",
      status: "PENDING",
      paymentReference: "pi_expected"
    });

    const token = signAccessToken({
      userId: "student-1",
      role: "STUDENT",
      email: "student@example.com"
    });

    const response = await request(app)
      .post(`${baseUrl}/student/me/orders/order-2/payment-verify`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        paymentReference: "pi_wrong",
        outcome: "SUCCESS",
        paymentMethod: "CARD"
      });

    expect(response.status).toBe(400);
  });
});
