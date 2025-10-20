
import Hero from "../../Components/Guest/Hero";
import Services from "../../Components/Guest/Services";
import About from "../../Components/Guest/About";
import Testimonials from "../../Components/Guest/Testimonials";
import Faq from "../../Components/Guest/Faq";
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
