import api from "../../../lib/axios";

export const getUsers = async ({ page, limit }) => {
  const response = await api.get("/admin/users", {
    params: { page, limit },
  });

  return response.data;
};
