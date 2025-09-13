
import React from "react";
import { Link } from "react-router-dom"; 

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">RateApp</Link>
        </div>
        <div className="space-x-6">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/reviews" className="hover:text-gray-300">
            Reviews
          </Link>
          <Link to="/add-rating" className="hover:text-gray-300">
            Add Rating
          </Link>
          <Link to="/profile" className="hover:text-gray-300">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
