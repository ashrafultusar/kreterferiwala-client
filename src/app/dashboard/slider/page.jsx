'use client';
import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";

const AdminSliderUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    fetchSliderImages();
  }, []);

  const fetchSliderImages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/sliders`);
      const data = await res.json();
      setSliderImages(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch slider images");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/slider`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setSliderImages([data, ...sliderImages]);
        setImageFile(null);
        setImagePreview("");
        toast.success("Slider image uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/sliderDelete?id=${id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setSliderImages(sliderImages.filter((img) => img._id !== id));
        toast.success("Deleted successfully");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Slider Image</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label
          htmlFor="sliderImage"
          className="flex items-center gap-2 border p-2 rounded cursor-pointer text-gray-700 hover:bg-orange-50"
        >
          <Upload className="w-5 h-5" />
          Select Image
        </label>
        <input
          id="sliderImage"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Preview"
            width={100}
            height={100}
            className="rounded"
          />
        )}
        <button
          type="submit"
          className="bg-[#0f766e] cursor-pointer text-white px-4 py-2 rounded"
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            "Upload"
          )}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">All Slider Images</h3>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sliderImages?.map((img) => (
            <li
              key={img._id}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative w-full h-[140px]">
                <Image
                  src={img.imageUrl}
                  alt="Slider"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => handleDelete(img._id)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 cursor-pointer text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <MdDeleteOutline size={24} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSliderUpload;
