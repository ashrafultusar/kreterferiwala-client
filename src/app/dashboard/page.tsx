"use client";
import React, { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  quantity: number;
};

type Order = {
  _id: string;
  name: string;
  phone: string;
  address: string;
  orderNumber: string;
  paymentMethod: string;
  status: string;
  products: Product[];
  subTotal: number;
  deliveryCharge: number;
  totalAmount: number;
  note: string;
  createdAt: string;
  updatedAt: string;
};

const Page = () => {
  const [orders, setOrders] = useState<Order[]>([]);

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

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  );

  // Map to store product sales with category
  const productSales: {
    [key: string]: { quantity: number; category: string };
  } = {};

  deliveredOrders.forEach((order) => {
    order.products.forEach((product) => {
      const key = product.name;
      if (productSales[key]) {
        productSales[key].quantity += product.quantity;
      } else {
        productSales[key] = {
          quantity: product.quantity,
          category: product.category || "Uncategorized",
        };
      }
    });
  });

  const sortedProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b.quantity - a.quantity)
    .slice(0, 10);

 
  const activeOrders = orders
    .filter(
      (order) => order.status !== "delivered" && order.status !== "cancelled"
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  return (
    <div>
      <div className="space-y-8 container mx-auto px-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-700">Total Sales</h3>
            <p className="text-2xl font-bold mt-2">
              ৳{" "}
              {deliveredOrders
                .reduce((acc, order) => acc + order.totalAmount, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Delivery
            </h3>
            <p className="text-2xl font-bold mt-2">{deliveredOrders?.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Orders
            </h3>
            <p className="text-2xl font-bold mt-2">{orders?.length}</p>
          </div>
        </div>

        {/* Most Selling Products Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Most Selling Products
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="text-gray-600 text-sm border-b">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Product Name</th>
                  <th className="py-2 px-4">Quantity Sold</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map(([productName, { quantity }], index) => (
                  <tr
                    key={productName}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="py-2 px-4 font-medium">{index + 1}</td>
                    <td className="py-2 px-4">{productName}</td>
                    <td className="py-2 px-4">{quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Active Orders Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Recent Active Orders
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="text-gray-600 text-sm border-b">
                  <th className="py-2 px-4">#</th>
                  <th className="py-2 px-4">Order No.</th>
                  <th className="py-2 px-4">Customer Name</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {activeOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="py-2 px-4 font-medium">{index + 1}</td>
                    <td className="py-2 px-4">{order.orderNumber}</td>
                    <td className="py-2 px-4">{order.name}</td>
                    <td className="py-2 px-4">
                      ৳ {order.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-2 px-4">{order.status}</td>
                    <td className="py-2 px-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
