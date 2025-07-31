import React from "react";
import "./Footer.css"; // optional: for custom styling

function Footer() {
  return (
    <footer className="app-footer py-5 bg-dark mt-4">
      <div className="container px-5 text-center text-white">
        <p className="m-0">
          &copy; 2025 Quote Companion
        </p>
        <p className="m-0">
          Made by Jane K & Mariya M | ADA Developers Academy C23
        </p>
      </div>
    </footer>
  );
}

export default Footer;
