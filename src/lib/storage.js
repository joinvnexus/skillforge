import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const AVATAR_BUCKET = import.meta.env.VITE_SUPABASE_AVATAR_BUCKET || "avatars";
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false
        }
      })
    : null;

const resolveFileExt = (fileName = "") => {
  const parts = String(fileName).toLowerCase().split(".");
  const candidate = parts.length > 1 ? parts.pop() : "";
  return /^[a-z0-9]{2,6}$/.test(candidate || "") ? candidate : "jpg";
};

const ensureValidImage = (file) => {
  if (!file) {
    throw new Error("Please choose an image file.");
  }

  if (!String(file.type || "").startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (Number(file.size || 0) > MAX_AVATAR_SIZE_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }
};

export const isAvatarUploadConfigured = () => Boolean(supabase);

export const uploadProfileAvatar = async (file, userId) => {
  if (!supabase) {
    throw new Error("Avatar upload is not configured. Set Supabase env keys.");
  }

  if (!userId) {
    throw new Error("User session is required for avatar upload.");
  }

  ensureValidImage(file);

  const ext = resolveFileExt(file.name);
  const safeUserId = String(userId).replace(/[^a-z0-9_-]/gi, "");
  const random = Math.random().toString(36).slice(2, 8);
  const path = `profiles/${safeUserId}/${Date.now()}-${random}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, {
    upsert: true,
    cacheControl: "3600",
    contentType: file.type || undefined
  });

  if (uploadError) {
    throw new Error(uploadError.message || "Avatar upload failed.");
  }

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new Error("Avatar uploaded but public URL could not be generated.");
  }

  return data.publicUrl;
};
