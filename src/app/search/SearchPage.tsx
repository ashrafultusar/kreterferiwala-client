"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/Shared/ProductCard/ProductCard";
import Loading from "@/Shared/LoadingSpinner/Loading";

interface Product {
  _id: string;
  name: string;
  regularPrice: number;
  discountPrice: number;
  images: string[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_API
          }/products?query=${encodeURIComponent(query)}`
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  useEffect(() => {
    const filteredResults = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(filteredResults);
  }, [query, products]);

  return (
    <>
      <h1 className="text-2xl text-center bg-orange-400 py-6 font-bold mb-6 mt-16 md:mt-32">
        Found {filtered?.length} results for “{query}”
      </h1>

      <div className="max-w-7xl mx-auto px-4 py-8">
      {loading ? (
          <Loading></Loading>
        ) : filtered.length === 0 ? (
          <p className="text-center text-lg">কোন প্রোডাক্ট পাওয়া যায়নি</p>
        ): (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                regularPrice={product.regularPrice}
                discountPrice={product.discountPrice}
                image={product.images[0]}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
