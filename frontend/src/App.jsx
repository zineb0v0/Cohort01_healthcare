import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./router/index";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />

      <RouterProvider router={router}/>
    </>
  );
}

export default App;
