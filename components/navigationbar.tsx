// components/navigation-bar.tsx
import { Brain } from "lucide-react";
import React from "react";
import Link from "next/link";

const NavigationBar = () => {
  return (
    <header className="bg-gradient-to-r  bg-blue-950 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-white" />
            <span className="text-white font-bold text-xl">MiniMinds</span>
          </div>
          <ul className="flex space-x-6 justify-center">
            <li>
              <Link
                href="/"
                className="text-white text-lg text-bold hover:text-blue-200">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/UploadPage"
                className="text-white text-lg hover:text-blue-200">
                Detection
              </Link>
            </li>
            <li>
              <Link
                href="/app"
                className="text-white text-lg hover:text-blue-200">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>

  );
};

export default NavigationBar;