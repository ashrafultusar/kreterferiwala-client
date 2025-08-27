"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";

interface OrderProduct {
  name: string;
  quantity: number;
  discountPrice: number;
  image: string;
}

interface Order {
  orderNumber: string;
  name: string;
  phone: string;
  address: string;
  note?: string;
  status: string;
  paymentMethod: string;
  subTotal: number;
  deliveryCharge: number;
  totalAmount: number;
  products: OrderProduct[];
}

const OrderDetailsPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/orders/${id}`
        );
        if (!res.ok) {
          setError("Order not found");
          return;
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("error :", err);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);
  console.log(order);
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!order) {
    return notFound();
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">Order Details</h2>

      <div className="bg-white shadow p-4 rounded-lg flex flex-col lg:flex-row gap-6">
        {/* Order Details */}
        <div className="flex-1">
          <p>
            <strong>Order No:</strong> {order.orderNumber}
          </p>
          <p>
            <strong>Name:</strong> {order.name}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Note:</strong> {order.note || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>SubTotal:</strong> {order.subTotal}৳
          </p>
          <p>
            <strong>Delivery Charge:</strong> {order.deliveryCharge}৳
          </p>
          <p>
            <strong>Total Amount:</strong> {order.totalAmount}৳
          </p>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">Products:</h3>
          <ul className="space-y-4">
            {order.products.map((item, idx) => (
              <li
                key={idx}
                className="border rounded p-4 flex flex-col md:flex-row md:items-center gap-4"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p>
                    <strong>Name:</strong> {item.name}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> {item.discountPrice}৳
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
