// components/navigation-bar.tsx
import { Brain } from "lucide-react";
import React from "react";
import Link from "next/link";

const NavigationBar = () => {
  return (
    <header className="bg-transparent relative"> {/* Add relative positioning */}
      {/* Adjust padding for the navigation bar */}
      <div className="mx-auto px-0 py-4">
        <nav className="flex items-center justify-center"> {/* Center the navigation bar */}
          {/* Logo and Brand Name (Left Side) */}
          <div className="absolute left-2 top-3 flex items-center space-x-2"> {/* Absolute positioning */}
            <Brain className="h-8 w-8 text-black" />
            <span className="text-black font-bold text-xl">MiniMinds</span>
          </div>

          {/* Navigation Links in Transparent Oval (Centered) */}
          <div className="flex items-center space-x-6 bg-white/20 backdrop-blur-sm rounded-full px-8 py-3 hover:scale-105 transition-transform duration-200">
            <ul className="flex space-x-8">
              <li>
                <Link
                  href="/"
                  className="text-black text-lg font-medium hover:text-blue-600 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/UploadPage"
                  className="text-black text-lg font-medium hover:text-blue-600 transition-colors duration-200"
                >
                  Detection
                </Link>
              </li>
              <li>
                <Link
                  href="/ContactPage"
                  className="text-black text-lg font-medium hover:text-blue-600 transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;