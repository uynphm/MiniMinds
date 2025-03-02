// components/navigation-bar.tsx
import React from "react";
import Link from "next/link";

const NavigationBar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex space-x-6 justify-center">
        <li>
          <Link
          href="/" 
          className="text-white hover:text-blue-200">
            Home
          </Link>
        </li>
        <li>
          <Link
          href="/UploadPage"
          className="text-white hover:text-blue-200">
            Detection
          </Link>
        </li>
        <li>
          <Link
          href="/"
           className="text-white hover:text-blue-200">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;