import { HttpError } from "./http-error.js";

const toStringValue = (value) => String(value ?? "");

export const requireTrimmedString = (value, field, { min = 1, max = null } = {}) => {
  const resolved = toStringValue(value).trim();

  if (!resolved) {
    throw new HttpError(400, `${field} is required`);
  }

  if (resolved.length < min) {
    throw new HttpError(400, `${field} must be at least ${min} characters`);
  }

  if (max !== null && resolved.length > max) {
    throw new HttpError(400, `${field} must be at most ${max} characters`);
  }

  return resolved;
};

export const requireEmail = (value, field = "Email") => {
  const email = requireTrimmedString(value, field).toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new HttpError(400, `${field} is invalid`);
  }

  return email;
};

export const requirePassword = (value, field = "Password", minLength = 6) => {
  const password = toStringValue(value);

  if (!password) {
    throw new HttpError(400, `${field} is required`);
  }

  if (password.length < minLength) {
    throw new HttpError(400, `${field} must be at least ${minLength} characters`);
  }

  return password;
};

export const requireToken = (value, field = "Token") => {
  return requireTrimmedString(value, field);
};

export const optionalTrimmedString = (value, { max = null } = {}) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const resolved = toStringValue(value).trim();

  if (!resolved) {
    return null;
  }

  if (max !== null && resolved.length > max) {
    throw new HttpError(400, `Value must be at most ${max} characters`);
  }

  return resolved;
};

export const optionalUrl = (value, field = "URL") => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }

  const resolved = String(value).trim();

  try {
    const parsed = new URL(resolved);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new HttpError(400, `${field} must be a valid HTTP(S) URL`);
    }
  } catch (_error) {
    throw new HttpError(400, `${field} must be a valid URL`);
  }

  return resolved;
};
