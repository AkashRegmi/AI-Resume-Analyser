import { Link, useLocation, useNavigate } from "react-router-dom";
import { verifyOTPSchema } from "../schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getError } from "../../../utils/errorHandler";
import toast from "react-hot-toast";
import { Input } from "../../../components/ui/Input";
import AuthLayout from "../../../components/layout/AuthLayout";
import { ArrowRight, Mail } from "lucide-react";
import Button from "../../../components/ui/Button";
import { useVerifyOTP } from "../hooks/useAuth";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { mutate: verifyOTP, isPending } = useVerifyOTP();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyOTPSchema),

    defaultValues: {
      email: email || "",
      otp: "",
    },
  });
  const onSubmit = (data) => {
    verifyOTP(data, {
      onSuccess: () => {
        toast.success("Email verified successfully.");

        navigate("/login", {
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
          <Mail className="h-7 w-7 text-finance-gold" />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-finance-dark">
          Verify your email
        </h2>

        <p className="mt-2 text-sm leading-6 text-finance-muted">
          Enter the 4-digit verification code we sent to your email to finish
          setting up your account.
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
          id="otp"
          label="Verification code"
          type="text"
          inputMode="numeric"
          maxLength={4}
          placeholder="Enter 4-digit OTP"
          autoComplete="one-time-code"
          error={errors.otp?.message}
          {...register("otp")}
        />

        <Button type="submit" loading={isPending} className="w-full">
          Verify email
          <ArrowRight className="h-5 w-5" />
        </Button>
      </form>

      <div className="mt-7 text-center">
        <p className="text-sm text-finance-muted">Entered the wrong email?</p>

        <Link
          to="/register"
          className="mt-1 inline-block text-sm font-semibold text-finance-primary transition hover:text-finance-dark"
        >
          Create another account
        </Link>
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;
