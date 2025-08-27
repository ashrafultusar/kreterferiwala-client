import ProductCard from "@/Shared/ProductCard/ProductCard";

interface Product {
  id: string;
  name: string;
  regularPrice: number;
  discountPrice: number;
  image: string;
  category?: string;
  code?: string;
}

interface RelatedProductsProps {
  relatedProducts: Product[];
}

export default function RelatedProducts({
  relatedProducts,
}: RelatedProductsProps) {
  if (!relatedProducts.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
