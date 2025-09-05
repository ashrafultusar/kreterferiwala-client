"use client";

import LoadingPage from "@/app/loading";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

const AllCategoriesProducts = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch products
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/products`
        );
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);

        // Build unique category list from all products
        const uniqueCategories = Array.from(
          new Set(
            data.flatMap((p) =>
              Array.isArray(p.category) ? p.category : [p.category]
            )
          )
        );
        setCategories(uniqueCategories);

        if (uniqueCategories.length > 0) {
          setActiveCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  // Category filter
  useEffect(() => {
    if (activeCategory) {
      const filtered = products.filter((product) => {
        if (Array.isArray(product.category)) {
          return product.category.includes(activeCategory);
        } else {
          return product.category === activeCategory;
        }
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [activeCategory, products]);

  // Delete Product
  const handleDelete = async () => {
    if (!productToDelete) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/product/${productToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productToDelete));
        setFilteredProducts((prev) =>
          prev.filter((p) => p._id !== productToDelete)
        );
        setIsModalOpen(false);
        setProductToDelete(null);
        toast.success("Product deleted successfully!");
      } else {
        toast.error(data.message || "Failed to delete the product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while deleting the product");
    }
  };

  const openDeleteModal = (id) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <Link href="/dashboard/createProduct">
          <button className="px-5 py-2 cursor-pointer bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition-all">
            Create Product
          </button>
        </Link>
      </div>

      {/* Category Select */}
      <div className="mb-6 w-xl">
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="px-4 py-2 border cursor-pointer border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:outline-none w-full md:w-1/3 bg-white text-gray-700"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">
            No products found
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              {/* Left: Image + Info */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-teal-600 font-bold text-sm">
                    ${product.discountPrice ? product.discountPrice : product.regularPrice}
                  </p>
                  <span className="text-gray-500 text-sm">
                    {Array.isArray(product.category)
                      ? product.category.join(", ")
                      : product.category}
                  </span>
                  {product.createdAt && (
                    <span className="text-gray-400 text-xs">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Edit + Delete */}
              <div className="flex gap-3 items-center">
                <Link href={`/dashboard/allProducts/${product._id}`}>
                  <MdEdit className="text-xl text-gray-600 hover:text-teal-600 cursor-pointer" />
                </Link>
                <button
                  onClick={() => openDeleteModal(product._id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label={`Delete ${product.name}`}
                >
                  <MdDeleteOutline className="text-2xl cursor-pointer" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure?
            </h3>
            <p className="text-gray-500 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCategoriesProducts;
