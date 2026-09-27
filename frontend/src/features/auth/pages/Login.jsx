import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";

import AuthLayout from "../../../components/layout/AuthLayout.jsx";

import Button from "../../../components/ui/Button.jsx";

import { LoginSchema } from "../schemas/auth.schema.js";
import { useLogin } from "../hooks/useAuth.js";
import { getError } from "../../../utils/errorHandler.js";
import { Input } from "../../../components/ui/Input.jsx";
import { useAuthContext } from "../../../context/useAuthContext.jsx";

export default function Login() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const { mutate: loginUser, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    loginUser(data, {
      onSuccess: (response) => {
        const accessToken =
          response?.data?.accessToken || response?.accessToken;

        if (!accessToken) {
          toast.error("Login succeeded but no access token was received.");
          return;
        }

        const refreshToken =
          response?.data?.refreshToken || response?.refreshToken;

        if (!refreshToken) {
          toast.error("Login succeeded but no refresh token was received.");
          return;
        }

        const userInfo = response?.data?.user || response?.user;

        if (!userInfo) {
          toast.error("Login succeeded but no user was received.");
          return;
        }

        login(accessToken, refreshToken, userInfo);

        toast.success("Welcome back!");

        navigate(userInfo.role === 1 ? "/admin/users" : "/analyze", {
          replace: true,
        });
      },

      onError: (error) => {
        toast.error(getError(error));
      },
    });
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-finance-gold/15">
          <LockKeyhole className="h-7 w-7 text-finance-gold" />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-finance-dark">
          Welcome back
        </h2>

        <p className="mt-2 text-sm text-finance-muted">
          Sign in to get started with your resume analysis.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-5"
      >
        <Input
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" loading={isPending} className="w-full">
          Sign in
          <ArrowRight className="h-5 w-5" />
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-finance-muted">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-finance-primary transition hover:text-finance-dark"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
