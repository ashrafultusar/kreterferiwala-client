"use client";
import Image from "next/image";
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div className="bg-orange-400 text-white py-10 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
            <div className="h-[2px] w-10 bg-white mb-4" />
            <p className="text-black leading-relaxed text-sm">
              কল করুনঃ ০১৭৯৫০৭২২০০ <br />
              ইমেইল করুনঃ <br />
              kretarferiwala@gmail.com
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                target="_blank"
                href="https://www.facebook.com/kretarferiwala"
                className="text-black hover:text-white"
              >
                <FaFacebookF />
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/kretarferiwala"
                className="text-black hover:text-white"
              >
                <FaInstagram />
              </a>
              <a
                href="mailto:kretarferiwala@gmail.com"
                className="text-black hover:text-white"
              >
                <FaEnvelope />
              </a>
              <a href="#" className="text-black hover:text-white">
                <FaLinkedinIn />
              </a>
              <a href="#" className="text-black hover:text-white">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* For Customer */}
          <div>
            <h4 className="text-lg font-semibold mb-2">For Customer</h4>
            <div className="h-[2px] w-10 bg-white mb-4" />
            <ul className="text-black text-sm space-y-2">
              <li><a href="#">Contact</a></li>
              <li><a href="#">Refund and Returns</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Corporate Deal</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Company</h4>
            <div className="h-[2px] w-10 bg-white mb-4" />
            <ul className="text-black text-sm space-y-2">
              <li><a href="#">About</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Career</a></li>
            </ul>
          </div>

          {/* Facebook Embed */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Like Us On Facebook</h4>
            <div className="h-[2px] w-10 bg-white mb-4" />
            <div className="w-full">
              <a
                href="https://www.facebook.com/kretarferiwala"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/logo_icon/logo.png"
                  alt="Facebook Page"
                  width={200}
                  height={100}
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t text-center border-gray-700 py-4 text-black text-sm">
        <p>
          &copy; 2025{" "}
          <span className="font-bold">
            <a>Kretarferiwala</a>
          </span>{" "}
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
