import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  patientRegisterSchema,
  collaboratorRegisterSchema,
} from "../zodeSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "sonner";

export default function RegisterForm() {
  const initialTab = localStorage.getItem("tabValue") || "Patient";
  const [tabValue, setTabValue] = useState(initialTab);
  const navigate = useNavigate();
  const customToastStyle = {
    backgroundColor: "#15a018",
    color: "white",
  };
  const schema =
    tabValue === "Patient" ? patientRegisterSchema : collaboratorRegisterSchema;

  function getDefaultValues() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      address: "",
      date_birth: "",
      gender: "homme",
      urgency_number: "",
      speciality: "",
      license_number: "",
      workplace: "",
      is_available: true,
      availability: "",
    };
  }

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(),
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = form;

  useEffect(() => {
    localStorage.setItem("tabValue", tabValue);
    reset(getDefaultValues());
  }, [tabValue, reset]);
  const handleRoleSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        role: tabValue, // Get the selected role
      };

      // Fetch CSRF token before submitting the form
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true, // Ensure the cookie is sent with the request
      });

      // Send registration request
      const response = await axios.post(
        "http://localhost:8000/api/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN":
              document.head.querySelector('meta[name="csrf-token"]').content ||
              "",
          },
          withCredentials: true, // Send credentials (cookies)
        }
      );

      // Save the access token in localStorage
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("role", response.data.role);

        localStorage.setItem("user", JSON.stringify(response.data.user)); // Save user data
      }

      toast.success("Inscription réussie !", {
        style: customToastStyle,
      });
      // Get the role from the backend response and redirect accordingly
      const userRole = response.data.role; // This is the role from the backend
      console.log("User role from response:", userRole); // Log the role for debugging
      navigate(
        userRole === "Patient"
          ? "/patient/dashboard"
          : "/collaborator/dashboard"
      ); // Redirect based on the role
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
      if (error.response && error.response.data.errors) {
        toast.error(error.response?.data.errors);
      } else {
        toast.error("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div className="flex-1 w-full  pb-1 pt-2">
      <CardContent className="p-5 w-full">
        <h1
          className="text-4xl font-bold text-center p-10"
          style={{ color: "#001F42" }}
        >
          Créez votre compte
        </h1>

        <Tabs value={tabValue} onValueChange={setTabValue} className="mb-8">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="Patient" className="flex items-center gap-2">
              <img src="userIcon.png" className="w-5 h-5" alt="patient icon" />{" "}
              Patient
            </TabsTrigger>
            <TabsTrigger
              value="Collaborateur"
              className="flex items-center gap-2"
            >
              <img
                src="providerimg2.png"
                className="w-6 h-6"
                alt="Professionnel de santé"
              />{" "}
              Professionnel de santé
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(handleRoleSubmit)}
            className="space-y-4 h-full"
          >
            {/* First Name & Last Name */}
            <div className="flex gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-md"
                        style={{ color: "#001F42" }}
                      >
                        Prénom
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Prénom"
                          autoComplete="given-name"
                          className={errors.first_name ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage>{errors.first_name?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-md"
                        style={{ color: "#001F42" }}
                      >
                        Nom
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nom"
                          autoComplete="family-name"
                          className={errors.last_name ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage>{errors.last_name?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md" style={{ color: "#001F42" }}>
                    Numéro de téléphone
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Numéro de téléphone"
                      autoComplete="tel"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage>{errors.phone?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md" style={{ color: "#001F42" }}>
                    Adresse
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Adresse"
                      autoComplete="street-address"
                      className={errors.address ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage>{errors.address?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md" style={{ color: "#001F42" }}>
                    Date de naissance
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      autoComplete="bday"
                      className={errors.date_birth ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage>{errors.date_birth?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md" style={{ color: "#001F42" }}>
                    Sexe
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      autoComplete="sex"
                      className="w-full px-4 py-2 border rounded-md"
                    >
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </FormControl>
                  <FormMessage>{errors.gender?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urgency_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md" style={{ color: "#001F42" }}>
                    Numéro d'urgence
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Numéro d'urgence"
                      autoComplete="tel"
                      className={errors.urgency_number ? "border-red-500" : ""}
                    />
                  </FormControl>
                  <FormMessage>{errors.urgency_number?.message}</FormMessage>
                </FormItem>
              )}
            />

            {tabValue === "Collaborateur" && (
              <>
                <FormField
                  control={form.control}
                  name="speciality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-md"
                        style={{ color: "#001F42" }}
                      >
                        Spécialité
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Cardiologue"
                          className={errors.speciality ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage>{errors.speciality?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="license_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-md"
                        style={{ color: "#001F42" }}
                      >
                        Numéro de licence
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Numéro de licence"
                          className={
                            errors.license_number ? "border-red-500" : ""
                          }
                        />
                      </FormControl>
                      <FormMessage>
                        {errors.license_number?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workplace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-md"
                        style={{ color: "#001F42" }}
                      >
                        Lieu de travail
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ex: Nom de l'hôpital"
                          className={errors.workplace ? "border-red-500" : ""}
                        />
                      </FormControl>
                      <FormMessage>{errors.workplace?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </>
            )}

            {tabValue === "Collaborateur" && (
              <>
                <FormField
                  control={form.control}
                  name="is_available"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-md"
                        style={{ color: "#001F42" }}
                      >
                        Disponible
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          value={field.value === true}
                          onChange={(e) =>
                            field.onChange(e.target.value === "true")
                          } // Convert string "true"/"false" to boolean
                          className="w-full px-4 py-2 border rounded-md"
                        >
                          <option value={true}>Oui</option>
                          <option value={false}>Non</option>
                        </select>
                      </FormControl>

                      <FormMessage>{errors.is_available?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                {watch("is_available") === true && (
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="text-md"
                          style={{ color: "#001F42" }}
                        >
                          Disponibilité
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            className={
                              errors.availability ? "border-red-500" : ""
                            }
                          />
                        </FormControl>
                        <FormMessage>
                          {errors.availability?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                )}
              </>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md" style={{ color: "#001F42" }}>
                    Mot de passe
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className={errors.password ? "border-red-500" : ""}
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage>{errors.password?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md" style={{ color: "#001F42" }}>
                    Confirmer le mot de passe
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className={
                        errors.password_confirmation ? "border-red-500" : ""
                      }
                      autoComplete="new-password"
                    />
                  </FormControl>
                  <FormMessage>
                    {errors.password_confirmation?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <div className="flex justify-center mt-6">
              <Button
                className="text-md p-5 w-full bg-foreground/90 text-lg text-white"
                type="submit"
              >
                S'inscrire
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
