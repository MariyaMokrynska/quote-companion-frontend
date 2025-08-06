import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { supabase } from './services/supabaseClient';
import Login from './auth/Login';
import SignUp from './auth/Signup';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MyQuotes from './pages/MyQuotes';
import MoodMirror from './pages/MoodMirror';
import MyCollections from './pages/MyCollections';
import About from './pages/About';
import SearchQuotes from './pages/SearchQuotes';
import SearchResultsPage from './pages/SearchResults';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myquotes" element={<MyQuotes />} />
        <Route path="/moodmirror" element={<MoodMirror />} />
        <Route path="/mycollections" element={<MyCollections />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<SearchQuotes />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;