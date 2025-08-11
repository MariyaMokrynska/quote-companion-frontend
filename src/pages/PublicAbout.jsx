import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";
import AboutContent from "../components/AboutContent";

export default function AboutPublic() {
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <PublicNavbar />
      <div className="flex-grow-1">
        <AboutContent />
      </div>
      <Footer />
    </div>
  );
}
