import axiosInstance from "../utils/axiosinstance";

export async function login(payload) {
  const res = await axiosInstance.post("/api/auth/login", payload);
  return res.data?.data || res.data;
}

export async function register(payload) {
  const res = await axiosInstance.post("/api/auth/register", payload);
  return res.data?.data || res.data;
}

export async function logout(refreshToken) {
  if (!refreshToken) return;
  await axiosInstance.post("/api/auth/logout", { refreshToken });
}

export async function requestPasswordReset(email) {
  const res = await axiosInstance.post("/api/auth/forgot-password", { email });
  return res.data?.data || res.data;
}

