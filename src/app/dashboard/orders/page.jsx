"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { GrFormView } from "react-icons/gr";

const statusTabs = ["active", "shipped", "delivered", "cancelled"];

const Page = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/allOrders`
        );
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/orders/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      const result = await res.json();
      const updatedStatus = result.data.status;

      // Local state update
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: updatedStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredOrders = orders
    .filter((order) => order.status.toLowerCase() === activeTab.toLowerCase())
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/orders/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // যদি token লাগে
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete order");

      // Remove from local state after successful deletion
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Total Orders: {orders?.length}</h2>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {statusTabs?.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 cursor-pointer ${
              activeTab === tab ? "bg-[#0f766e] text-white" : "bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase ">
            <tr>
              <th className="px-6 py-3">Order No</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Payment</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{order?.orderNumber}</td>
                <td className="px-6 py-4">{order?.name}</td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{order?.paymentMethod}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className={`px-2 py-1 rounded-full text-xs font-semibold border cursor-pointer ${
                      order.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {statusTabs.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">{order?.totalAmount}৳</td>
                <td className="px-6 py-4 flex gap-1">
                  <Link
                    href={`/dashboard/orders/${order?._id}`}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    <GrFormView className="text-green-600 cursor-pointer hover:text-green-800 text-2xl" />
                  </Link>
                  <button
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => handleDelete(order._id)}
                  >
                    <FaTrash className="text-red-600 cursor-pointer hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
