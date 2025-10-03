export default function SideImage({ isRegister }) {
  return (
    <div
      className={`relative flex items-stretch min-h-screen w-full flex-1 ${
        isRegister ? "order-last xl:order-first" : ""
      }`}
    >
      {/* <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="blue" />
      </svg> */}
      <div className="relative w-full h-full ">
        <img
          src="/imagetoleft.jpg"
          alt="Health"
          className="w-full h-full"
          style={{
            clipPath: "polygon(0 0%, 84% 0%, 100% 100%, 0 100%)",
            // objectFit: "",
            // clipPath: "polygon(0 100%, 100% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>

      {/* <svg
        className="absolute inset-0 w-full h-full "
          preserveAspectRatio="xMidYMid slice"

        viewBox="13 -19.24 713.107 715.009"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="mask0" mask-type="alpha">
          <path
            fill="#0099ff"
            d="M -100.063 780.248 L 830.874 495.435 L 833.884 -25.67 L -81.221 -23.215 ..."
            transform="matrix(0, -1, 1.6, 0, 0.000031, -0.000063)"
          />
        </mask>
        <g mask="url(#mask0)">
          <path
            fill="#0099ff"
            d="M -89.063 734.248 L 834.874 472.435 L 833.884 -19.67 ..."
            transform="matrix(0, -1, 1, 0, 0.000031, -0.000063)"
          />
          <image
            href="/imagetoleft copie2 (1) (1).jpg"
            preserveAspectRatio="none"
            x="-155"
            y="-83"
            width="100%"
            height="136%"
            style={{ transform: "rotate(-12deg)" }}
          />
        </g>
      </svg> */}

      {/* Overlay Text */}
      <div className="absolute top-[10%]  left-4 w-[85%] text-white px-6">
        <h1 className="text-5xl  font-bold mb-24">
          Your AI Healthcare Companion
        </h1>
        <p className="my-9 font-semibold leading-normal text-2xl">
          Experience seamless healthcare management with Echo – your intelligent
          companion for appointments, medications, and wellness tracking.
        </p>
        <ul className="list-disc pl-7 text-xl space-y-2 font-semibold">
          <li>Smart medication reminders</li>
          <li>AI-powered health insights</li>
          <li>Secure medical record management</li>
        </ul>
      </div>
    </div>
  );
}
