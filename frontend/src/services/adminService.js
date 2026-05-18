import axiosInstance from "../utils/axiosinstance";

export async function fetchAdminDesigns() {
  const res = await axiosInstance.get("/api/admin/designs");
  return res.data?.data || res.data || [];
}

export async function deleteAdminDesign(designId) {
  await axiosInstance.delete(`/api/admin/designs/${designId}`);
}

export async function fetchUsers() {
  const res = await axiosInstance.get("/api/admin/getUsers");
  return res.data?.data || res.data || [];
}

export async function deleteUser(userId) {
  await axiosInstance.delete(`/api/admin/deleteUser/${userId}`);
}

