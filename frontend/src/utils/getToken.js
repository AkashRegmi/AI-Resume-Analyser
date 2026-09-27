export const getAccessToken = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Not found Access Token");
  }
  return accessToken;
};
export const getRefreshToken = () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("Not found Access Token");
  }
  return refreshToken;
};
