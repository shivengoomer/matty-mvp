export function saveAuthSession({ token, refreshToken, user }) {
  if (token) {
    sessionStorage.setItem("token", token);
  }
  if (refreshToken) {
    sessionStorage.setItem("refreshToken", refreshToken);
  }
  if (user) {
    sessionStorage.setItem("user", JSON.stringify({ ...user, token }));
  }
}

export function clearAuthSession() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
}

export function getRefreshToken() {
  return sessionStorage.getItem("refreshToken");
}
