import React from "react";
import { Outlet } from "react-router-dom";

function GuestLayout(props) {
  return (
    <>
      <header>Header public user</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </>
  );
}

export default GuestLayout;
