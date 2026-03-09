const palette = [
  { bg: "#e0f2fe", fg: "#075985" },
  { bg: "#dcfce7", fg: "#166534" },
  { bg: "#ede9fe", fg: "#5b21b6" },
  { bg: "#fee2e2", fg: "#991b1b" },
  { bg: "#fef3c7", fg: "#92400e" },
  { bg: "#e2e8f0", fg: "#0f172a" }
];

export const initialsFromName = (name = "") => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
};

const colorByName = (name = "") => {
  const value = String(name || "User");
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return palette[Math.abs(hash) % palette.length];
};

export const avatarDataUri = (name = "User") => {
  const initials = initialsFromName(name);
  const { bg, fg } = colorByName(name);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'><rect width='128' height='128' fill='${bg}'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='54' font-weight='700' fill='${fg}'>${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
