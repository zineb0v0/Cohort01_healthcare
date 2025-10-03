// import { useNavigate } from "react-router-dom";
// import SideImage from "./SideImage";
// import RegisterForm from "./RegisterForm";
// export default function Register() {
//   const navigate = useNavigate();

//   const onSubmit = () => {
//     navigate("/");
//   };

//   const toggleForm = () => {
//     navigate("/login");
//   };

//   return (
//     <div className="flex min-h-screen w-full flex-col xl:flex-row">
//       {/* Left side - Side image */}
//       <SideImage />

//       {/* Right side - Register form */}
//       <div className="flex-1   bg-blue-50">
//         {/* <RegisterForm onSubmit={onSubmit} toggleForm={toggleForm} /> */}
//         <RegisterForm />
//       </div>
//     </div>
//   );
// }
import { useNavigate } from "react-router-dom";
import SideImage from "./SideImage"; // Import the SideImage component
import RegisterForm from "./RegisterForm"; // Your Register Form component

export default function Register() {
  const navigate = useNavigate();

  // Handle form submission (e.g., after successful registration)
  const onSubmit = () => {
    navigate("/"); // Navigate to home or another page after registration
  };

  // Toggle between Register and Login forms
  const toggleForm = () => {
    navigate("/login"); // Navigate to Login page when switching forms
  };

  return (
    <div className="flex min-h-screen w-full flex-col xl:flex-row">
      {/* Left side - Side image */}
      <SideImage isRegister={true} /> {/* Pass 'true' for Register form */}

      {/* Right side - Form container */}
      <div className="flex-1 bg-blue-50 transition-all ease-in-out duration-500">
        <div className="flex justify-between p-6">
          <button className="text-blue-500 p-5" onClick={toggleForm}>
            Se connecter
          </button>
        </div>

        {/* Initially show RegisterForm */}
        <div className="flex justify-center">
          <RegisterForm onSubmit={onSubmit} toggleForm={toggleForm} />
        </div>
      </div>
    </div>
  );
}
