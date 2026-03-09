export const validateRequired = (value, label) => {
  const resolved = String(value || "").trim();
  if (!resolved) return `${label} is required.`;
  return "";
};

export const validateEmail = (value, label = "Email") => {
  const requiredError = validateRequired(value, label);
  if (requiredError) return requiredError;
  const email = String(value).trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) return `${label} is invalid.`;
  return "";
};

export const validateMinLength = (value, label, minLength) => {
  if (String(value || "").length < minLength) {
    return `${label} must be at least ${minLength} characters.`;
  }
  return "";
};

export const validatePassword = (value, label = "Password", minLength = 6) => {
  const requiredError = validateRequired(value, label);
  if (requiredError) return requiredError;
  return validateMinLength(value, label, minLength);
};

export const validateTrimmedLength = (value, label, { min = 1, max = null } = {}) => {
  const requiredError = validateRequired(value, label);
  if (requiredError) return requiredError;

  const resolved = String(value).trim();
  if (resolved.length < min) return `${label} must be at least ${min} characters.`;
  if (max !== null && resolved.length > max) return `${label} must be at most ${max} characters.`;
  return "";
};

export const validateOptionalUrl = (value, label = "URL") => {
  const resolved = String(value || "").trim();
  if (!resolved) return "";

  try {
    const parsed = new URL(resolved);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return `${label} must use HTTP(S).`;
    }
  } catch (_error) {
    return `${label} is invalid.`;
  }

  return "";
};

export const validateCourseDraft = (course) => {
  const slugError = validateTrimmedLength(course?.slug, "Slug", { min: 3, max: 120 });
  if (slugError) return slugError;

  const titleError = validateTrimmedLength(course?.title, "Title", { min: 3, max: 180 });
  if (titleError) return titleError;

  const descriptionError = validateTrimmedLength(course?.shortDescription, "Short description", { min: 10, max: 400 });
  if (descriptionError) return descriptionError;

  const levelError = validateTrimmedLength(course?.level, "Level", { min: 3, max: 40 });
  if (levelError) return levelError;

  return "";
};
