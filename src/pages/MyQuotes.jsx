import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';
import { FaEdit, FaTrash, FaHeart, FaPlusSquare, FaThLarge, FaShareAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import routes from '../routes';
import './MyQuotes.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function MyQuotesPage() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    const {
      data,
      error
    } = await supabase
      .from('quote')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setQuotes(data);
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar color="dark" routes={routes} />

      {/* Page Content Wrapper */}
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: '250px', minHeight: '100vh' }}>
        <Navbar />

        {/* Main Content */}
        <div className="flex-grow-1 p-4">
          <h2 className="text-center fw-bold">My Quotes</h2>
          <p className="text-center">Your personal collection of inspiration</p>

          <section className="quotes-grid">
            {quotes.map((quote) => (
              <div key={quote.id} className="quote-card">
                <p className="quote-text">“{quote.text}”</p>
                <p className="quote-author"><em>{quote.author || 'Unknown'}</em></p>
                <span className="quote-timestamp">{formatDistanceToNow(new Date(quote.created_at), { addSuffix: true })}</span>

                <div className="quote-actions">
                  <FaEdit title="Edit" />
                  <FaTrash title="Delete" />
                  <FaHeart title="Favorite" />
                  <FaPlusSquare title="Add to Collection" />
                  <FaThLarge title="View Collection" />
                  <FaShareAlt title="Share" />
                </div>
              </div>
            ))}
          </section>
        </div>

        <Footer />
      </div>
    </div>
  );
}
