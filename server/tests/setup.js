import { vi } from "vitest";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/testdb";
process.env.DIRECT_URL = "postgresql://test:test@localhost:5432/testdb";
process.env.JWT_ACCESS_SECRET = "test-access-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
process.env.JWT_PASSWORD_RESET_SECRET = "test-reset-secret";
process.env.JWT_EMAIL_CHANGE_SECRET = "test-email-secret";
process.env.API_PREFIX = "/api/v1";
process.env.CLIENT_URL = "http://localhost:5173";

const prisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  },
  authSession: {
    create: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    findFirst: vi.fn()
  },
  order: {
    create: vi.fn(),
    update: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn()
  },
  orderItem: {
    createMany: vi.fn(),
    findMany: vi.fn()
  },
  notification: {
    create: vi.fn(),
    createMany: vi.fn(),
    count: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn()
  },
  course: {
    create: vi.fn(),
    update: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn()
  },
  courseSection: {
    create: vi.fn(),
    count: vi.fn()
  },
  lesson: {
    create: vi.fn(),
    findFirst: vi.fn(),
    count: vi.fn(),
    update: vi.fn()
  },
  enrollment: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn()
  },
  lessonProgress: {
    upsert: vi.fn(),
    count: vi.fn()
  },
  review: {
    upsert: vi.fn(),
    findMany: vi.fn(),
    aggregate: vi.fn(),
    update: vi.fn()
  },
  testimonial: {
    update: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn()
  },
  instructorProfile: {
    findUnique: vi.fn(),
    update: vi.fn()
  },
  learningPath: {
    create: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn()
  },
  blogPost: {
    create: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn()
  },
  auditLog: {
    create: vi.fn()
  },
  $transaction: vi.fn(async (arg) => {
    if (Array.isArray(arg)) {
      return Promise.all(arg);
    }
    if (typeof arg === "function") {
      return arg(prisma);
    }
    return arg;
  })
};

globalThis.__mockPrisma = prisma;

vi.mock("../src/lib/prisma.js", () => ({
  prisma
}));
