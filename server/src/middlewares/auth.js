import { HttpError } from "../lib/http-error.js";
import { verifyAccessToken } from "../lib/tokens.js";

const extractBearerToken = (headerValue) => {
  if (!headerValue || !headerValue.startsWith("Bearer ")) {
    return null;
  }

  return headerValue.slice("Bearer ".length).trim();
};

export const requireAuth = (req, _res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      throw new HttpError(401, "Authentication token is required");
    }

    const payload = verifyAccessToken(token);
    req.auth = payload;
    next();
  } catch (_error) {
    next(new HttpError(401, "Invalid or expired authentication token"));
  }
};

export const requireRole = (...roles) => {
  return (req, _res, next) => {
    if (!req.auth) {
      return next(new HttpError(401, "Authentication is required"));
    }

    if (!roles.includes(req.auth.role)) {
      return next(new HttpError(403, "You do not have permission to access this resource"));
    }

    return next();
  };
};
