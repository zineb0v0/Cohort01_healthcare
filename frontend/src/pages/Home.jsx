import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Guest/Hero";
import Services from "@/components/Guest/Services";
import About from "@/components/Guest/About";
import Testimonials from "@/components/Guest/Testimonials";
import Faq from "@/components/Guest/Faq";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
function Home() {
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      const section = document.getElementById(sectionId);
      if (section) {
        const y = section.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Services />
      <About />
      <Testimonials />
      <Faq />
    </>
  );
}

export default Home;
