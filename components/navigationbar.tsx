// components/navigation-bar.tsx
import React from "react";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex space-x-6 justify-center">
        <li>
          <Link to="/" className="text-white hover:text-blue-200">
            Home
          </Link>
        </li>
        <li>
          <Link to="/detection" className="text-white hover:text-blue-200">
            Detection
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-white hover:text-blue-200">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;