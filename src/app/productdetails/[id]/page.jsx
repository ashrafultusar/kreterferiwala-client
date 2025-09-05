"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ProductImageSlider from "@/components/ProductImageSlider/ProductImageSlider";
import Link from "next/link";
import TitleWithLine from "@/Shared/TitleWithLine/TitleWithLine";
import ProductCard from "@/Shared/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import LoadingPage from "@/app/loading";

const ProductDetails = () => {
  const params = useParams();
  const id = params?.id;
  const [isOrdering, setIsOrdering] = useState(false);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [deliveryCharge, setDeliveryCharge] = useState({
    insideDhaka: 0,
    outsideDhaka: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Fetch product details
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/productdetails/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Fetch related products
  useEffect(() => {
    if (!product || !product.category || !product._id) return;

    const fetchRelatedProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/related-products?category=${product.category}&excludeId=${product._id}`
        );
        const data = await res.json();
        setRelatedProducts(data);
      } catch (err) {
        console.error("Failed to load related products:", err);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Fetch delivery charge
  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/updatedeliverycharge`
        );
        const data = await res.json();
        if (data) {
          setDeliveryCharge(data);
        }
      } catch (error) {
        console.error("Failed to fetch delivery charge:", error);
      }
    };

    fetchDeliveryCharge();
  }, []);

  // Pagination
  const totalPages = Math.ceil(relatedProducts.length / productsPerPage);
  const paginatedProducts = relatedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  if (loading) return <LoadingPage />;

  if (!product) return <div className="text-center py-10">প্রোডাক্ট পাওয়া যায়নি</div>;

  const handleAddToCart = () => {
    setIsOrdering(true);
    const newProduct = {
      id,
      name: product?.name,
      regularPrice: product?.regularPrice,
      discountPrice: product?.discountPrice,
      image: product?.images[0] || "/placeholder.png",
      quantity: 1,
    };

    const existingCart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");
    const existingIndex = existingCart.findIndex((item) => item.id === newProduct.id);

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(newProduct);
    }

    localStorage.setItem("checkoutCart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setIsOrdering(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-32">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 mt-0">
        <ProductImageSlider images={product?.images} />

        <div className="flex flex-col justify-start space-y-4 mt-0 md:mt-1 lg:mt-6">
          <h1 className="text-2xl font-semibold">{product?.name}</h1>
          <div className="flex items-center space-x-4">
            <p className="text-3xl font-bold">
              Price:{" "}
              <span className="text-red-600 text-3xl font-bold">
                ৳ {product?.discountPrice}
              </span>
            </p>
            <span className="line-through text-gray-500">
              ৳ {product?.regularPrice}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 w-full bg-amber-400 rounded cursor-pointer"
            >
              Add to cart
            </button>

            <Link
              href="/checkout"
              onClick={handleAddToCart}
              className="bg-orange-400 w-full hover:bg-orange-500 text-white font-semibold py-2 md:py-3 px-6 rounded cursor-pointer text-center"
            >
              {isOrdering ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "অর্ডার করুন"
              )}
            </Link>
          </div>

          <a
            href="https://wa.me/8801795072200"
            target="_blank"
            className="w-full text-center cursor-pointer bg-blue-100 text-black py-3 hover:bg-gray-400 rounded shadow"
          >
            কল করতে ক্লিক করুন: 01795072200
          </a>

          <p className="font-bold">
            Code : <span className="font-medium">{product.code || "N/A"}</span>
          </p>

          <p className="font-bold">
            Category:{" "}
            <span className="flex flex-wrap gap-2 mt-1">
              {product?.category
                ? (Array.isArray(product?.category) ? product?.category : [product?.category]).map(
                    (cat, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm"
                      >
                        {cat}
                      </span>
                    )
                  )
                : <span className="font-medium">N/A</span>}
            </span>
          </p>

          <div className="text-sm">
            <div className="flex justify-between border-t pt-3">
              <span>ঢাকায় ডেলিভারি খরচ</span>
              <span>৳ {deliveryCharge.insideDhaka}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span>ঢাকার বাইরে কুরিয়ার খরচ</span>
              <span>৳ {deliveryCharge.outsideDhaka}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-2 px-4 cursor-pointer ${
              activeTab === "description"
                ? "border-b-2 border-green-600 text-green-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("return")}
            className={`py-2 px-4 cursor-pointer ${
              activeTab === "return"
                ? "border-b-2 border-green-600 text-green-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            Return Policy
          </button>
        </div>
        <div className="mt-4 bg-gray-50 p-4 rounded shadow text-sm leading-relaxed">
          {activeTab === "description" ? (
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <div>
              <p>১) উল্লিখিত ডেলিভারি চার্জ ১ কেজি পর্যন্ত ওজনের পণ্যের জন্য।</p>
              <p className="mt-2">
                ২) ছবি এবং বর্ণনার সাথে পণ্য মিলে থাকা সত্ত্বেও রিটার্ন করতে চাইলে কুরিয়ার চার্জ নিজ দায়িত্বে দিতে হবে।
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="my-7">
          <TitleWithLine title="Related Products" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                name={item.name}
                regularPrice={item.regularPrice}
                discountPrice={item.discountPrice}
                image={item.images[0]}
              />
            ))}
          </div>

          {relatedProducts.length > 40 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      {relatedProducts.length === 0 && (
        <div className="my-7">
          <TitleWithLine title="Related Products" />
          <div className="text-center text-red-500 py-10">
            <p>No related products found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
