import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import googleButton from '../assets/Continue_with_Google_button.svg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const [randomQuote, setRandomQuote] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const zenKey = import.meta.env.VITE_ZEN_QUOTES_API_KEY;

        const response = await fetch(`https://zenquotes.io/api/random/${zenKey}`);
        const data = await response.json();

        if (data && Array.isArray(data) && data[0]) {
          setRandomQuote({
            text: data[0].q,
            author: data[0].a || 'Unknown',
          });
        }
      } catch (error) {
        console.error("Failed to fetch random quote:", error);
      }
    };

    fetchQuote();
  }, []);
  
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`, 
      },
    });
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light px-0">
      {/* Bootstrap Grid: 2 Columns */}
      <div className="row w-100 mx-0">
        {/* Left: Login Form */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center px-5">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4 text-center">Welcome Back</h2>
            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password + Toggle */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* Error */}
              {errorMsg && (
                <div className="mb-3 text-danger text-center">{errorMsg}</div>
              )}

              {/* Login Button */}
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Log In
              </button>
            </form>

            {/* Forgot Password */}
            <div className="text-center mb-3">
              <Link to="/reset" className="text-decoration-none">Forgot password?</Link>
            </div>

            {/* Or separator */}
            <div className="text-center mb-3 text-muted">or</div>

            {/* Google Login */}
            <div className="text-center mb-3">
              <button onClick={handleGoogleLogin} className="btn w-100 p-0 border-0 bg-transparent">
                <img src={googleButton} alt="Continue with Google" className="img-fluid" />
              </button>
            </div>

            {/* Sign Up */}
            <div className="text-center">
              <span>Don't have an account? </span>
              <Link to="/signup" className="fw-bold text-decoration-none">Sign up</Link>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div
          className="col-md-6 d-none d-md-flex bg-dark text-white justify-content-center align-items-center"
          style={{ height: '100vh', padding: '2rem', textAlign: 'center' }}
        >
          {randomQuote ? (
            <div>
              <p className="fs-4 fst-italic">"{randomQuote.text}"</p>
              <footer className="blockquote-footer text-white-50 mt-3">
                {randomQuote.author}
              </footer>
            </div>
          ) : (
            <p className="text-white-50 fst-italic">Loading inspirational quote...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;