
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import Input from "@mui/material/Input";
import { useRouter } from "next/navigation";
import Link from "next/link";

const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(6, { message: "Username must be at least 6 characters long." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Confirm Password must be at least 8 characters long.",
      }),
  })
  .refine(
    (data: { password: string; confirmPassword: string }) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    }
  );

type UserSchemaType = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchemaType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: UserSchemaType) {
    try {
      await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="flex w-full max-w-md flex-col gap-4 p-12 px-15 shadow-2xl">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-center text-2xl font-bold">Register</h1>

          <p className="mt-2 max-w-55 text-gray-400">
            Enter your details to create a new account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="font-bold">
                Username
              </label>

              <Input
                id="username"
                type="text"
                {...register("username")}
              />

              {errors.username && (
                <p>{errors.username.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
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

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-bold">
                Password
              </label>

              <Input
                id="password"
                type="password"
                {...register("password")}
              />

              {errors.password && (
                <p>{errors.password.message}</p>
              )}
            </div>

            <div className="mb-3 flex flex-col gap-2">
              <label htmlFor="confirmPassword" className=" font-bold">
                Confirm Password
              </label>

              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />

              {errors.confirmPassword && (
                <p>{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" variant="contained">
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-black hover:underline"
          >
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}

