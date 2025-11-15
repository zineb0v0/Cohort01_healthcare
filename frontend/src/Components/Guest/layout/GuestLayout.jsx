import { Outlet } from "react-router-dom";

import Navbar from "../Navbar";

import Footer from "../Footer";
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