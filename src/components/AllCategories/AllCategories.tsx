"use client";

import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Image from "next/image";
import Link from "next/link";
import TitleWithLine from "@/Shared/TitleWithLine/TitleWithLine";


// props টাইপ সঠিকভাবে define
interface Category {
  _id: string;
  name: string;
  image: string;
}

interface AllCategoriesProps {
  data: Category[];
}

const AllCategories: React.FC<AllCategoriesProps> = ({ data }) => {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    setNavigationReady(true);
  }, []);

  

  return (
    <div className="container mx-auto my-12 px-4">
      <TitleWithLine title="Shop By Categories" />

      {navigationReady && (
        <Swiper
          slidesPerView={8}
          spaceBetween={10}
          centeredSlides={false}
          grabCursor={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          modules={[Navigation, Autoplay]}
          className="mySwiper"
          breakpoints={{
            0: { slidesPerView: 1 },
            320: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
            1536: { slidesPerView: 7 },
          }}
        >
          {data.map((category) => (
            <SwiperSlide key={category._id}>
              <Link href={`/products-category/${encodeURIComponent(category.name)}`}>
                <div className="flex flex-col border border-neutral-300 items-center justify-start bg-[#f7f9fc] rounded-xl p-6 shadow-sm hover:shadow-md transition-transform duration-300 hover:scale-105 w-full h-54">
                  <div className="w-full h-full mb-4 relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h3
                    className="font-semibold text-gray-800 truncate w-full max-w-full whitespace-nowrap overflow-hidden text-center"
                    title={category.name}
                  >
                    {category.name}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default AllCategories;
