// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { loginSchema } from "../zodeSchema"; // Import your login schema
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { CardContent } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import axios from "../../axios";
// import { toast } from "sonner";

// export default function LoginForm() {
//   const [tabValue, setTabValue] = useState("patient"); // Default to "patient"
//   const navigate = useNavigate();

//   const form = useForm({
//     resolver: zodResolver(loginSchema), // Apply the Login schema
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//     mode: "all",
//   });

//   const {
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = form;

//   useEffect(() => {
//     // Reset the form fields when switching tabs
//     reset({
//       email: "",
//       password: "",
//     });
//   }, [tabValue, reset]);
//   const getCsrfCookie = async () => {
//     try {
//       await axios.get("http://localhost:8000/sanctum/csrf-cookie").then(response => {
//         console.log(response)});
//     } catch (error) {
//       console.error("Error fetching CSRF cookie:", error);
//     }
//   };
//   const onSubmit = async (data) => {
//     try {
//       await getCsrfCookie(); // Ensure CSRF token is set first

//       // Send login request
//       const response = await axios.post(
//         "http://localhost:8000/api/login",
//         data
//       );

//       // Log the entire response for debugging
//       console.log("Logged in:", response.data);

//       // Assuming the response contains user data with a 'role' field and access_token
//       const { access_token, role } = response.data;

//       // Save the token in localStorage
//       localStorage.setItem("access_token", access_token); // Store the token

//       // Log the role for debugging
//       console.log(role);

//       // Redirect based on the role (with proper capitalization)
//       if (role === "Patient") {
//         toast.success("Connexion réussie !");
//         navigate("/patient/dashboard");
//       } else if (role === "Collaborateur") {
//         toast.success("Connexion réussie !");
//         navigate("/collaborator/dashboard");
//       } else {
//         toast.error("Role non reconnu, veuillez contacter l'administrateur.");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       toast.error("Login failed. Please try again.");
//     }
//   };

//   return (
//     <div className="flex-1 w-full bg-blue-50 pb-1 pt-2">
//       <CardContent className="p-4 w-full">
//         <h1
//           className="text-4xl font-bold text-center mb-10"
//           style={{ color: "#001F42" }}
//         >
//           Connectez-vous à votre compte
//         </h1>

//         {/* Tabs for switching between user roles */}
//         <Tabs value={tabValue} onValueChange={setTabValue} className="mb-6">
//           <TabsList className="grid grid-cols-2 w-full">
//             <TabsTrigger value="patient" className="flex items-center gap-2">
//               <img src="userIcon.png" className="w-5 h-5" alt="patient icon" />{" "}
//               Patient
//             </TabsTrigger>
//             <TabsTrigger value="provider" className="flex items-center gap-2">
//               <img
//                 src="providerimg2.png"
//                 className="w-6 h-6"
//                 alt="provider icon"
//               />{" "}
//               Professionnel de santé
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>

//         <Form {...form}>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 h-full">
//             {/* Email Field */}
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-md" style={{ color: "#001F42" }}>
//                     Email
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       placeholder="exemple@mail.com"
//                       type="email"
//                       className={errors.email ? "border-red-500" : ""}
//                     />
//                   </FormControl>
//                   <FormMessage>{errors.email?.message}</FormMessage>
//                 </FormItem>
//               )}
//             />

//             {/* Password Field */}
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-md" style={{ color: "#001F42" }}>
//                     Mot de passe
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       type="password"
//                       className={errors.password ? "border-red-500" : ""}
//                       autoComplete="current-password"
//                     />
//                   </FormControl>
//                   <FormMessage>{errors.password?.message}</FormMessage>
//                 </FormItem>
//               )}
//             />

//             {/* Forgot Password */}
//             <div className="flex justify-between">
//               <button
//                 type="button"
//                 onClick={() => navigate("/forgot-password")}
//                 className="text-blue-600"
//               >
//                 Mot de passe oublié ?
//               </button>
//             </div>

//             {/* Submit Button */}
//             <Button
//               className="w-full text-md bg-[#001F42] text-white"
//               type="submit"
//             >
//               Se connecter
//             </Button>

//             {/* Sign Up Link */}
//             <p
//               className="text-md text-center mt-2"
//               style={{ color: "#001F42" }}
//             >
//               Pas encore de compte ?{" "}
//               <Link to="/register" className="text-blue-600">
//                 S'inscrire
//               </Link>
//             </p>
//           </form>
//         </Form>
//       </CardContent>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../zodeSchema"; // Import your login schema
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
import { toast } from "sonner";

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
  const customToastStyle = {
    backgroundColor: "#15a018",
    color: "white",
  };
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const getCsrfCookie = async () => {
    try {
      await axios
        .get("http://localhost:8000/sanctum/csrf-cookie")
        .then((response) => {
          console.log(response);
        });
    } catch (error) {
      console.error("Error fetching CSRF cookie:", error);
    }
  };
  useEffect(() => {
    // Fetch CSRF token once when the component is mounted
    getCsrfCookie();
  }, []); // Empty dependency array means it runs only once on mount

  useEffect(() => {
    // Reset the form fields when switching tabs
    reset({
      email: "",
      password: "",
    });
  }, [reset]);
  const onSubmit = async (data) => {
    try {
      console.log(data);

      // Send login request
      const response = await axios.post(
        "http://localhost:8000/api/login",
        data,
        {
          withCredentials: true, // Send credentials (cookies) with the request
        }
      );

      // Log the entire response for debugging
      console.log("Logged in:", response.data);
      const { message, access_token, role, user } = response.data;

      // Log the success message from the response
      console.log(message); // Logs: "Connexion avec succès"

      // Log the user data for debugging
      console.log(user); // Logs user object with profile, patient, and collaborator

      // Store the token securely in localStorage
      localStorage.setItem("access_token", access_token); // Store token
      localStorage.setItem("role", role); // Store the role

      // Log the role for debugging
      console.log("User role:", role);

      // Redirect based on the role (Patient or Collaborateur)
      if (role === "Patient") {
        toast.success("Connexion réussie !", { style: customToastStyle });
        navigate("/patient/dashboard");
      } else if (role === "Collaborateur") {
        toast.success("Connexion réussie !", { style: customToastStyle });
        navigate("/collaborator/dashboard");
      } else {
        toast.error("Role non reconnu, veuillez contacter l'administrateur.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      toast.error("Échec de la connexion. Veuillez réessayer.", {
        style: {
          backgroundColor: "#dd160f",
          color: "white",
        },
      });
    }
  };

  return (
    <div className="flex-1 w-full min-h-screen  ">
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
                <FormItem className={"w-[80%]"}>
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
                <FormItem className={"w-[80%]"}>
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

            {/* Sign Up Link */}
            {/* <p
              className="text-md text-center mt-2"
              style={{ color: "#001F42" }}
            >
              Pas encore de compte ?{" "}
              <button
                type="button"
                className="text-blue-500"
                onClick={() => setIsRegister(true)} // Switch to login mode
              >
                Créer votre compte
              </button>
            </p> */}
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
