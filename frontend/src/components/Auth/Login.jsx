// import React from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
// import LoginForm from "./LoginForm";
// import SideImage from "./SideImage";
// export default function Login() {
//   const navigate = useNavigate(); // Hook to navigate between routes

//   const onSubmit = () => {
//     // Handle submission logic, then navigate to home or dashboard after login
//     navigate("/"); // or navigate to the appropriate page after login
//   };

//   return (
//     <div className="flex h-full w-full flex-col lg:flex-row xl:flex-row">
//       {/* Left side (Image + Text) */}
//       <SideImage isRegisterTab={true} /> {/* Show appropriate image */}

//       {/* Right side (Register form) */}
//       <div className="relative flex h-full w-full flex-1 pr-9 justify-center bg-white">
//         <LoginForm onSubmit={onSubmit} /> {/* Pass onSubmit function to form */}
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";
import SideImage from "./SideImage"; // Import SideImage component
import LoginForm from "./LoginForm"; // Your Login Form component

export default function Login() {
  const navigate = useNavigate();

  // Handle form submission (e.g., after successful login)
  const onSubmit = () => {
    navigate("/"); // Navigate to home or another page after login
  };

  // Toggle between Login and Register forms
  const toggleForm = () => {
    navigate("/register"); // Navigate to Register page when switching forms
  };

  return (
    <div className="flex min-h-screen w-full flex-col xl:flex-row">
      {/* Left side - Side image */}
      <SideImage isRegister={false} /> {/* Pass 'false' for Login form */}

      {/* Right side - Login form */}
      <div className="flex-1 bg-blue-50 transition-all ease-in-out duration-500">
        <div className="flex justify-between p-6">
          <button className="text-blue-500 py-2 px-4" onClick={toggleForm}>
            Créer un compte
          </button>
        </div>

        {/* Show LoginForm */}
        <div className="flex justify-center">
          <LoginForm onSubmit={onSubmit} toggleForm={toggleForm} />
        </div>
      </div>
    </div>
  );
}
