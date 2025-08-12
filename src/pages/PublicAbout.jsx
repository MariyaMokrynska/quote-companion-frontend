import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";
import AboutContent from "../components/AboutContent";

export default function AboutPublic() {
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <div className="position-sticky top-0 bg-white z-3 shadow-sm">
        <PublicNavbar />
      </div>

      <div className="flex-grow-1 pt-5 pt-md-4">
        <AboutContent compact />
      </div>

      {/* <Footer /> */}
      <Footer />
    </div>
  );
}
