import { api } from "./axios";

export const customerApi = {
  getAll: async () => {
    const res = await api.get("/customers");
    return res.data.data; // APIResponse wrapper
  },
  save: async (payload) => api.post("/customers", payload),
  update: async (payload) => api.put("/customers", payload),
  delete: async (id) => api.delete(`/customers/${id}`),
};
