"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const LoadingSpinner = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onFinish) onFinish();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onFinish]);

  // SVG circle calculation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg
          className="absolute top-0 left-0 w-full h-full transform -rotate-90"
          viewBox="0 0 120 120"
        >
          {/* background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          {/* animated progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#f97316" // orange-500
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.2s linear",
            }}
          />
        </svg>

        {/* spinning logo */}
        <div className="w-12 h-12">
          <Image
            src="/logo_icon/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
      </div>

      {/* Custom slow spin animation */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
