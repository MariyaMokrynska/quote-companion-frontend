import React from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import routes from "../routes";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";

const MoodMirror = () => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar color="dark" routes={routes} />

      {/* Page Content Wrapper */}
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "250px", minHeight: "100vh" }}>
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          <h2 className="text-center fw-bold">Mood Mirror</h2>
          <p className="text-center">Let words guide you</p>

          {/* <div className="mb-4"> */}
          <div className="mb-4 mt-5">
            <label htmlFor="moodInput" className="form-label">
              How are you feeling today?
            </label>
            <textarea
              className="form-control"
              id="moodInput"
              placeholder="Describe your mood, experience or current thoughts ..."
              rows="3"
            ></textarea>
          </div>
          <div className="text-center mb-5">
            <button className="btn btn-primary">Reflect</button>
          </div>
          <div className="p-4 bg-light rounded border text-center">
            <span className="badge bg-secondary mb-3">Hopeful</span>
            <p className="fs-5 fst-italic">
              “Even the darkest night will end and the sun will rise.”
            </p>
            <p className="text-muted text-center">Victor Hugo</p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-outline-primary">Save Reflection</button>
              <button className="btn btn-outline-success">Add to My Quotes</button>
              <button className="btn btn-outline-secondary">Try Again</button>
            </div>
          </div>
          <div className="text-center mt-5">
            <a href="#" className="fw-bold">
              Go to my Past Reflections &gt;
            </a>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default MoodMirror;
