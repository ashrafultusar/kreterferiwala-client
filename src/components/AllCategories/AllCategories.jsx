"use client";

import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Image from "next/image";
import Link from "next/link";
import TitleWithLine from "../../Shared/TitleWithLine/TitleWithLine";


const AllCategories = ({ data }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
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
              <Link
                href={`/products-category/${encodeURIComponent(category.name)}`}
              >
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-200 p-4 w-full flex items-center gap-4 cursor-pointer">
                  {/* Image Section */}
                  <div className="w-20 h-20 flex items-center justify-center bg-blue-50 rounded-lg overflow-hidden">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </div>

                  {/* Text Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {category.name}
                    </h3>
                  </div>
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
