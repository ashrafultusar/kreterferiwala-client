"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingPage from "../loading";


const CheckoutPage = () => {
  const [products, setProducts] = useState([]);
  const [deliveryChargeData, setDeliveryChargeData] =
    useState(null);
  const [selectedDeliveryCharge, setSelectedDeliveryCharge] =
    useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderedProductNames, setOrderedProductNames] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Load cart products from localStorage
    const stored = localStorage.getItem("checkoutCart");
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    // Fetch delivery charge data from backend
    const fetchDeliveryCharge = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/updatedeliverycharge`
        );
        if (!res.ok) throw new Error("Failed to fetch delivery charge");
        const data = await res.json();
        setDeliveryChargeData(data);
        // By default set insideDhaka charge
        setSelectedDeliveryCharge(data.insideDhaka);
      } catch (error) {
        console.error(error);
        // fallback value if API fails
        setDeliveryChargeData({ insideDhaka: 150, outsideDhaka: 200 });
        setSelectedDeliveryCharge(150);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryCharge();
  }, []);

  const handleChange = (
    e
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeliveryChange = (e) => {
    setSelectedDeliveryCharge(parseInt(e.target.value));
  };

  const handleIncrease = (id) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, quantity: p.quantity + 1 } : p
    );
    setProducts(updated);
    localStorage.setItem("checkoutCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated")); 
  };

  const handleDecrease = (id) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
    );
    setProducts(updated);
    localStorage.setItem("checkoutCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated")); // এটাও দিলাম
  };

  const handleRemove = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("checkoutCart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated")); // এটাও দিলাম
  };

  const subTotal = products.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );
  const totalAmount = subTotal + selectedDeliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.phone || !formData.address) {
      setError("সব ফিল্ড পূরণ করুন");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          products,
          subTotal,
          deliveryCharge: selectedDeliveryCharge,
          totalAmount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrderedProductNames(products.map((product) => product.name));
        localStorage.removeItem("checkoutCart");

        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(
          `Order placed successfully! Order Number: ${data.orderNumber}`
        );

        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Purchase", {
            value: totalAmount,
            currency: "BDT",
            contents: products.map((p) => ({
              id: p.id,
              quantity: p.quantity,
              item_price: p.discountPrice,
            })),
            num_items: products.reduce((sum, p) => sum + p.quantity, 0),
          });
        }

        setOrderSuccess(true);
      } else {
        setError(data.error || data.message || "অর্ডার পাঠাতে সমস্যা হয়েছে");
        toast.error(data.error || "Failed to place order");
      }
    } catch (err) {
      console.error("error message:", err);
      toast.error("Something went wrong");
    }
  };

  const handleCloseModal = () => {
    setOrderSuccess(false);
    router.push("/");
  };

  const handleClickOutside = (e) => {
    const modal = document.getElementById("orderSuccessModal");
    if (modal && !modal.contains(e)) {
      handleCloseModal();
    }
  };

  if (loading || !deliveryChargeData) {
    return <LoadingPage />;
  }
  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-semibold text-red-500">
          আপনি কোনো প্রোডাক্ট নির্বাচন করেননি।
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start gap-8 max-w-7xl mx-auto px-4 py-8 mt-32">
      {/* Left Form */}
      <div className="bg-white w-full md:w-1/2 p-6 rounded-lg shadow-md">
        <h2 className="text-center text-lg font-semibold mb-6">
          অর্ডারটি কনফর্ম করতে আপনার নাম, ঠিকানা, মোবাইল নাম্বার লিখে{" "}
          <span className="text-red-500">অর্ডার কনফর্ম করুন</span> বাটনে ক্লিক
          করুন
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">আপনার নাম *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="আপনার নাম"
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              আপনার মোবাইল নম্বর *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="আপনার মোবাইল নম্বর"
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              আপনার সম্পূর্ণ ঠিকানা *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="আপনার সম্পূর্ণ ঠিকানা"
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">আপনার মন্তব্য</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="কালার, সাইজ, অর্ডার সম্পর্কে কোনো কথা থাকলে লিখুন"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <h3 className="font-semibold mb-2">কুরিয়ার চার্জ</h3>
            <div className="space-y-2">
              <label
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  selectedDeliveryCharge === deliveryChargeData.outsideDhaka
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={deliveryChargeData.outsideDhaka}
                  checked={
                    selectedDeliveryCharge === deliveryChargeData.outsideDhaka
                  }
                  onChange={handleDeliveryChange}
                  className="mr-2"
                />
                ঢাকার বাইরে {deliveryChargeData.outsideDhaka} টাকা
              </label>
              <label
                className={`flex items-center p-2 rounded-md cursor-pointer ${
                  selectedDeliveryCharge === deliveryChargeData.insideDhaka
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={deliveryChargeData.insideDhaka}
                  checked={
                    selectedDeliveryCharge === deliveryChargeData.insideDhaka
                  }
                  onChange={handleDeliveryChange}
                  className="mr-2"
                />
                ঢাকার ভিতরে {deliveryChargeData.insideDhaka} টাকা
              </label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className=" inline-block w-full text-center bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-md cursor-pointer"
          >
            অর্ডার কনফর্ম করুন
          </button>
        </form>
      </div>

      {/* Right Product Summary */}
      <div className="bg-white w-full md:w-1/2 p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Product</h2>

        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-2">Product</th>
              <th className="px-2 py-2">Price</th>
              <th className="px-2 py-2">Quantity</th>
              <th className="px-2 py-2">Total</th>
              <th className="px-2 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="px-2 py-2 flex items-center gap-2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <span>{product.name}</span>
                </td>
                <td className="px-2 py-2">{product.discountPrice}Tk</td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => handleDecrease(product.id)}
                    className="bg-orange-400 cursor-pointer text-white px-2 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{product.quantity}</span>
                  <button
                    onClick={() => handleIncrease(product.id)}
                    className="cursor-pointer bg-green-400 text-white px-2 rounded"
                  >
                    +
                  </button>
                </td>
                <td className="px-2 py-2">
                  {product.discountPrice * product.quantity}Tk
                </td>
                <td className="px-2 py-2">
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="cursor-pointer text-red-500"
                  >
                    <MdDeleteForever size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-4">
          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>{subTotal.toLocaleString()} টাকা</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Delivery</span>
            <span>{selectedDeliveryCharge.toLocaleString()} টাকা</span>
          </div>
          <div className="flex justify-between font-semibold text-xl text-green-500">
            <span>Total</span>
            <span>{totalAmount.toLocaleString()} টাকা</span>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {orderSuccess && (
        <div
          id="orderSuccessModal"
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleClickOutside}
        >
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-center text-xl font-semibold text-green-500">
              আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!
            </h2>

            <p className="text-center mt-2">
              অর্ডারকৃত প্রোডাক্ট:{" "}
              <strong>{orderedProductNames.join(", ")}</strong>
            </p>
            <div className="mt-6 text-center">
              <p className="text-center">
                আমাদের সাথে যোগাযোগ করতে কল অথবা WhatsApp করুন:
                <br />
                WhatsApp : +8801795072200
                <br />
                Call : +8801795072200
                <br />
                Mail: kretarferiwala@gmail.com
              </p>
              <p className="mt-4 text-center text-red-500">
                ফেইক অর্ডার শনাক্ত করতে আপনার IP অ্যাড্রেস আমরা রেখেছি। ফেইক
                অর্ডার করলে, আমরা তার বিরুদ্ধে আইনি পদক্ষেপ নিব।
              </p>
              <div className="mt-6 text-center">
                <button
                  onClick={handleCloseModal}
                  className="text-white bg-orange-400 hover:bg-orange-500 cursor-pointer py-2 px-6 rounded-lg"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
