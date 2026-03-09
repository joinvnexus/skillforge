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
