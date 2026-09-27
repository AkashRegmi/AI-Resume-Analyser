import api from "../../../lib/axios";

export const getDashboard = async (params) => {
  const response = await api.get("/dashboard", { params });
  return response.data;
};
