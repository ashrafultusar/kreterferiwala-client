"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  HomeIcon,
  CarIcon,
  User2Icon,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { toast } from "react-toastify";

export default function AdminNav({ children }) {
  const pathname = usePathname();
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout successfully");
    router.replace("/login");
  };

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
    { href: "/dashboard/allProducts", label: "Products", icon: Package },
    { href: "/dashboard/categories", label: "Categories", icon: Layers },
    { href: "/dashboard/slider", label: "Home Slider", icon: HomeIcon },
    { href: "/dashboard/deliveryform", label: "Delivery Charges", icon: CarIcon },
    { href: "/dashboard/register", label: "Register", icon: User2Icon },
    { href: "/dashboard/allAdmin", label: "All Admin", icon: User2Icon },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          showSidebar ? "block" : "hidden"
        } md:block w-64 bg-[#0f766e] text-white shadow-lg z-30 md:relative fixed h-full`}
      >
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          <Link href="/">Back Home</Link>
        </div>
        <nav className="flex flex-col gap-2 p-4 text-sm">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded hover:bg-[#115e59] transition-all cursor-pointer",
                pathname === href && "bg-[#134e4a] font-semibold"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="mt-6 w-full py-2 bg-[#134e4a] hover:bg-red-700 text-white rounded text-center transition-all cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex justify-between items-center z-40">
        <Link href="/" className="text-xl font-bold text-orange-500">
          Admin
        </Link>
        <button onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 mt-16 md:mt-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
