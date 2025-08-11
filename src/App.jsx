import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { supabase } from './services/supabaseClient';
import Login from './auth/Login';
import SignUp from './auth/Signup';
import Logout from './auth/Logout';       
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import MyQuotes from './pages/MyQuotes';
import MoodMirror from './pages/MoodMirror';
import MyCollections from './pages/MyCollections';
import About from './pages/About';
import SearchQuotes from './pages/SearchQuotes';
import SearchResultsPage from './pages/SearchResults';
import AddQuotePage from './pages/AddQuotePage';
import './App.css';
import MyReflections from './pages/MyReflections';
import MyFavorites from './pages/MyFavorites';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logout" element={<Logout />} />     
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myquotes" element={<MyQuotes />} />
        <Route path="/mood-mirror" element={<MoodMirror />} />
        <Route path="/mycollections" element={<MyCollections />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<SearchQuotes />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/addquote" element={<AddQuotePage />} />
        <Route path="/myreflections" element={<MyReflections />} />
        <Route path="/favorites" element={<MyFavorites />} />
      </Routes>
    </Router>
  );
}

export default App;
