
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";

import { Button } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@mui/material/Input";
import { apiFetch } from "@/lib/apiFetch";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

type UserSchemaType = z.infer<typeof LoginFormSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: UserSchemaType) {
    try {
      await apiFetch("api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  return (
    <div className="items-center justify-center">
      <div className="flex w-full flex-col gap-4 rounded-2xl bg-white p-12 shadow-2xl">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-center text-2xl font-bold">Login</h1>

          <p className="mt-2 max-w-55 text-center text-gray-400">
            Enter your details to get login to your account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-bold">
                Email
              </label>

              <Input
                id="email"
                type="email"
                {...register("email")}
              />

              {errors.email && (
                <p>{errors.email.message}</p>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-1">
              <label htmlFor="password" className="font-bold">
                Password
              </label>

              <Input
                id="password"
                type="password"
                {...register("password")}
                className="mb-5"
              />

              {errors.password && (
                <p>{errors.password.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" variant="contained">
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Dont have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-black hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}