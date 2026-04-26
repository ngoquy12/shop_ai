"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AuthCard,
  SocialButtons,
  AuthDivider,
  PasswordInput,
  AlertBox,
} from "@/components/auth/auth-ui";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFirebaseLogin, useLogin } from "../hooks/use-login";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { mutateAsync: login, isPending: isLoginPending } = useLogin();
  const { mutateAsync: firebaseLogin } = useFirebaseLogin();
  const [errorMsg, setErrorMsg] = useState("");
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const isPending = isLoginPending || socialLoading !== null;

  const handleGoogleLogin = async () => {
    try {
      setSocialLoading("google");
      setErrorMsg("");
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await firebaseLogin({ idToken });

      router.push(callbackUrl);
    } catch (err) {
      const error = err as { code?: string };
      if (error?.code === "auth/popup-closed-by-user") return;
      setErrorMsg("Đăng nhập Google thất bại. Vui lòng thử lại!");
      console.error("Lỗi Google Auth:", error);
    } finally {
      setSocialLoading(null);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setErrorMsg("");
      await login(data);

      router.push(callbackUrl);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        setErrorMsg(
          (error as { message: string }).message ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại!",
        );
      } else {
        setErrorMsg("Đăng nhập thất bại. Vui lòng kiểm tra lại!");
      }
    }
  };

  return (
    <AuthCard
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để tiếp tục quản lý tài khoản và khóa học của bạn"
    >
      {/* Social */}
      <SocialButtons
        loading={socialLoading}
        onGoogle={handleGoogleLogin}
        googleLabel="Đăng nhập với Google"
      />

      <AuthDivider />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {errorMsg && <AlertBox type="error" message={errorMsg} />}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="user@shopai.vn"
                    className="h-11"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <FormLabel>Mật khẩu</FormLabel>
                  <Link
                    href="/quen-mat-khau"
                    className="text-sm font-medium text-primary hover:text-primary/90 hover:underline"
                    tabIndex={-1}
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput
                    id="login-password"
                    label="" /* Bỏ nhãn vì đã dùng FormLabel bên ngoài */
                    placeholder="********"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            id="btn-login-submit"
            type="submit"
            size="lg"
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md shadow-primary/20 mt-6!"
            disabled={isPending}
          >
            {isPending ? "Đang xác thực..." : "Đăng nhập"}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        Chưa có tài khoản?{" "}
        <Link
          href="/dang-ky"
          className="text-primary hover:text-primary/90 font-semibold hover:underline underline-offset-4"
        >
          Đăng ký ngay
        </Link>
      </p>
    </AuthCard>
  );
};
