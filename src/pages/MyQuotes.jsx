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
    const { data, error } = await supabase
      .from('quote')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setQuotes(data);
  }

  // ----- Icon Handlers -----
  const handleEdit = (quote) => {
    console.log('Edit:', quote);
    // TODO: Open modal or navigate to edit page
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('quote').delete().eq('id', id);
    if (error) {
      console.error('Delete failed:', error);
    } else {
      setQuotes(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleFavorite = async (quote) => {
    console.log('Favorite:', quote);
    // TODO: Insert into "favorite" table
  };

  const handleAddToCollection = (quote) => {
    console.log('Add to Collection:', quote);
    // TODO: Open collection picker/modal
  };

  const handleViewCollection = (quote) => {
    console.log('View Collection:', quote);
    // TODO: Navigate or display collection info
  };

  const handleShare = (quote) => {
    console.log('Share:', quote);
    // TODO: Copy to clipboard or open share modal
  };

  return (
    <div className="d-flex">
      <Sidebar color="dark" routes={routes} />

      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: '250px', minHeight: '100vh' }}>
        <Navbar />

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
                  <FaEdit title="Edit" onClick={() => handleEdit(quote)} />
                  <FaTrash title="Delete" onClick={() => handleDelete(quote.id)} />
                  <FaHeart title="Favorite" onClick={() => handleFavorite(quote)} />
                  <FaPlusSquare title="Add to Collection" onClick={() => handleAddToCollection(quote)} />
                  <FaThLarge title="View Collection" onClick={() => handleViewCollection(quote)} />
                  <FaShareAlt title="Share" onClick={() => handleShare(quote)} />
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
