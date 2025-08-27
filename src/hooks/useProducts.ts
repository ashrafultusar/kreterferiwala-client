"use client";
import { useEffect, useState, useCallback } from "react";

export type Product = {
  _id: string;
  name: string;
  category: string;
  description: string;
  regularPrice: number;
  discountPrice: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/products`
      );
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refreshProducts: fetchProducts };
};

export default useProducts;
