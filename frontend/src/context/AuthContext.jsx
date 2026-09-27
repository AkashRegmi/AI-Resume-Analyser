import { createContext, useState } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("accessToken"),
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken"),
  );
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo"));
  });
  const isAuthenticated = Boolean(accessToken && user);

  //   useEffect(() => {
  //     if (accessToken) {
  //       localStorage.setItem("accessToken", accessToken);
  //     } else {
  //       localStorage.removeItem("accessToken");
  //     }
  //   }, [accessToken]);

  const login = (accesstoken, refreshToken, userInfo) => {
    setAccessToken(accesstoken);
    setRefreshToken(refreshToken);
    setUser(userInfo);
    localStorage.setItem("accessToken", accesstoken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  };
  const logout = () => {
    setAccessToken(null);
    setUser(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
  };

  const value = {
    accessToken,
    refreshToken,
    isAuthenticated,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
