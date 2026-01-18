import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="bg-white/80 backdrop-blur sticky top-0 z-40 border-b">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="font-semibold text-xl text-sky-700">
          My Boilerplate
        </Link>
        <nav className="flex gap-4">
          <Link to="/" className="text-sky-600 hover:underline">
            Home
          </Link>
          <Link to="/about" className="text-sky-600 hover:underline">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
