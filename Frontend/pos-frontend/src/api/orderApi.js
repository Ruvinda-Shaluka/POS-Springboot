import { api } from "./axios";
export const orderApi = {
  placeOrder: (payload) => api.post("/orders", payload),
};
