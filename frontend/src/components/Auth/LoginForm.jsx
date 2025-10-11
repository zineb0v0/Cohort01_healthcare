import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../zodeSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import axios from "../../axios";
import { toast } from "react-hot-toast";

export default function LoginForm() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data) => {
    try {
      console.log("Login data:", data);

      const response = await axios.post(
        "http://localhost:8000/api/login",
        data
      );

      console.log("Logged in:", response.data);
      const { access_token, role, user } = response.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role);
      console.log(user);

      if (role === "Patient") {
        toast.success("Connexion réussie !");
        navigate("/patient/dashboard");
      } else if (role === "Collaborateur") {
        toast.success("Connexion réussie !");
        navigate("/collaborator/dashboard");
      } else {
        toast.error("Rôle non reconnu, veuillez contacter l’administrateur.");
      }

      // Optional: clear the form after successful login
      reset();
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  return (
    <div className="flex-1 w-full min-h-screen">
      <CardContent className="p-4 w-[90%] ml-3 mt-20">
        <h1 className="text-4xl font-bold text-primary text-center mb-20">
          Connectez-vous à votre compte
        </h1>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 ml-6 h-full"
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-[80%]">
                  <FormLabel className="text-md" style={{ color: "#001F42" }}>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="exemple@mail.com"
                      type="email"
                      className={errors.email ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage>{errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-[80%]">
                  <FormLabel className="text-md" style={{ color: "#001F42" }}>
                    Mot de passe
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className={errors.password ? "border-red-500" : ""}
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage>{errors.password?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Forgot Password */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 w-[80%] py-2 px-4 text-right"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              className="w-[80%] py-2 px-4 text-md bg-foreground/90 text-white"
              type="submit"
            >
              Se connecter
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
