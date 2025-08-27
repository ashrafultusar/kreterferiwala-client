"use client";

import React from "react";

interface TitleWithLineProps {
  title: string;
}

const TitleWithLine: React.FC<TitleWithLineProps> = ({ title }) => {
  return (
    <div className="text-center mb-8">
      {/* Title */}
      <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        {title}
      </h1>

      {/* Line */}
      <div className="w-16 sm:w-20 md:w-24 h-[2px] bg-black mx-auto mt-1"></div>
    </div>
  );
};

export default TitleWithLine;
