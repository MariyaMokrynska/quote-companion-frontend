import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutContent from "../components/AboutContent";
import routes from "../routes";

export default function AboutPage() {
  return (

    <div className="d-flex">
      <Sidebar color="dark" routes={routes} />

      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: "250px", minHeight: "100vh" }}
      >
        {/* sticky navbar inside the column */}
        <div className="position-sticky top-0 bg-white z-3 shadow-sm">
          <Navbar />
        </div>

        {/* content */}
        <div className="flex-grow-1">
          <AboutContent compact />
        </div>

        {/* sticky footer inside the column */}
        <div className="position-sticky bottom-0 bg-white border-top">
          <Footer />
        </div>
      </div>
    </div>
  );
}