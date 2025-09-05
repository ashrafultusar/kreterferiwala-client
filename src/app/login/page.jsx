"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.message || "Login failed");

    localStorage.setItem("token", data.token);
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Admin Login</h2>
        <input
          ref={emailRef}
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
        />

        <div className="relative">
          <input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border p-2 w-full rounded pr-10"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </span>
        </div>

        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-500 cursor-pointer text-white w-full py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
