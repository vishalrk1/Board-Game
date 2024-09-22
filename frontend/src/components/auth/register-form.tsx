import { useState } from "react";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
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

interface RegisterFormProps {
  email: string;
  password: string;
}

const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<RegisterFormProps>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: RegisterFormProps) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/register", {
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
      headerLabel="Create an account"
      backButtonHref="/login"
      backButtonLbel="Already have an account?"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              //   disabled={isPending}
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              //   disabled={isPending}
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
          <FormError message={error} />
          <FormSucess message={success} />
          <Button className="w-full" type="submit" disabled={isLoading}>
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
