import api from "../../../lib/axios";

const BUDGETS_URL = "/budgets";

export const createBudget = async (data) => {
  const response = await api.post(BUDGETS_URL, data);
  return response.data;
};

export const getBudgets = async () => {
  const response = await api.get(BUDGETS_URL);
  return response.data;
};

export const getBudgetById = async (id) => {
  const response = await api.get(`${BUDGETS_URL}/${id}`);
  return response.data;
};

export const updateBudget = async ({ id, data }) => {
  const response = await api.patch(`${BUDGETS_URL}/${id}`, data);
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await api.delete(`${BUDGETS_URL}/${id}`);
  return response.data;
};
