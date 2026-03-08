import crypto from "node:crypto";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

const durationToMs = (value, fallbackMs) => {
  const match = /^(\d+)(s|m|h|d)$/i.exec(value || "");

  if (!match) {
    return fallbackMs;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * multipliers[unit];
};

export const expiryFromNow = (duration, fallbackMs = 30 * 24 * 60 * 60 * 1000) => {
  return new Date(Date.now() + durationToMs(duration, fallbackMs));
};

export const hashToken = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

export const signAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN
  });
};

export const signRefreshToken = (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
