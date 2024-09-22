import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "./form-error";
import { FormSucess } from "./form-sucess";
import useAuthStore from "@/hooks/useAuthStore";
import { useNavigate } from "react-router-dom";

interface LoginSchema {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setToken } = useAuthStore();
  const navigate = useNavigate()

  const form = useForm<LoginSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEDN_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const { token } = await response.json();
      setToken(token);
      setSuccess("Login successful");
      navigate("/");
    } catch (err) {
      setError((err as Error).message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Welcom Back"
      backButtonHref="/register"
      backButtonLbel="Don't have an account?"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              }}
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500"/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 3,
                  message: "Password must be at least 6 characters",
                },
              }}
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {!isLoading && error &&<FormError message={error} />}
          {!isLoading && success && <FormSucess message={success} />}
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
