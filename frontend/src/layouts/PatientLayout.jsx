import React from "react";
import { Outlet } from "react-router-dom";

function PatientLayout(props) {
  return (
    <>
      <header>Header patient</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </>
  );
}

export default PatientLayout;
