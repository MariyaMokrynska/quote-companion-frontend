import React from "react";
import { Link } from "react-router-dom";
import "./About.css"; // Your custom CSS styles

export default function AboutPage() {
  return (
    <>
      {/* Header / Navbar */}
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container-fluid px-5 no-margin-container">
          <div className="navbar-brand navbar-brand-custom">
            <span className="quote">Quote</span>{" "}
            <span className="companion">Companion</span>
          </div>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Sign Up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* About Page Content */}
      <div className="about-container">
        <h1 className="about-title">About Quote Companion</h1>
        <p className="about-text">
          <strong>Quote Companion</strong> is a quote discovery app built to bring you daily inspiration,
          motivation, and wisdom. Whether you're searching by mood, keyword, or author, our clean and
          intuitive design makes it easy to explore quotes that resonate with you.
        </p>
        <p className="about-text">
          Our goal is to provide a distraction-free space to explore powerful thoughts that move, uplift,
          and challenge your perspective — all in just a few clicks.
        </p>
        <p className="about-text">Features you’ll love:</p>
        <ul className="about-list">
          <li>Search quotes by keyword or author</li>
          <li>Browse quotes based on your mood</li>
          <li>Explore our full quote collections</li>
          <li>Simple, elegant design for easy reading</li>
        </ul>
        <p className="about-text">
          Sometimes, the right words make all the difference. 
          Quote Companion was made to help you find them — easily, beautifully, and whenever you need a little spark.
        </p>
      </div>

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <div className="container px-5">
          <p className="m-0 text-center text-white">Copyright &copy; 2025 Quote Companion</p>
          <p className="m-0 text-center text-white">
            Made by Jane K & Mariya M | ADA Developers Academy C23
          </p>
        </div>
      </footer>
    </>
  );
}
