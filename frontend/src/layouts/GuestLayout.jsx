import React from "react";
import { Outlet } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Guest/Navbar";
import Hero from "@/components/Guest/Hero";
import Services from "@/components/Guest/Services";
import About from "@/components/Guest/About";
import Testimonials from "@/components/Guest/Testimonials";
import Faq from "@/components/Guest/Faq";
import Footer from "@/components/Guest/Footer";
function GuestLayout(props) {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default GuestLayout;
