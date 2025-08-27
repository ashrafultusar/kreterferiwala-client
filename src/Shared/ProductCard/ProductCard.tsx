"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  regularPrice: number;
  discountPrice: number;
  image: string;
}
interface CartItem {
  id: string;
  name: string;
  regularPrice: number;
  discountPrice: number;
  image: string;
  quantity: number;
}

export default function ProductCard({
  id,
  name,
  regularPrice,
  discountPrice,
  image,
}: ProductCardProps) {
  return (
    <div className="relative w-full max-w-xs h-[380px] bg-white rounded-sm shadow-lg group duration-300 hover:shadow-2xl transition-transform hover:scale-105 hover:border-orange-500 flex flex-col justify-between overflow-hidden">
      {/* Product Image with link to details */}
      <Link
        href={`/productdetails/${id}`}
        className="relative h-56 w-full overflow-hidden block"
      >
        <Image
          src={image || "/placeholder.png"}
          alt={name}
          width={400}
          height={400}
          className="object-cover w-full h-full transition-transform duration-400 group-hover:scale-110"
        />
        {/* Discount Badge */}
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          {Math.round(((regularPrice - discountPrice) / regularPrice) * 100)}%
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col justify-between flex-grow p-3 text-center">
        <Link href={`/productdetails/${id}`}>
          <h2 className="text-sm md:text-xl font-semibold text-gray-800 line-clamp-1 mb-2">
            {name}
          </h2>
        </Link>

        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-red-600 font-bold text-md">
            ৳ {discountPrice}
          </span>
          <span className="text-gray-400 line-through text-xs">
            ৳ {regularPrice}
          </span>
        </div>

        {/* Direct Checkout Button */}
        <Link
          href={`/checkout`}
          onClick={() => {
            const newProduct: CartItem = {
              id,
              name,
              regularPrice,
              discountPrice,
              image,
              quantity: 1,
            };

            const existingCart: CartItem[] = JSON.parse(
              localStorage.getItem("checkoutCart") || "[]"
            );

            const existingIndex = existingCart.findIndex(
              (item: CartItem) => item.id === newProduct.id
            );

            if (existingIndex !== -1) {
              existingCart[existingIndex].quantity += 1;
            } else {
              existingCart.push(newProduct);
            }

            localStorage.setItem("checkoutCart", JSON.stringify(existingCart));
          }}
          className="mt-auto bg-orange-400 hover:bg-orange-500 w-full text-white text-xs rounded-sm font-semibold py-2 px-5 transition text-center inline-block cursor-pointer"
        >
          অর্ডার করুন
        </Link>
      </div>
    </div>
  );
}
