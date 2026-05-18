import axiosInstance from "../utils/axiosinstance";

export async function fetchTemplates(category = "") {
  const url = category
    ? `/api/templates?category=${encodeURIComponent(category)}`
    : "/api/templates";
  const res = await axiosInstance.get(url);
  return res.data?.data || res.data || [];
}

export async function createTemplate(payload) {
  const res = await axiosInstance.post("/api/admin/templates", payload);
  return res.data?.data || res.data;
}

