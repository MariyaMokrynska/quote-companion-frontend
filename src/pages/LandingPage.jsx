import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import pencilIcon from "../assets/pencil.png";
import collectionIcon from "../assets/collection.png";
import moodIcon from "../assets/mood.png";
import trackerIcon from "../assets/tracker.png";

export default function LandingPage() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container px-5">
          <div className="navbar-brand navbar-brand-custom">
            <span className="quote">Quote</span>{" "}
            <span className="companion">Companion</span>
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#!">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#!">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#!">
                  FAQ
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#!">
                  Sign Up
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#!">
                  Login
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="bg-dark py-5">
        <div className="container px-5">
          <div className="row gx-5 justify-content-center">
            <div className="col-lg-6">
              <div className="text-center my-5">
                <h1 className="display-6 fw-bolder text-white mb-4">
                  Your personal quote library + emotional mirror
                </h1>
                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                  <a
                    className="btn btn-primary btn-lg px-4 me-sm-3"
                    href="#features"
                  >
                    Start Your Collection
                  </a>
                  <a className="btn btn-outline-light btn-lg px-4" href="#!">
                    Try Mood Mirror
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Search Bar with Dropdown */}

      <div className="container my-2 mt-5">
        <h4 className="text-center mb-4">Search Quotes</h4>

        {/* Search Bar + Button aligned */}
        <div className="row mb-3">
          <div className="col-md-10">
            <input
              type="text"
              className="form-control h-100"
              placeholder="Search by keyword or phrase, e.g. love, Oscar Wilde, dreams and"
              aria-label="Search"
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100 h-100">Search</button>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="row">
          <div className="col-md-4 mb-2">
            <select className="form-select" aria-label="Author dropdown">
              <option defaultValue>Filter by Author</option>
              <option value="1">Author 1</option>
              <option value="2">Author 2</option>
              <option value="3">Author 3</option>
            </select>
          </div>

          <div className="col-md-4 mb-2">
            <select className="form-select" aria-label="Category dropdown">
              <option defaultValue>Filter by Category</option>
              <option value="1">Inspiration</option>
              <option value="2">Life</option>
              <option value="3">Motivation</option>
            </select>
          </div>

          <div className="col-md-4 mb-2">
            <select className="form-select" aria-label="Source dropdown">
              <option defaultValue>Filter by Source</option>
              <option value="1">Book</option>
              <option value="2">Speech</option>
              <option value="3">Interview</option>
            </select>
          </div>
        </div>
      </div>
      {/* Features section */}
      <section id="features" className="py-5 border-bottom">
        <div className="container px-5 my-5">
          <div className="row gx-5">
            <div className="col-lg-3 mb-5 mb-lg-0">
              <div
                className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <img
                  src={pencilIcon}
                  alt="Pencil Icon"
                  style={{ maxWidth: "110%", maxHeight: "110%" }}
                />
              </div>
              <h2 className="h4 fw-bolder">Save Personal Quotes</h2>
              <p>From books, films, or life</p>
            </div>

            <div className="col-lg-3 mb-5 mb-lg-0">
              <div
                className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <img
                  src={collectionIcon}
                  alt="Collection Icon"
                  style={{ maxWidth: "110%", maxHeight: "110%" }}
                />
              </div>

              <h2 className="h4 fw-bolder">Collections</h2>
              <p>Organize by Collections</p>
            </div>

            <div className="col-lg-3 mb-5 mb-lg-0">
              <div
                className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <img
                  src={moodIcon}
                  alt="Mood Icon"
                  style={{ maxWidth: "110%", maxHeight: "110%" }}
                />
              </div>

              <h2 className="h4 fw-bolder">Reflect With Mood Mirror</h2>
              <p>AI-powered emotional quotes</p>
            </div>
            <div className="col-lg-3 mb-5 mb-lg-0">
              <div
                className="feature bg-primary bg-gradient text-white rounded-3 mb-3 d-flex justify-content-center align-items-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <img
                  src={trackerIcon}
                  alt="Tracker Icon"
                  style={{ maxWidth: "110%", maxHeight: "110%" }}
                />
              </div>
              <h2 className="h4 fw-bolder">Track Your Mood Over Time</h2>
              <p></p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-dark">
        <div className="container px-5">
          <p className="m-0 text-center text-white">
            Copyright &copy; 2025 Quote Companion
          </p>
          <p className="m-0 text-center text-white">
            Made by Jane K & Mariya M | ADA Developers Academy C23
          </p>
        </div>
      </footer>
    </>
  );
}