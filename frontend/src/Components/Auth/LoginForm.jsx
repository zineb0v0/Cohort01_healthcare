import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../zodeSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import api from "../../authentication/axios";
import { toast } from "react-hot-toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);

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
    setValue,
    formState: { errors },
  } = form;

  // Charger l'email sauvegardé si existant (facultatif)
  useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setValue("email", savedEmail);
      setRemember(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/api/login", {
        ...data,
        remember, // envoyer remember au backend
      });

      const { access_token, role } = response.data;

      // Stocker token + role
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role);
      console.log("Token stored:", localStorage.getItem("access_token"));

      // Sauvegarder email si remember activé, sinon supprimer
      if (remember) {
        localStorage.setItem("remember_email", data.email);
      } else {
        localStorage.removeItem("remember_email");
      }

      toast.success("Connexion réussie !");
      navigate(
        role === "Patient" ? "/patient/dashboard" : "/collaborator/dashboard"
      );

      reset({ password: "" }); // on vide le mot de passe
    } catch (error) {
      console.error(error);
      toast.error("Email ou mot de passe incorrect !");
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

            {/* Remember Me + Forgot Password */}
            <div className="flex justify-between items-center w-[80%]">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                <span className="text-[#00345d]">Se souvenir de moi</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600"
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
