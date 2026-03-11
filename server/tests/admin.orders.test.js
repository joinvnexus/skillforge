import request from "supertest";

import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { signAccessToken } from "../src/lib/tokens.js";

const baseUrl = "/api/v1";

describe("Admin orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates order status and logs audit", async () => {
    prisma.order.update.mockResolvedValue({
      id: "order-1",
      status: "PAID",
      paidAt: new Date()
    });
    prisma.auditLog.create.mockResolvedValue({ id: "audit-1" });

    const token = signAccessToken({
      userId: "admin-1",
      role: "ADMIN",
      email: "admin@example.com"
    });

    const response = await request(app)
      .patch(`${baseUrl}/admin/orders/order-1`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "PAID" });

    expect(response.status).toBe(200);
    expect(prisma.order.update).toHaveBeenCalled();
    const updateArgs = prisma.order.update.mock.calls[0][0];
    expect(updateArgs.data.status).toBe("PAID");
    expect(updateArgs.data.paidAt).toBeInstanceOf(Date);
    expect(prisma.auditLog.create).toHaveBeenCalled();
  });
});
