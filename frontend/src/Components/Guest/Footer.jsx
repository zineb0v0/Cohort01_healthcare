import { useState } from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "../../authentication/axios";
import { toast } from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Veuillez entrer un email valide."); // show error toast
      return;
    }

    try {
      const res = await api.post("/api/newsletter", { email });
      toast.success(res.data.message || "Email enregistré avec succès !"); // success toast
      setEmail(""); // clear input
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Erreur lors de l'enregistrement."
      ); // error toast
    }
  };

  return (
    <footer className="bg-[#001f42] text-white pt-5 pb-2 px-4 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-20 pb-4 border-b border-gray-600">
        {/* Colonne 1 */}
        <div className="w-100">
          <h1
            className="text-4xl text-[#79A1C0] font-medium mb-6"
            id="titlelogo"
          >
            RAFIQI HEALTHCARE
          </h1>
          <p className="text-lg text-gray-300 pb-2 leading-relaxed mb-6">
            Compagnon de santé personnalisé offrant la gestion des soins, des
            rendez-vous et le suivi des médicaments avec simplicité.
          </p>
          <div className="space-y-2.5 text-gray-300 text-[1.1rem]">
            <p className="flex items-center gap-2">
              <Mail size={20} /> Rafiqi@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <Phone size={20} /> +212389922189
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={20} /> Maroc
            </p>
          </div>
        </div>

        {/* Colonne 2 */}
        <div className="md:ml-26">
          <h4 className="font-semibold text-[#79A1C0] text-3xl mb-6">Liens:</h4>
          <ul className="space-y-3 text-gray-300 text-lg">
            <li>
              <a href="#Fonctionnalités" className="hover:text-white">
                Fonctionnalités
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-white">
                A propos de nous
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Colonne 3 */}
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-3xl text-[#79A1C0] mb-5">
              Réseaux sociaux:
            </h4>
            <div className="flex items-center space-x-3 mb-9">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1d3459] hover:bg-gray-200 transition"
                >
                  <Icon size={18} className="text-white" />
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-[#002b50] text-white py-4 rounded-xl shadow-lg border-3 mr-2 border-gray-500">
            <CardContent className="p-2 space-y-3">
              <h3 className="font-semibold text-white text-lg">
                Notre Newsletter
              </h3>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!text-[1.12rem] ml-1 w-[95%] font-semibold text-muted-foreground placeholder:text-muted-foreground/85 rounded-full bg-white"
              />

              <Button
                className="w-[95%] ml-1 rounded-full text-white font-semibold bg-[#79A1C0] text-[1.12rem] hover:bg-[#163c67] transform hover:scale-102 transition-transform duration-300"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center font-semibold text-gray-500 text-lg pt-4">
        © Rafiqi 2025. Tous droits réservés.
      </div>
    </footer>
  );
}
