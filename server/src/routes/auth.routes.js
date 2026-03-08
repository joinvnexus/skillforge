import bcrypt from "bcryptjs";
import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import { expiryFromNow, hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/tokens.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  avatarUrl: user.avatarUrl,
  headline: user.headline,
  bio: user.bio,
  phone: user.phone,
  timezone: user.timezone,
  createdAt: user.createdAt
});

const issueSession = async (user, req) => {
  const payload = {
    userId: user.id,
    role: user.role,
    email: user.email
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.authSession.create({
    data: {
      userId: user.id,
      refreshTokenHash: hashToken(refreshToken),
      userAgent: String(req.headers["user-agent"] || ""),
      ipAddress: String(req.ip || ""),
      expiresAt: expiryFromNow(process.env.JWT_REFRESH_EXPIRES_IN || "30d")
    }
  });

  return {
    accessToken,
    refreshToken
  };
};

router.post(
  "/auth/register",
  asyncHandler(async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const incomingRole = String(req.body.role || "STUDENT").toUpperCase();

    if (!name || !email || !password) {
      throw new HttpError(400, "Name, email, and password are required");
    }

    if (password.length < 6) {
      throw new HttpError(400, "Password must be at least 6 characters");
    }

    if (incomingRole === "ADMIN") {
      throw new HttpError(403, "Admin accounts cannot be created from public registration");
    }

    const role = incomingRole === "INSTRUCTOR" ? "INSTRUCTOR" : "STUDENT";

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      throw new HttpError(409, "An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        ...(role === "INSTRUCTOR"
          ? {
              instructorProfile: {
                create: {
                  title: "Instructor",
                  bio: `${name}'s instructor profile is waiting for customization.`
                }
              }
            }
          : {})
      }
    });

    const tokens = await issueSession(user, req);

    res.status(201).json({
      data: {
        user: sanitizeUser(user),
        ...tokens
      }
    });
  })
);

router.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      throw new HttpError(400, "Email and password are required");
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    if (user.status === "BLOCKED") {
      throw new HttpError(403, "This account has been blocked");
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      throw new HttpError(401, "Invalid email or password");
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        lastLoginAt: new Date()
      }
    });

    const tokens = await issueSession(user, req);

    res.json({
      data: {
        user: sanitizeUser(user),
        ...tokens
      }
    });
  })
);

router.post(
  "/auth/refresh",
  asyncHandler(async (req, res) => {
    const refreshToken = String(req.body.refreshToken || "").trim();

    if (!refreshToken) {
      throw new HttpError(400, "Refresh token is required");
    }

    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (_error) {
      throw new HttpError(401, "Invalid or expired refresh token");
    }

    const session = await prisma.authSession.findFirst({
      where: {
        userId: payload.userId,
        refreshTokenHash: hashToken(refreshToken),
        revokedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });

    if (!session || !session.user) {
      throw new HttpError(401, "Refresh session is not valid");
    }

    await prisma.authSession.update({
      where: {
        id: session.id
      },
      data: {
        revokedAt: new Date()
      }
    });

    const tokens = await issueSession(session.user, req);

    res.json({
      data: {
        user: sanitizeUser(session.user),
        ...tokens
      }
    });
  })
);

router.post(
  "/auth/logout",
  asyncHandler(async (req, res) => {
    const refreshToken = String(req.body.refreshToken || "").trim();

    if (!refreshToken) {
      throw new HttpError(400, "Refresh token is required");
    }

    await prisma.authSession.updateMany({
      where: {
        refreshTokenHash: hashToken(refreshToken),
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });

    res.json({
      data: {
        success: true
      }
    });
  })
);

router.get(
  "/auth/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.auth.userId
      }
    });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    res.json({
      data: sanitizeUser(user)
    });
  })
);

export default router;
