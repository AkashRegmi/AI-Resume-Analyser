import api from "../../../lib/axios";
export const createTransaction = async (data) => {
  const response = await api.post("/transition", data);
  return response.data;
};
export const getTransactions = async (params = {}) => {
  const response = await api.get("/transition", { params });
  return response.data;
};
export const getTransactionById = async (id) => {
  const response = await api.get(`/transition/${id}`);
  return response.data;
};
export const updateTransaction = async ({ id, data }) => {
  const response = await api.patch(`/transition/${id}`, data);
  return response.data;
};
export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transition/${id}`);
  return response.data;
};
