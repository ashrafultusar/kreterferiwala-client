"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { IoMenuSharp } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useCategories from "@/hooks/useCategories";

export default function Navbar() {
  const { categories } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleScroll = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <nav
        className={`bg-white shadow-md px-4 py-3 fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Mobile View */}
          <div className="flex items-center md:hidden w-full justify-between">
            <button onClick={() => setIsOpen(true)}>
              <IoMenuSharp className="text-2xl text-black" />
            </button>
            <Link
              href="/"
              className="flex cursor-pointer items-center space-x-2"
            >
              <Image
                src="/logo_icon/logo.png"
                alt="Logo"
                width={40}
                height={40}
              />
            </Link>
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex w-full items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Image
                src="/logo_icon/logo.png"
                alt="Logo"
                width={50}
                height={50}
              />
            </Link>
            <div className="flex-1 mx-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:border-blue-400"
                />
                <FaSearch
                  className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                  onClick={handleSearch}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="https://wa.me/8801795072200"
                target="_blank"
                className="flex flex-col items-end"
              >
                <span className="text-sm text-gray-600">
                  অর্ডার করতে কল করুন
                </span>
                <span className="text-red-500 font-semibold">০১৭৯৫০৭২২০০</span>
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Categories */}
        <div className="hidden md:flex bg-gray-100 py-3 mt-2 justify-center space-x-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/products-category/${encodeURIComponent(category.name)}`}
              className="text-black hover:text-[#fc8934] cursor-pointer"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 z-50 flex flex-col space-y-6">
          <button onClick={() => setIsOpen(false)} className="self-end">
            <ImCross className="text-2xl text-black" />
          </button>

          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:border-blue-400"
            />
            <FaSearch
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            />
          </div>

          {/* Mobile Categories */}
          <div className="flex flex-col space-y-4 mt-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/products-category/${encodeURIComponent(category.name)}`}
                className="text-black text-base hover:text-red-500 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
