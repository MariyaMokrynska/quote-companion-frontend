import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from "./services/supabaseClient";
import './App.css';
import Login from './auth/Login';
import SignUp from './auth/Signup';
import LandingPage from './pages/LandingPage';
import MyCollections from './pages/MyCollections';

function Home() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotes = async () => {
      const { data, error } = await supabase
        .from('quote')
        .select('*')
        .order('created_at', { ascending: false });

      console.log("Fetched data:", data);

      if (error) {
        console.error('Error fetching quotes:', error.message);
      } else {
        setQuotes(data || []); // fallback in case data is null
      }
      setLoading(false);
    };

    fetchQuotes();
  }, []);

  return (
    <div className="home">
      <h1>Quote Companion</h1>
      {loading ? (
        <p>Loading quotes...</p>
      ) : (
        <ul>
          {quotes.length === 0 ? (
            <p>No quotes available.</p>
          ) : (
            quotes.map((quote) => (
              <li key={quote.id}>
                <strong>{quote.author || 'Unknown Author'}:</strong> "{quote.text}"
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/mycollections" element={<MyCollections />} />
      </Routes>
    </Router>
  );
}

export default App;