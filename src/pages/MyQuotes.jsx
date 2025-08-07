import React, { useEffect, useState} from 'react';
import { createClient } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';
import { FaEdit, FaTrash, FaHeart, FaPlusSquare, FaThLarge, FaShareAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import routes from '../routes';
import AddQuote from "../components/AddQuote";
import './MyQuotes.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export default function MyQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null); // for edit
  const [showAddEditModal, setShowAddEditModal] = useState(false);


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

  // Delete quote
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;

    const { error } = await supabase.from('quote').delete().eq('id', id);
    if (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete quote');
    } else {
      setQuotes(prev => prev.filter(q => q.id !== id));
    }
  };

  // Favorite quote toggle
  const handleFavorite = async (quote) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to favorite a quote.');
        return;
      }

      // Check if favorite exists
      const { data: existingFavorite, error: fetchError } = await supabase
        .from('favorite')
        .select('*')
        .eq('user_id', user.id)
        .eq('quote_id', quote.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 means no rows found, so ignore
        throw fetchError;
      }

      if (existingFavorite) {
        // Remove favorite
        const { error: delError } = await supabase
          .from('favorite')
          .delete()
          .eq('user_id', user.id)
          .eq('quote_id', quote.id);

        if (delError) throw delError;
        alert('Removed from favorites');
      } else {
        // Add favorite
        const { error: addError } = await supabase
          .from('favorite')
          .insert([{ user_id: user.id, quote_id: quote.id }]);

        if (addError) throw addError;
        alert('Added to favorites');
      }
    } catch (err) {
      console.error('Favorite toggle error:', err);
      alert('Failed to toggle favorite.');
    }
  };

  // Add to collection — open modal (reuse AddQuote for adding quote with collection)
  const handleAddToCollection = (quote) => {
    setSelectedQuote(quote);
    setShowAddEditModal(true);
  };

  // View collection - simple alert (expand later)
  const handleViewCollection = (quote) => {
    if (quote.collection_id) {
      alert(`Quote is in collection ID: ${quote.collection_id}`);
      // Or navigate to collection page if you have routing
    } else {
      alert('This quote is not part of any collection.');
    }
  };

  // Share quote text to clipboard
  const handleShare = (quote) => {
    const textToCopy = `"${quote.text}" — ${quote.author || 'Unknown'}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert('Quote copied to clipboard!'))
      .catch(() => alert('Failed to copy quote.'));
  };

  // Edit quote — open modal with selectedQuote filled
  const handleEdit = (quote) => {
    setSelectedQuote(quote);
    setShowAddEditModal(true);
  };

  // Callback for when modal closes after add or edit, refresh quotes
  const onModalClose = () => {
    setShowAddEditModal(false);
    setSelectedQuote(null);
    fetchQuotes();
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

      {/* AddQuote modal, pass selectedQuote for edit */}
      {showAddEditModal && (
        <AddQuote
          quoteToEdit={selectedQuote}
          onClose={onModalClose}
        />
      )}
    </div>
  );
}
