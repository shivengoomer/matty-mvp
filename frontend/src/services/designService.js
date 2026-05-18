import axiosInstance from "../utils/axiosinstance";

export async function renameDesign(id, name) {
  const res = await axiosInstance.put(`/api/designs/${id}`, { name });
  return res.data?.data || res.data;
}

export async function removeDesign(id) {
  await axiosInstance.delete(`/api/designs/${id}`);
}

export async function fetchActivity() {
  const res = await axiosInstance.get("/api/designs?limit=25&page=1");
  const payload = res.data?.data ? res.data : { data: res.data };
  const designs = payload?.data || [];

  return designs.map((design) => ({
    id: design._id,
    title: `${design.name || "Untitled"} updated`,
    timestamp: design.updatedAt || design.createdAt,
    type: "design",
  }));
}

