// import React from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import routes from "../routes";

// import JaneSketch from "../assets/jane-sketch.png";
// import MariyaSketch from "../assets/mariya-sketch.png";

// export default function AboutPage() {
//   return (
//     <div className="d-flex min-vh-100 w-100 overflow-hidden bg-light">
//       {/* Sidebar (hidden on small screens via your global CSS if desired) */}
//       <Sidebar color="dark" routes={routes} />

//       {/* Main area */}
//       <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "250px" }}>
//         <Navbar />

//         <div className="flex-grow-1 container-fluid py-4 px-4 px-md-5">
//           {/* Title */}
//           <h2 className="fw-bold mb-3">About Quote Companion</h2>

//           {/* Lead text */}
//           <p className="text-start">
//             <strong>Quote Companion</strong> began as the <strong>capstone project</strong> of two
//             Ada Developers Academy students — <strong>Jane K.</strong> and <strong>Mariya M.</strong> —
//             to showcase our skills as <strong>full-stack developers</strong>.
//           </p>
//           <p className="text-start">
//             We built this app for readers, thinkers, and lifelong learners — anyone who wants a
//             personal space to save meaningful quotes from the books they’ve read, organize them into
//             collections, add to Favorites, and edit or remove them whenever they like.
//           </p>
//           <p className="text-start">
//             Beyond being a quote organizer, <strong>Quote Companion</strong> is also a source of{" "}
//             <em>inspiration and motivation</em>. Whether you’re facing a challenge, celebrating a
//             success, or simply looking for a spark of wisdom, you can explore quotes from famous
//             writers, historical figures, and public personalities.
//           </p>
//           <p className="text-start">
//             Our <strong>unique feature</strong>, <em>Mood Mirror</em>, takes it one step further —
//             using AI to suggest quotes that best match the situation or thoughts you share in the
//             input field. It’s like having a personalized literary mentor, ready with words to guide you.
//           </p>

//           {/* Features — highlighted */}
//           <div className="card border-0 shadow-sm my-4">
//             <div className="card-body bg-primary-subtle rounded-3 text-start">
//               <h5 className="fw-bold mb-3">Features you’ll love</h5>
//               <ul className="mb-0">
//                 <li className="mb-1">
//                   <strong>Search &amp; Discover</strong> – Find quotes instantly by keyword or author.
//                 </li>
//                 <li className="mb-1">
//                   <strong>Save &amp; Organize</strong> – Keep meaningful quotes in personal collections and mark favorites for quick access.
//                 </li>
//                 <li className="mb-1">
//                   <strong>Mood Mirror AI</strong> – Get AI-powered quote suggestions tailored to your current mood or life situation.
//                 </li>
//                 <li className="mb-1">
//                   <strong>Manual Add</strong> – Easily add quotes from books, articles, or conversations you want to remember.
//                 </li>
//                 <li>
//                   <strong>Clean, Distraction-Free Design</strong> – Enjoy a simple, elegant interface that makes reading and browsing effortless.
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <p className="text-start">
//             Sometimes, the right words make all the difference. Quote Companion was made to help you
//             find them — easily, beautifully, and whenever you need a little spark.
//           </p>

//           {/* Technologies */}
//           <div className="small fst-italic text-start">
//             <h6 className="fw-bold">Technologies &amp; Tools We Used</h6>
//             <ul className="mb-4">
//               <li><strong>Frontend:</strong> React, Bootstrap</li>
//               <li><strong>Backend:</strong> Supabase (Auth, Postgres, Storage) + Supabase Edge Functions (Deno)</li>
//               <li><strong>AI Integration:</strong> OpenAI API via Supabase Edge Functions</li>
//               <li><strong>External API:</strong> ZenQuotes API for inspirational content</li>
//               <li><strong>Hosting &amp; Deployment:</strong> Render (frontend), Supabase (DB/Auth/Functions)</li>
//               <li><strong>Version Control &amp; Collaboration:</strong> Git, GitHub</li>
//               <li><strong>Other Tools:</strong> Postman for API testing, VS Code for development</li>
//             </ul>
//           </div>

//           {/* Team sketches */}
//           <div className="row g-4 align-items-center text-center">
//             <div className="col-12 col-md-6">
//               <img
//                 src={JaneSketch}
//                 alt="Sketch of Jane K."
//                 className="img-fluid rounded-circle border border-2"
//                 style={{ width: 180, height: 180, objectFit: "cover" }}
//               />
//               <div className="mt-2 fw-semibold">Jane</div>
//             </div>
//             <div className="col-12 col-md-6">
//               <img
//                 src={MariyaSketch}
//                 alt="Sketch of Mariya M."
//                 className="img-fluid rounded-circle border border-2"
//                 style={{ width: 180, height: 180, objectFit: "cover" }}
//               />
//               <div className="mt-2 fw-semibold">Mariya</div>
//             </div>
//           </div>
//         </div>

//         <Footer />
//       </div>
//     </div>
//   );
// }

import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutContent from "../components/AboutContent";
import routes from "../routes";

import JaneSketch from "../assets/jane-sketch.png";
import MariyaSketch from "../assets/mariya-sketch.png";

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