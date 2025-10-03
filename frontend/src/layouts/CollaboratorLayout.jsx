import React from "react";
import { Outlet } from "react-router-dom";

function CollaboratorLayout(props) {
  return (
    <>
      <header>Header collaborator</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </>
  );
}

export default CollaboratorLayout;
