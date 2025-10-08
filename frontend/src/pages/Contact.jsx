import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/components/zodeSchema";
import { useEffect } from "react";
export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/contact",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      alert(response.data.message);
      reset();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-18">
      {/* Title in same color as inputs */}
      <div className="w-full bg-[#c9d9e3] h-full p-12 mb-9 shadow">
        <h1 className="text-3xl font-semibold text-center text-[#0a1e3f]">
          Contact Us
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-10 max-w-6xl w-full px-4 md:px-10">
        {/* Form Card */}
        <Card className="flex-1 bg-white border-0 rounded-2xl mb-14 p-6 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Nom"
                    className="rounded-full bg-[#c9d9e3] text-[#0a1e3f]  h-10  !text-lg placeholder:text-[#0a1e3f]/70 placeholder:text-lg px-5 py-3"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Téléphone"
                    className="rounded-full bg-[#c9d9e3] text-[#0a1e3f]  h-10  !text-lg placeholder:text-[#0a1e3f]/70 placeholder:text-lg px-5 py-3"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  className="rounded-full bg-[#c9d9e3] text-[#0a1e3f] h-10 !text-lg placeholder:text-[#0a1e3f]/70 placeholder:text-lg px-5 py-3"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Textarea
                  placeholder="Message"
                  className="rounded-xl bg-[#c9d9e3] text-[#0a1e3f]  h-10  !text-lg placeholder:text-[#0a1e3f]/70 placeholder:text-lg min-h-[120px] px-5 py-3"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-red-600 text-sm">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#002b50] text-white px-10 py-6 text-lg  rounded-md w-full transform hover:scale-102 transition-transform duration-300"
              >
                {isSubmitting ? "Envoi..." : "Envoyer"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Infos */}
        <div className="flex flex-col gap-6 w-full md:w-[300px] bg-white p-5 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 bg-[#002b50] text-white p-5 rounded-xl shadow">
              <Phone size={22} />
              <span>(+212)700658555</span>
            </div>
            <div className="flex items-center gap-3 bg-[#79A1C0] text-[#0a1e3f] p-5 rounded-xl shadow">
              <Mail size={22} />
              <span>rafiqi@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 bg-[#d0dee8] text-[#0a1e3f] p-5 rounded-xl shadow">
              <MapPin size={22} className="text-[#79A1C0]" />
              <span>Morocco</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
