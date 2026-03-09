import dotenv from "dotenv";

dotenv.config();

const preferDirectUrl = process.env.PREFER_DIRECT_URL !== "false";
if (preferDirectUrl && process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}

const required = ["DATABASE_URL", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  API_PREFIX: process.env.API_PREFIX || "/api/v1",
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  PREFER_DIRECT_URL: preferDirectUrl,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_PASSWORD_RESET_SECRET: process.env.JWT_PASSWORD_RESET_SECRET || process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  JWT_PASSWORD_RESET_EXPIRES_IN: process.env.JWT_PASSWORD_RESET_EXPIRES_IN || "30m"
};
