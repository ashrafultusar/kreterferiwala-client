"use client";

import LoadingPage from "@/app/loading";
import useProducts from "@/hooks/useProducts";
import ProductCard from "@/Shared/ProductCard/ProductCard";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category;
  const { products, loading } = useProducts();

  if (loading) return <LoadingPage />;

  if (!category) {
    return (
      <div className="text-center text-red-500 p-10">
        Category not found!
      </div>
    );
  }

  const decodedCategory = decodeURIComponent(category);

  const filteredProducts = products.filter(
    (product) => product.category === decodedCategory
  );

  return (
    <div className="max-w-7xl mx-auto p-6 mt-32">
      <h1 className="text-center text-lg md:text-3xl lg:text-4xl font-bold mb-4">
        Category / <span className="font-medium">{decodedCategory}</span>
      </h1>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
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
      ) : (
        <p className="text-gray-600 text-center">
          No products found for this category.
        </p>
      )}
    </div>
  );
}
