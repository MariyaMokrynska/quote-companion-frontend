// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

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
        .from('quote') // ✅ Use singular table name
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
