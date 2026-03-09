import bcrypt from "bcryptjs";
import { Router } from "express";

import { asyncHandler } from "../lib/async-handler.js";
import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import {
  optionalTrimmedString,
  optionalUrl,
  requireEmail,
  requirePassword,
  requireToken,
  requireTrimmedString
} from "../lib/validators.js";
import {
  expiryFromNow,
  hashToken,
  signAccessToken,
  signEmailChangeToken,
  signPasswordResetToken,
  signRefreshToken,
  verifyEmailChangeToken,
  verifyPasswordResetToken,
  verifyRefreshToken
} from "../lib/tokens.js";
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

const resolveProfileUpdates = (body) => {
  const updates = {};

  if ("name" in body) {
    updates.name = requireTrimmedString(body.name, "Name", { min: 2, max: 100 });
  }

  if ("avatarUrl" in body) {
    updates.avatarUrl = optionalUrl(body.avatarUrl, "Avatar URL");
  }

  if ("headline" in body) {
    updates.headline = optionalTrimmedString(body.headline, { max: 180 });
  }

  if ("bio" in body) {
    updates.bio = optionalTrimmedString(body.bio, { max: 2000 });
  }

  if ("phone" in body) {
    updates.phone = optionalTrimmedString(body.phone, { max: 40 });
  }

  if ("timezone" in body) {
    updates.timezone = optionalTrimmedString(body.timezone, { max: 100 });
  }

  return updates;
};

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
  "/auth/forgot-password",
  asyncHandler(async (req, res) => {
    const email = requireEmail(req.body.email);

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    const responseData = {
      success: true,
      message: "If this email exists, a password reset link has been generated."
    };

    if (!user || user.status === "BLOCKED") {
      return res.json({ data: responseData });
    }

    const resetToken = signPasswordResetToken({
      userId: user.id,
      email: user.email,
      purpose: "PASSWORD_RESET"
    });

    if (env.NODE_ENV !== "production") {
      responseData.debug = {
        resetToken,
        resetUrl: `${env.CLIENT_URL}/reset-password?token=${encodeURIComponent(resetToken)}`
      };
    }

    res.json({ data: responseData });
  })
);

router.post(
  "/auth/reset-password",
  asyncHandler(async (req, res) => {
    const token = requireToken(req.body.token);
    const newPassword = requirePassword(req.body.newPassword, "Password", 6);

    let payload;

    try {
      payload = verifyPasswordResetToken(token);
    } catch (_error) {
      throw new HttpError(401, "Invalid or expired reset token");
    }

    if (payload?.purpose !== "PASSWORD_RESET" || !payload?.userId) {
      throw new HttpError(401, "Invalid reset token payload");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId
      }
    });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          passwordHash
        }
      }),
      prisma.authSession.updateMany({
        where: {
          userId: user.id,
          revokedAt: null
        },
        data: {
          revokedAt: new Date()
        }
      })
    ]);

    res.json({
      data: {
        success: true,
        message: "Password has been reset successfully"
      }
    });
  })
);

router.post(
  "/auth/change-email/request",
  requireAuth,
  asyncHandler(async (req, res) => {
    const newEmail = requireEmail(req.body.newEmail, "New email");
    const currentPassword = requirePassword(req.body.currentPassword, "Current password", 6);

    const user = await prisma.user.findUnique({
      where: {
        id: req.auth.userId
      }
    });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (newEmail === user.email) {
      throw new HttpError(400, "New email must be different from current email");
    }

    const emailInUse = await prisma.user.findUnique({
      where: {
        email: newEmail
      },
      select: {
        id: true
      }
    });

    if (emailInUse) {
      throw new HttpError(409, "This email is already in use");
    }

    const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!passwordMatches) {
      throw new HttpError(401, "Current password is incorrect");
    }

    const token = signEmailChangeToken({
      userId: user.id,
      currentEmail: user.email,
      newEmail,
      purpose: "EMAIL_CHANGE"
    });

    const responseData = {
      success: true,
      message: "Email change verification link has been generated."
    };

    if (env.NODE_ENV !== "production") {
      responseData.debug = {
        token,
        confirmUrl: `${env.CLIENT_URL}/confirm-email-change?token=${encodeURIComponent(token)}`
      };
    }

    res.json({ data: responseData });
  })
);

router.post(
  "/auth/change-email/confirm",
  asyncHandler(async (req, res) => {
    const token = requireToken(req.body.token);

    let payload;

    try {
      payload = verifyEmailChangeToken(token);
    } catch (_error) {
      throw new HttpError(401, "Invalid or expired email-change token");
    }

    if (
      payload?.purpose !== "EMAIL_CHANGE" ||
      !payload?.userId ||
      !payload?.currentEmail ||
      !payload?.newEmail
    ) {
      throw new HttpError(401, "Invalid email-change token payload");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId
      }
    });

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    if (user.email !== payload.currentEmail) {
      throw new HttpError(409, "Current email no longer matches token");
    }

    const emailInUse = await prisma.user.findUnique({
      where: {
        email: payload.newEmail
      },
      select: {
        id: true
      }
    });

    if (emailInUse && emailInUse.id !== user.id) {
      throw new HttpError(409, "This email is already in use");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        email: payload.newEmail
      }
    });

    res.json({
      data: {
        success: true,
        message: "Email changed successfully",
        user: sanitizeUser(updatedUser)
      }
    });
  })
);

router.post(
  "/auth/register",
  asyncHandler(async (req, res) => {
    const name = requireTrimmedString(req.body.name, "Name", { min: 2, max: 100 });
    const email = requireEmail(req.body.email);
    const password = requirePassword(req.body.password, "Password", 6);
    const incomingRole = String(req.body.role || "STUDENT").toUpperCase();

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
    const email = requireEmail(req.body.email);
    const password = requirePassword(req.body.password, "Password", 6);

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
    const refreshToken = requireToken(req.body.refreshToken, "Refresh token");

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
    const refreshToken = requireToken(req.body.refreshToken, "Refresh token");

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

router.patch(
  "/auth/me/profile",
  requireAuth,
  asyncHandler(async (req, res) => {
    const updates = resolveProfileUpdates(req.body || {});

    if (Object.keys(updates).length === 0) {
      throw new HttpError(400, "No profile fields provided");
    }

    const user = await prisma.user.update({
      where: {
        id: req.auth.userId
      },
      data: updates
    });

    res.json({
      data: sanitizeUser(user)
    });
  })
);

export default router;
