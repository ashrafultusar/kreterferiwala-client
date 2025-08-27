"use client";
import { useState } from "react";
import { toast } from "react-toastify";

const DeliveryChargeForm = () => {
  const [insideDhaka, setInsideDhaka] = useState<number>(70);
  const [outsideDhaka, setOutsideDhaka] = useState<number>(150);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); 
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/updatedeliverycharge`,
        {
          method: "PATCH",  
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ insideDhaka, outsideDhaka }),
        }
      );
  
      if (res.ok) {
        toast.success("Delivery charges updated successfully!");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to update delivery charges");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong!");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-semibold">ঢাকার ভিতরে চার্জ *</label>
        <input
          type="number"
          value={insideDhaka}
          onChange={(e) => setInsideDhaka(Number(e.target.value))}
          className="w-full border rounded-md p-2"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold">ঢাকার বাইরে চার্জ *</label>
        <input
          type="number"
          value={outsideDhaka}
          onChange={(e) => setOutsideDhaka(Number(e.target.value))}
          className="w-full border rounded-md p-2"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 cursor-pointer text-white font-semibold py-3 rounded-md w-full"
      >
        আপডেট করুন
      </button>
    </form>
  );
};

export default DeliveryChargeForm;
