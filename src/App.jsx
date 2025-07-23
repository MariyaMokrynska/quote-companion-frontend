import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

console.log("TEST Supabase client:", supabase) // ✅ this should go AFTER import

function App() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuotes = async () => {
      const { data, error } = await supabase
        .from('quote')
        .select('*')
        .order('created_at', { ascending: false })

      console.log("Fetched data:", data)

      if (error) {
        console.error('Error fetching quotes:', error.message)
      } else {
        setQuotes(data)
      }
      setLoading(false)
    }

    fetchQuotes()
  }, [])

  return (
    <div className="app">
      <h1>Quote Companion</h1>
      {loading ? (
        <p>Loading quotes...</p>
      ) : (
        <ul>
          {quotes.map((quote) => (
            <li key={quote.id}>
              <strong>{quote.author || 'Unknown Author'}:</strong> "{quote.text}"
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
