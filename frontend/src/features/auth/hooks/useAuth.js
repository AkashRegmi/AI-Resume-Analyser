import { useMutation } from "@tanstack/react-query";
import { registerUser, verifyOTP, loginUser } from "../api/auth.api.js";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: verifyOTP,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
