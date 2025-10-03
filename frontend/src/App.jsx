import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./router/index";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster /> 
    </>
  );
}

export default App;
