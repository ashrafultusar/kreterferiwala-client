"use client";

import React, { useState } from "react";
import TitleWithLine from "@/Shared/TitleWithLine/TitleWithLine";
import ProductCard from "@/Shared/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";
import Loading from "@/Shared/LoadingSpinner/Loading";

// Define the product type
interface Product {
  _id: string;
  name: string;
  regularPrice: number;
  discountPrice: number;
  images: string[];
}

// Define the props for the component
interface AllProductsProps {
  data: Product[];
}

const PRODUCTS_PER_PAGE = 40;

const AllProducts: React.FC<AllProductsProps> = ({data}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // ডেটা না থাকলে লোডিং দেখানো হবে
  if (!data || data.length === 0) {
    return <Loading />;
  }

  const totalPages = Math.ceil(data.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = data.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  return (
    <section className="container mx-auto my-6 px-4">
      <TitleWithLine title="All Products" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {paginatedProducts.map((product: Product) => (
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

      {/* Only show pagination if more than 40 products */}
      {data.length > PRODUCTS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </section>
  );
};

export default AllProducts;
