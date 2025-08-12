// import JaneSketch from "../assets/jane-sketch.png";
// import MariyaSketch from "../assets/mariya-sketch.png";


// export default function AboutContent() {
//   return (
//     <div className="container py-4">
//       <div className="flex-grow-1 container-fluid py-4 px-4 px-md-5">
//         {/* Title */}
//         <h2 className="fw-bold mb-3">About Quote Companion</h2>

//         {/* Lead text */}
//         <p className="text-start">
//           <strong>Quote Companion</strong> began as the <strong>capstone project</strong> of two
//           Ada Developers Academy students — <strong>Jane K.</strong> and <strong>Mariya M.</strong> —
//           to showcase our skills as <strong>full-stack developers</strong>.
//         </p>
//         <p className="text-start">
//           We built this app for readers, thinkers, and lifelong learners — anyone who wants a
//           personal space to save meaningful quotes from the books they’ve read, organize them into
//           collections, add to Favorites, and edit or remove them whenever they like.
//         </p>
//         <p className="text-start">
//           Beyond being a quote organizer, <strong>Quote Companion</strong> is also a source of{" "}
//           <em>inspiration and motivation</em>. Whether you’re facing a challenge, celebrating a
//           success, or simply looking for a spark of wisdom, you can explore quotes from famous
//           writers, historical figures, and public personalities.
//         </p>
//         <p className="text-start">
//           Our <strong>unique feature</strong>, <em>Mood Mirror</em>, takes it one step further —
//           using AI to suggest quotes that best match the situation or thoughts you share in the
//           input field. It’s like having a personalized literary mentor, ready with words to guide you.
//         </p>

//         {/* Features — highlighted */}
//         <div className="card border-0 shadow-sm my-4">
//           <div className="card-body bg-primary-subtle rounded-3 text-start">
//             <h5 className="fw-bold mb-3">Features you’ll love</h5>
//             <ul className="mb-0">
//               <li className="mb-1">
//                 <strong>Search &amp; Discover</strong> – Find quotes instantly by keyword or author.
//               </li>
//               <li className="mb-1">
//                 <strong>Save &amp; Organize</strong> – Keep meaningful quotes in personal collections and mark favorites for quick access.
//               </li>
//               <li className="mb-1">
//                 <strong>Mood Mirror AI</strong> – Get AI-powered quote suggestions tailored to your current mood or life situation.
//               </li>
//               <li className="mb-1">
//                 <strong>Manual Add</strong> – Easily add quotes from books, articles, or conversations you want to remember.
//               </li>
//               <li>
//                 <strong>Clean, Distraction-Free Design</strong> – Enjoy a simple, elegant interface that makes reading and browsing effortless.
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Technologies */}
//         <div className="small fst-italic text-start">
//           <h6 className="fw-bold">Technologies &amp; Tools We Used</h6>
//           <ul className="mb-4">
//             <li><strong>Frontend:</strong> React, Bootstrap</li>
//             <li><strong>Backend:</strong> Supabase (Auth, Postgres, Storage) + Supabase Edge Functions (Deno)</li>
//             <li><strong>AI Integration:</strong> OpenAI API via Supabase Edge Functions</li>
//             <li><strong>External API:</strong> ZenQuotes API for inspirational content</li>
//             <li><strong>Hosting &amp; Deployment:</strong> Render (frontend), Supabase (DB/Auth/Functions)</li>
//             <li><strong>Version Control &amp; Collaboration:</strong> Git, GitHub</li>
//             <li><strong>Other Tools:</strong> Postman for API testing, VS Code for development</li>
//           </ul>
//         </div>

//         {/* Team sketches */}
//         <div className="row g-4 align-items-center text-center">
//           <div className="col-12 col-md-6">
//             <img
//               src={JaneSketch}
//               alt="Sketch of Jane K."
//               className="img-fluid rounded-circle border border-2"
//               style={{ width: 180, height: 180, objectFit: "cover" }}
//             />
//             <div className="mt-2 fw-semibold">Jane</div>
//           </div>
//           <div className="col-12 col-md-6">
//             <img
//               src={MariyaSketch}
//               alt="Sketch of Mariya M."
//               className="img-fluid rounded-circle border border-2"
//               style={{ width: 180, height: 180, objectFit: "cover" }}
//             />
//             <div className="mt-2 fw-semibold">Mariya</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/AboutContent.jsx

// components/AboutContent.jsx


import JaneSketch from "../assets/jane-sketch.png";
import MariyaSketch from "../assets/mariya-sketch.png";

