"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { MdCloudUpload } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";
import useCategories from "@/hooks/useCategories";

export default function ProductForm() {
  const router = useRouter();
  const { categories } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    category: [], // selected categories
    description: "",
    regularPrice: "",
    discountPrice: "",
    images: [],
  });

  // toggle category selection
  const toggleCategory = (catName) => {
    setProduct((prev) => {
      if (prev.category.includes(catName)) {
        return {
          ...prev,
          category: prev.category.filter((c) => c !== catName),
        };
      } else {
        return { ...prev, category: [...prev.category, catName] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product.category.length === 0) {
      return toast.error("Please select at least one category.");
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", product.name);
    product.category.forEach((cat) => formData.append("category", cat));
    formData.append("description", product.description);
    formData.append("regularPrice", product.regularPrice);
    formData.append("discountPrice", product.discountPrice);
    product.images.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/products`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        toast.success("Product added successfully");
        setProduct({
          name: "",
          category: [],
          description: "",
          regularPrice: "",
          discountPrice: "",
          images: [],
        });
        router.push("/dashboard/allProducts");
      } else {
        const error = await res.json();
        toast.error("Error: " + error.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-start">Add New Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDE – FORM INPUTS */}
        <div className="flex-1 p-6 rounded-xl shadow space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full border p-2 rounded"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />

          {/* Category Cards */}
          <div className="grid grid-cols-3 gap-2">
            {categories?.map((cat) => (
              <div
                key={cat._id}
                onClick={() => toggleCategory(cat.name)}
                className={`cursor-pointer border p-2 rounded text-center ${
                  product.category.includes(cat.name)
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </div>
            ))}
          </div>

          <textarea
            placeholder="Product Description"
            className="w-full border p-2 rounded"
            rows={4}
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            required
          />

          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Regular Price"
              className="w-full border p-2 rounded"
              value={product.regularPrice}
              onChange={(e) =>
                setProduct({ ...product, regularPrice: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Discount Price"
              className="w-full border p-2 rounded"
              value={product.discountPrice}
              onChange={(e) =>
                setProduct({ ...product, discountPrice: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* RIGHT SIDE – IMAGE & BUTTONS */}
        <div className="w-full lg:w-80 bg-white p-6 rounded-xl shadow space-y-4 flex flex-col">
          <div className="border border-dashed border-gray-300 rounded p-4 text-center text-gray-600">
            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center cursor-pointer hover:text-orange-500"
            >
              <MdCloudUpload className="text-3xl mb-1" />
              <span>Upload Images</span>
              <span className="mt-2 px-4 py-1 border rounded bg-gray-100">
                Browse Files
              </span>
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                const newFiles = e.target.files
                  ? Array.from(e.target.files)
                  : [];
                setProduct((prev) => ({
                  ...prev,
                  images: [...prev.images, ...newFiles],
                }));
              }}
              required
            />
          </div>

          {/* Image Preview Grid */}
          {product.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((file, index) => (
                <div
                  key={index}
                  className="w-full h-20 relative border rounded overflow-hidden"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-[#0f766e] cursor-pointer text-white py-2 rounded w-full font-semibold flex items-center justify-center"
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
