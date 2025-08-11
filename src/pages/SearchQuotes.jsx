import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import routes from "../routes";

const ZEN_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/zenquotes`;
const FN_HEADERS = {
  apikey: import.meta.env.VITE_SUPABASE_KEY,
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
};

const keywordList = [
  "Anxiety", "Change", "Choice", "Confidence", "Courage",
  "Death", "Dreams", "Excellence", "Failure", "Fairness",
  "Fear", "Forgiveness", "Freedom", "Future", "Happiness",
  "Inspiration", "Kindness", "Leadership", "Life", "Living",
  "Love", "Pain", "Past", "Success", "Time", "Today", "Truth", "Work"
];

const authorList = [
  "A.A. Milne",
  "Abraham Lincoln",
  "Adi Da Samraj",
  "Alan Watts",
  "Albert Einstein",
  "Albus Dumbledore",
  "Alexander Graham Bell",
  "Alexander Pope",
  "Alexandre Dumas",
  "Alfred Adler",
  "Amelia Earhart",
  "Andrew Carnegie",
  "Andrew Hendrixson",
  "Anita Krizzan",
  "Anne Frank",
  "Anne Wilson Schaef",
  "Aristophanes",
  "Aristotle",
  "Arnold Schwarzenegger",
  "Audrey Hepburn",
  "Ayn Rand",
  "Babe Ruth",
  "Barack Obama",
  "Benjamin Franklin",
  "Benjamin Mays",
  "Bette Midler",
  "Betty White",
  "Beverly Sills",
  "Bhagavad Gita",
  "Billie Jean King",
  "Bob Dylan",
  "Bob Marley",
  "Bob Proctor",
  "Bodhidharma",
  "Brian Tracy",
  "Bruce Lee",
  "Buddha",
  "C. Sean McGee",
  "Candice Carpenter",
  "Carl Bard",
  "Carl Jung",
  "Carlos Ruiz Zafon",
  "Carol Burnett",
  "Celestine Chua",
  "Charles Darwin",
  "Charles Dickens",
  "Charles Spurgeon",
  "Charles Swindoll",
  "Charlie Chaplin",
  "Cherie Gilderbloom",
  "Cherralea Morgen",
  "Chinese Proverb",
  "Christopher Columbus",
  "Christopher McCandless",
  "Christopher Reeve",
  "Coco Chanel",
  "Colin Powell",
  "Colin R. Davis",
  "Confucius",
  "Conrad Hilton",
  "Criss Jami",
  "D. H. Lawrence",
  "Dalai Lama",
  "Dale Carnegie",
  "Dan Brown",
  "Dan Millman",
  "David Brinkley",
  "Deepak Chopra",
  "Deepam Chaterjee",
  "Denis Waitley",
  "Dogen",
  "Doug Ivester",
  "Dr. Seuss",
  "Dudley Field Malone",
  "Earl Nightingale",
  "Eckhart Tolle",
  "Edgar Allan Poe",
  "Elbert Hubbard",
  "Eleanor Roosevelt",
  "Elon Musk",
  "Elvis Presley",
  "Emily Dickinson",
  "Epictetus",
  "Eric Hoffer",
  "Estee Lauder",
  "Euripides",
  "F. Scott Fitzgerald",
  "Franklin D. Roosevelt",
  "Franz Kafka",
  "G.I. Gurdjieff",
  "Gabor Mate",
  "Gary Keller",
  "Genghis Khan",
  "George Addair",
  "George Bernard Shaw",
  "George Eliot",
  "George Washington",
  "Gilbert Chesterton",
  "Grace Coddington",
  "Gurbaksh Chahal",
  "Gustave Flaubert",
  "Hans Christian Andersen",
  "Harry S. Truman",
  "Helen Keller",
  "Henry David Thoreau",
  "Henry Ford",
  "Henry Ward Beecher",
  "Heraclitus",
  "Herbert Hoover",
  "Herman Melville",
  "Herodotus",
  "Honore de Balzac",
  "Huang Po",
  "Isaac Newton",
  "J.R.R. Tolkien",
  "Jack Butcher",
  "Jack Kerouac",
  "Jack London",
  "James Allen",
  "James Cameron",
  "James Matthew Barrie",
  "Jeffrey Gitomer",
  "Jiddu Krishnamurti",
  "Jim Rohn",
  "Joan Rivers",
  "Johann Wolfgang von Goethe",
  "John Carmack",
  "John D. Rockefeller",
  "John Eliot",
  "John Lennon",
  "John Locke",
  "John Tukey",
  "John Wooden",
  "Jon Kabat-Zinn",
  "Jonathan Swift",
  "Josh Waitzkin",
  "Joyce Meyer",
  "Judy Garland",
  "Kabir",
  "Kahlil Gibran",
  "Kamal Ravikant",
  "Kenji Miyazawa",
  "Kenneth Branagh",
  "Kilian Jornet",
  "Lao Tzu",
  "Laurence J. Peter",
  "Leo Tolstoy",
  "Leonardo da Vinci",
  "Les Brown",
  "Lily Tomlin",
  "Lin Yutang",
  "Lolly Daskal",
  "Mae West",
  "Mahatma Gandhi",
  "Marcus Aurelius",
  "Margaret Mead",
  "Marilyn Monroe",
  "Mark Manson",
  "Mark Twain",
  "Martin Luther",
  "Martin Luther King, Jr.",
  "Mary Engelbreit",
  "Maxime Lagace",
  "Maya Angelou",
  "Meister Eckhart",
  "Michael Jordan",
  "Miguel de Cervantes",
  "Ming-Dao Deng",
  "Morgan Wootten",
  "Morihei Ueshiba",
  "Mother Teresa",
  "Napoleon Hill",
  "Naval Ravikant",
  "Neil Barringham",
  "Nelson Mandela",
  "Niccolo Machiavelli",
  "Nicolas Chamfort",
  "Nikola Tesla",
  "Norman Vaughan",
  "Norman Vincent Peale",
  "Og Mandino",
  "Oprah Winfrey",
  "Orison Swett Marden",
  "Oscar Wilde",
  "Osho",
  "Pablo Picasso",
  "Paramahansa Yogananda",
  "Paulo Coelho",
  "Pema Chodron",
  "Peter A. Cohen",
  "Peter Drucker",
  "Plato",
  "Publilius Syrus",
  "Ralph Marston",
  "Ralph Waldo Emerson",
  "Ray Bradbury",
  "Richard Bach",
  "Rita Mae Brown",
  "Robert Browning",
  "Robert Collier",
  "Robert F. Kennedy",
  "Robert Frost",
  "Robert Greene",
  "Robert Kiyosaki",
  "Robin Sharma",
  "Robin Williams",
  "Roger Lee",
  "Ronald Reagan",
  "Rosa Nouchette Carey",
  "Roy T. Bennett",
  "Rumi",
  "Samuel Beckett",
  "Samuel Butler",
  "Sathya Sai Baba",
  "Seneca",
  "Seungsahn",
  "Shahir Zag",
  "Shunryu Suzuki",
  "Sigmund Freud",
  "Simon Sinek",
  "Socrates",
  "Sonia Ricotti",
  "Soren Kierkegaard",
  "Soyen Shaku",
  "Spencer Johnson",
  "St. Jerome",
  "Stephen Hawking",
  "Stephen King",
  "Steve Harvey",
  "Steve Jobs",
  "Steve Maraboli",
  "Sun Tzu",
  "Sydney Smith",
  "T.S. Eliot",
  "Theodore Roosevelt",
  "Thich Nhat Hanh",
  "Thomas Edison",
  "Thomas Jefferson",
  "Toni Morrison",
  "Tony Robbins",
  "Unknown",
  "Vaclav Havel",
  "Vidal Sassoon",
  "Vince Lombardi",
  "Vincent van Gogh",
  "Virginia Woolf",
  "Voltaire",
  "W. Clement Stone",
  "W.P. Kinsella",
  "Walt Disney",
  "Walt Whitman",
  "Wayne Dyer",
  "Wayne Gretzky",
  "Will Rogers",
  "William Faulkner",
  "William James",
  "Winston Churchill",
  "Woody Allen",
  "Yanni",
  "Yoko Ono",
  "Zen Proverb",
  "Zhuangzi",
  "Zig Ziglar"
].sort();

function SearchQuotes() {
  const [authorQuery, setAuthorQuery] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Filtered authors for typeahead
  const filteredAuthors = authorList.filter(a =>
    a.toLowerCase().includes(authorQuery.toLowerCase())
  );

  // Fetch whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      if (!authorQuery && selectedKeywords.length === 0) {
        setResults([]);
        return;
      }
      setErr("");
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (authorQuery) params.set("author", authorQuery);
        if (selectedKeywords.length > 0) {
          params.set("keyword", selectedKeywords.join(",").toLowerCase());
        }

        const res = await fetch(`${ZEN_FN_URL}?${params.toString()}`, { headers: FN_HEADERS });
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0 || data.message) {
          setErr("No quotes found.");
          setResults([]);
        } else {
          const mapped = data.map((q, i) => ({
            id: `zen-${q.a}-${i}`,
            text: q.q,
            author: q.a || "Unknown",
          }));
          setResults(mapped);
        }
      } catch (e) {
        console.error(e);
        setErr("Search failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorQuery, selectedKeywords]);

  const toggleKeyword = (kw) => {
    setSelectedKeywords(prev =>
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    );
  };

  const clearFilters = () => {
    setAuthorQuery("");
    setSelectedKeywords([]);
  };

  return (
    <div className="d-flex min-vh-100 w-100 overflow-hidden bg-light">
      <Sidebar color="black" routes={routes} />
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "250px" }}>
        <Navbar />
        <div className="flex-grow-1 container-fluid py-4 px-4 px-md-5">
          <h2 className="fw-bold text-center mb-4">Search Quotes</h2>

          {/* Author typeahead */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Author</label>
            <input
              type="text"
              className="form-control"
              placeholder="Start typing an author's name..."
              value={authorQuery}
              onChange={(e) => setAuthorQuery(e.target.value)}
            />
            {authorQuery && (
              <div className="list-group position-absolute" style={{ zIndex: 5, maxHeight: 200, overflowY: "auto" }}>
                {filteredAuthors.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className="list-group-item list-group-item-action"
                    onClick={() => setAuthorQuery(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Keyword chips */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Keywords</label>
            <div className="d-flex flex-wrap gap-2">
              {keywordList.map((kw) => (
                <span
                  key={kw}
                  role="button"
                  className={`badge px-3 py-2 ${selectedKeywords.includes(kw) ? "bg-primary" : "bg-secondary"}`}
                  onClick={() => toggleKeyword(kw)}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Clear button */}
          {(authorQuery || selectedKeywords.length > 0) && (
            <div className="mb-3">
              <button className="btn btn-outline-danger btn-sm" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}

          {/* Results */}
          {loading && <div>Loading...</div>}
          {err && <div className="alert alert-danger">{err}</div>}
          <div className="row">
            {results.map((r) => (
              <div className="col-md-6 col-lg-4 mb-3" key={r.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <blockquote className="blockquote mb-0">
                      <p>“{r.text}”</p>
                      <footer className="blockquote-footer">{r.author}</footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default SearchQuotes;