export default function AboutContent({ compact = true }) {
  const hClass = compact ? "h4 fw-bold mb-3" : "h2 fw-bold mb-3";
  const pClass = compact ? "text-start fs-6 mb-2" : "text-start mb-3";

  return (
    <div className="container py-3">
      <div className="container-fluid px-3 px-md-4" style={{ maxWidth: 980 }}>
        {/* Title */}
        <h2 className={hClass}>About Quote Companion</h2>

        {/* Intro */}
        <p className={pClass}>
          <strong>Quote Companion</strong> began as the <strong>capstone project</strong> of two
          Ada Developers Academy students — <strong>Jane K.</strong> and <strong>Mariya M.</strong> —
          to showcase our skills as <strong>full-stack developers</strong>.
        </p>
        <p className={pClass}>
          We built this app for readers, thinkers, and lifelong learners — anyone who wants a
          personal space to save meaningful quotes, organize them into collections, add to Favorites,
          and edit or remove them whenever they like.
        </p>
        <p className={pClass}>
          Beyond being a quote organizer, <strong>Quote Companion</strong> is also a source of{" "}
          <em>inspiration and motivation</em>. Our unique feature, <em>Mood Mirror</em>, uses AI to
          suggest quotes that match the thoughts you share.
        </p>
        <p className="text-start fs-6 mt-3 mb-0">
          Sometimes, the right words make all the difference. Quote Companion was made to help you
          find them — easily and beautifully.
        </p>

      {/* Two columns: Features | Tools (+ sketches) */}
      <div className="row g-4 mt-4 pt-1">
        {/* Left: Features (no bullets, left-aligned) */}
        <div className="col-12 col-md-6">
          <h6 className="fw-bold mb-2 text-start">Features you’ll love</h6>
          <ul className="small fst-italic list-unstyled mb-3 text-start">
            <li><strong>Search &amp; Discover</strong> - find quotes by keyword or author.</li>
            <li><strong>Save &amp; Organize</strong> — collections + favorites for quick access.</li>
            <li><strong>Mood Mirror AI</strong> — quotes tailored to your mood or situation.</li>
            <li><strong>Manual Add</strong> — save lines from books, articles, conversations.</li>
            <li><strong>Clean UI</strong> — distraction-free reading and browsing.</li>
          </ul>



          {/* <div className="text-start">
            <div className="small mb-1">
              <strong>Search &amp; Discover</strong> — find quotes by keyword or author.
            </div>
            <div className="small mb-1">
              <strong>Save &amp; Organize</strong> — collections + favorites for quick access.
            </div>
            <div className="small mb-1">
              <strong>Mood Mirror AI</strong> — quotes tailored to your mood or situation.
            </div>
            <div className="small mb-1">
              <strong>Manual Add</strong> — save lines from books, articles, conversations.
            </div>
            <div className="small">
              <strong>Clean UI</strong> — distraction-free reading and browsing.
            </div>
          </div> */}
        </div>

        {/* Right: Tools (single column, left-aligned) */}
        <div className="col-12 col-md-6">
          <h6 className="fw-bold mb-2 text-start">Technologies &amp; Tools We Used</h6>
          <ul className="small fst-italic list-unstyled mb-3 text-start">
            <li><strong>Frontend:</strong> React, Bootstrap</li>
            <li><strong>Backend:</strong> Supabase + Edge Functions (Deno)</li>
            <li><strong>AI:</strong> OpenAI via Edge Functions</li>
            <li><strong>External API:</strong> ZenQuotes</li>
            <li><strong>Hosting:</strong> Render, Supabase</li>
            <li><strong>Collab:</strong> Git/GitHub, Postman, VS Code</li>
          </ul>
        </div>


        {/* Sketches centered and a bit larger */}
        <div className="d-flex justify-content-center gap-4">
          <figure className="text-center mb-0">
            <img
              src={JaneSketch}
              alt="Sketch of Jane K."
              className="rounded-circle border"
              style={{ width: 120, height: 120, objectFit: "cover" }}
            />
            <figcaption className="mt-1 small fw-semibold">Jane</figcaption>
          </figure>
          <figure className="text-center mb-0">
            <img
              src={MariyaSketch}
              alt="Sketch of Mariya M."
              className="rounded-circle border"
              style={{ width: 120, height: 120, objectFit: "cover" }}
            />
            <figcaption className="mt-1 small fw-semibold">Mariya</figcaption>
          </figure>
        </div>
      </div>

      </div>
    </div>
  );
}
