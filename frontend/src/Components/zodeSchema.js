import { z } from "zod";

//  Champs communs aux deux rôles
const baseFields = {
  first_name: z
    .string()
    .min(3, { message: "Le prénom doit comporter au moins 3 caractères" }),
  last_name: z
    .string()
    .min(3, { message: "Le nom doit comporter au moins 3 caractères" }),
  email: z.email({ message: "Adresse email invalide" }),
  phone: z.string().regex(/^\+?\d{10,15}$/, {
    message: "Le numéro de téléphone doit être valide (10-15 chiffres)",
  }),
  password: z.string().min(8, {
    message: "Le mot de passe doit comporter au moins 8 caractères",
  }),
  password_confirmation: z.string().min(8, {
    message:
      "La confirmation du mot de passe doit comporter au moins 8 caractères",
  }),
  address: z
    .string()
    .min(4, { message: "L'adresse doit comporter au moins 4 caractères" }),
  date_birth: z
    .string()
    .min(1, { message: "La date de naissance est requise" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Veuillez entrer une date de naissance valide",
    }),
  gender: z.enum(["homme", "femme"]),
  emergency_contact: z
    .string()
    .nullable() // Allow null values
    .refine((val) => val === null || val === "" || /^\+?\d{10,15}$/.test(val), {
      message: "Numéro d'urgence invalide (10-15 chiffres)",
    })
    .optional(), // Optional because it can be null or empty
};
// Schéma Patient
export const patientRegisterSchema = z
  .object({
    ...baseFields,
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });

//  Schéma Collaborateur
export const collaboratorRegisterSchema = z
  .object({
    ...baseFields,
    speciality: z.string().min(3, {
      message: "La spécialité doit comporter au moins 3 caractères",
    }),
    license_number: z.string().min(5, {
      message: "Le numéro de licence doit comporter au moins 5 caractères",
    }),
    workplace: z.string().min(3, {
      message: "Le lieu de travail doit comporter au moins 3 caractères",
    }),
    isAvailable: z.boolean(),
    availability: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isAvailable) {
        return data.availability?.trim() !== "";
      }
      return true;
    },
    {
      path: ["availability"],
      message: "Veuillez indiquer votre disponibilité",
    }
  )

  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });

// Schéma connexion (login)
export const loginSchema = z.object({
  email: z.email({ message: "Adresse email invalide" }),
  password: z.string().min(8, {
    message: "Le mot de passe doit comporter au moins 8 caractères",
  }),
});

export const contactSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Le nom doit comporter au moins 3 caractères" }),
  phone: z.string().regex(/^\+?\d{10,15}$/, {
    message: "Le numéro de téléphone doit être valide (10-15 chiffres)",
  }),
  email: z.string().email({ message: "Adresse email invalide" }),
  message: z
    .string()
    .min(5, { message: "Le message doit comporter au moins 5 caractères" }),
});
