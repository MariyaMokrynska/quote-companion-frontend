import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function PublicNavbar() {
  return (
    // <Navbar bg="light" expand="lg" className="shadow-sm">
    
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container-fluid px-5">
        <div className="navbar-brand">
          <span className="quote">Quote</span> <span className="companion">Companion</span>
        </div>
        <ul className="navbar-nav ms-auto">
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/signup">Sign Up</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
        </ul>
      </div>
    </nav>




    //     <nav className="navbar navbar-expand-lg navbar-dark bg-dark" >

    //   <Container>
    //     {/* Brand / Logo */}
    //     <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
    //       Quote Companion
    //     </Navbar.Brand>

    //     {/* Toggle for mobile */}
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //     <Navbar.Collapse id="basic-navbar-nav">
    //       <Nav className="ms-auto">
    //         <Nav.Link as={Link} to="/about-public">
    //           About
    //         </Nav.Link>
    //         <Nav.Link as={Link} to="/signup" className="fw-semibold">
    //           Sign Up
    //         </Nav.Link>
    //         <Nav.Link as={Link} to="/login" className="fw-semibold">
    //           Log In
    //         </Nav.Link>
    //       </Nav>
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>
  );
}
