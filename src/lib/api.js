const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";
const ACCESS_TOKEN_KEY = "skillshare_access_token";
const REFRESH_TOKEN_KEY = "skillshare_refresh_token";

const hasWindow = typeof window !== "undefined";

const getStoredItem = (key) => {
  if (!hasWindow) {
    return null;
  }

  return window.localStorage.getItem(key);
};

const setStoredItem = (key, value) => {
  if (!hasWindow) {
    return;
  }

  window.localStorage.setItem(key, value);
};

const removeStoredItem = (key) => {
  if (!hasWindow) {
    return;
  }

  window.localStorage.removeItem(key);
};

const parseJson = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return null;
};

const toError = (payload, fallbackMessage) => {
  return new Error(payload?.error?.message || fallbackMessage);
};

export const getStoredSession = () => ({
  accessToken: getStoredItem(ACCESS_TOKEN_KEY),
  refreshToken: getStoredItem(REFRESH_TOKEN_KEY)
});

export const setStoredSession = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    setStoredItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    setStoredItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearStoredSession = () => {
  removeStoredItem(ACCESS_TOKEN_KEY);
  removeStoredItem(REFRESH_TOKEN_KEY);
};

const refreshAccessToken = async () => {
  const refreshToken = getStoredItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refreshToken })
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    clearStoredSession();
    throw toError(payload, "Unable to refresh session");
  }

  if (payload?.data?.accessToken) {
    setStoredSession({
      accessToken: payload.data.accessToken,
      refreshToken: payload.data.refreshToken || refreshToken
    });
  }

  return payload;
};

const createHeaders = (headers = {}, auth = false) => {
  const resolvedHeaders = {
    "Content-Type": "application/json",
    ...headers
  };

  if (auth) {
    const accessToken = getStoredItem(ACCESS_TOKEN_KEY);

    if (accessToken) {
      resolvedHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  return resolvedHeaders;
};

export const apiRequest = async (
  path,
  { method = "GET", body, headers, auth = false, skipRefresh = false } = {}
) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: createHeaders(headers, auth),
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const payload = await parseJson(response);

  if (response.status === 401 && auth && !skipRefresh && getStoredItem(REFRESH_TOKEN_KEY)) {
    await refreshAccessToken();

    return apiRequest(path, {
      method,
      body,
      headers,
      auth,
      skipRefresh: true
    });
  }

  if (!response.ok) {
    throw toError(payload, `Request failed with status ${response.status}`);
  }

  return payload;
};

export const apiBaseUrl = API_BASE_URL;
