'use client';
import React, { useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Page = () => {
  const emailRef = useRef<HTMLInputElement>(null!); 
  const passwordRef = useRef<HTMLInputElement>(null!); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;

   // Validation
if (!email || !password) {
  return toast.error("Email and password are required.");
}

const passwordRequirements = {
  minLength: 8,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  specialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

if (password.length < passwordRequirements.minLength) {
  return toast.error("Password must be at least 8 characters long.");
}

if (
  !passwordRequirements.uppercase.test(password) ||
  !passwordRequirements.lowercase.test(password) ||
  !passwordRequirements.number.test(password) ||
  !passwordRequirements.specialChar.test(password)
) {
  return toast.error("Password must include uppercase, lowercase, number, and special character.");
}


    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Registration failed");
      }

      toast.success("Registration successful!");
      emailRef.current.value = '';
      passwordRef.current.value = '';
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-32">
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-center capitalize">Create New Admin</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            ref={emailRef}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="••••••••"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 text-white py-2 rounded bg-orange-400 cursor-pointer hover:bg-orange-500 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
          ) : (
            'Create Admin'
          )}
        </button>
      </form>
    </div>
  );
};

export default Page;
