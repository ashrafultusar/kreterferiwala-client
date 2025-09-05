"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";


import { ToastContainer } from "react-toastify";

import { FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import Footer from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/dashboard");

  // Track page view on route change
  useEffect(() => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        {children}
        <ToastContainer />
      </main>

      {!isAdmin && (
        <div className="fixed bottom-8 right-8 z-50 group">
          <details className="relative">
            <summary className="cursor-pointer list-none">
              <div className="bg-gradient-to-br from-green-500 to-green-700 hover:scale-110 transition-transform duration-300 shadow-2xl p-3 rounded-full flex items-center justify-center text-white">
                <MdCall className="text-2xl" />
              </div>
            </summary>

            <ul className="absolute bottom-16 right-0 backdrop-blur-md bg-white/80 border border-gray-300 rounded-xl shadow-2xl p-2 space-y-2 animate-fade-in">
              <li>
                <a
                  href="https://wa.me/8801795072200"
                  target="_blank"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-green-600 hover:bg-green-100 transition"
                >
                  <FaWhatsapp className="text-2xl" />
                </a>
              </li>
              <li> 
                <a
                  href="https://m.me/kretarferiwala"
                  target="_blank"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-100 transition"
                >
                  <FaFacebookMessenger className="text-2xl" />
                </a>
              </li>
            </ul>
          </details>
        </div>
      )}
      {!isAdmin && <Footer />}
    </>
  );
}
