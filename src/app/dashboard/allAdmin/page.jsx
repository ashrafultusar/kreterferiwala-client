"use client";

import LoadingPage from "@/app/loading";
import { UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify"; 

const Page = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/allAdmin`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        // Sort so superAdmin(s) come first
        const sorted = [...data].sort((a, b) =>
          a.role === "superAdmin" ? -1 : b.role === "superAdmin" ? 1 : 0
        );
        setAdmins(sorted);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admins");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id, index) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete");
      setAdmins((prev) => prev.filter((_, i) => i !== index));
      toast.success("Admin deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete admin");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/${id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      if (!res.ok) throw new Error("Failed to update role");
      setAdmins((prev) => {
        const updated = prev.map((admin) =>
          admin._id === id ? { ...admin, role: newRole } : admin
        );
        // Re-sort to keep superAdmin on top
        return [...updated].sort((a, b) =>
          a.role === "superAdmin" ? -1 : b.role === "superAdmin" ? 1 : 0
        );
      });
      toast.success("Role updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  const getBgClass = (role) => {
    switch (role) {
      case "superAdmin":
        return "bg-yellow-100";
      case "admin":
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!loading && admins.length === 0) {
    return <p className="text-center py-10">No admins found.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Management</h1>
      <ul>
        {admins.map((admin, index) => (
          <li
            key={admin._id}
            className={`flex justify-between items-center px-4 py-3 rounded shadow-sm mb-2 ${getBgClass(
              admin.role
            )}`}
          >
            {/* Left: Email + Icon */}
            <div className="flex items-center gap-4">
              <UserIcon />
              <p className="text-gray-800 font-medium">{admin.email}</p>
            </div>

            {/* Right: Role select and delete button */}
            <div className="flex items-center gap-4">
              <select
                value={admin.role}
                onChange={(e) => handleRoleChange(admin._id, e.target.value)}
                className={`text-xs font-semibold px-2 py-1 rounded-full border
                ${
                  admin.role === "superAdmin"
                    ? "bg-yellow-100 text-yellow-700"
                    : admin.role === "admin"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <option value="admin">Admin</option>
                <option value="superAdmin">SuperAdmin</option>
              </select>

              <button
                onClick={() => handleDelete(admin._id, index)}
                disabled={admin.role === "superAdmin"}
                className={`px-3 rounded-md py-2 text-sm font-semibold flex items-center
                  ${
                    admin.role === "superAdmin"
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-red-500 cursor-pointer"
                  }`}
                aria-label={`Delete admin ${admin.email}`}
                title={
                  admin.role === "superAdmin"
                    ? "Cannot delete Super Admin"
                    : "Delete Admin"
                }
              >
                <MdDeleteOutline className="text-2xl" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
