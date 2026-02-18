import { api } from "./axios";

export const itemApi = {
  getAll: async () => {
    const res = await api.get("/items");
    return res.data.data; // APIResponse wrapper
  },
  save: async (payload) => api.post("/items", payload),
  update: async (payload) => api.put("/items", payload),
  delete: async (id) => api.delete(`/items/${id}`),
  // getAll: async () => (await api.get("/items")).data.data,
};
