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
