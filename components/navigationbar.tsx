// components/navigation-bar.tsx
import { Brain } from "lucide-react";
import React from "react";
import Link from "next/link";

const NavigationBar = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-950 shadow-md">
      <div className="flex items-center justify-between border border-blue-800/40 rounded-md px-6 py-3">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-white" />
            <span className="text-white font-bold text-xl">MiniMinds</span>
          </div>
          <ul className="flex space-x-6 justify-center">
            <li>
              <Link
                href="/HomePage"
                className="text-white text-lg font-bold hover:text-blue-200">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/UploadPage"
                className="text-white text-lg font-bold hover:text-blue-200">
                Detection
              </Link>
            </li>
            <li>
              <Link
                href="/ContactPage"
                className="text-white text-lg font-bold hover:text-blue-200">
                Contact
              </Link>
            </li>
          </ul>
      </div>
    </header>

  );
};

export default NavigationBar;