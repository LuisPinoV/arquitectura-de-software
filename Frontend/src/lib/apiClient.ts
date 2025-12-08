let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

// Helpers
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");

const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

const setIdToken = (token: string) => {
  localStorage.setItem("idToken", token);
};

const setRefreshToken = (token: string) => {
  localStorage.setItem("refreshToken", token);
};

export async function refreshTokens() {
  if (isRefreshing) {
    return new Promise(resolve => refreshQueue.push(resolve));
  }

  isRefreshing = true;

  const res = await fetch("/api/session/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: getRefreshToken(),
    }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");

  const data = await res.json();

  setAccessToken(data.accessToken);
  setIdToken(data.idToken);
  
  //Not necessary, but maybe for the future
  if (data.refreshToken) setRefreshToken(data.refreshToken);

  refreshQueue.forEach(cb => cb(data.accessToken));
  refreshQueue = [];
  isRefreshing = false;

  return data.accessToken;
}

export async function apiFetch(url: string, options: any = {}) {

  const attempt = (token: string | null) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

  let token = getAccessToken();
  let res = await attempt(token);

  // If token expired → refresh → retry
  if (res.status === 401) {
    try {
      token = await refreshTokens();
      res = await attempt(token);
    } catch (err) {
      console.error("Refresh failed → redirect to login");
      localStorage.clear();
      window.location.href = "/";
      return;
    }
  }

  return res;
}
