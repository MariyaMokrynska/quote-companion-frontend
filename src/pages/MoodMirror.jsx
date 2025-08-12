import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import routes from "../routes";
import MoodMirrorContent from "../components/MoodMirrorContent";

export default function MoodMirror() {
  return (
    <div className="d-flex">
      <Sidebar color="dark" routes={routes} />
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ marginLeft: "250px", minHeight: "100vh", position: "relative" }}
      >
        <Navbar />
        <MoodMirrorContent isAuthed={true} />
        <Footer />
      </div>
    </div>
  );
}
