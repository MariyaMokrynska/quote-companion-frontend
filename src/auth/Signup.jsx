import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import googleButton from '../assets/Sign_Up_with_Google_button.svg';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [randomQuote, setRandomQuote] = useState(null);
  const navigate = useNavigate();

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
        console.error('Error fetching quote:', error);
      }
    };

    fetchQuote();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          display_name: name,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const userId = signUpData?.user?.id;
    if (!userId) {
      setErrorMsg('User ID not returned after signup');
      return;
    }

    const { error: insertError } = await supabase.from('user').insert({
      id: userId,
      name,
      email,
      is_public: false,
    });

    if (insertError) {
      setErrorMsg(insertError.message);
      return;
    }

    setEmail('');
    setPassword('');
    setName('');
    navigate('/dashboard');
  };

  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // ✅ works for both local & deployed
      },
    });
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light px-0">
      <div className="row w-100 mx-0">
        {/* Left: Sign Up Form */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center px-5">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4 text-center">Create Your Account</h2>
            <form onSubmit={handleSignUp}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                    {/* {showPassword ? '👁️' : '🙈'} */}
                    <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-3 text-danger text-center">{errorMsg}</div>
              )}

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Create Account
              </button>
            </form>

            <div className="text-center mb-3">
              <Link to="/reset" className="text-decoration-none">Forgot password?</Link>
            </div>

            <div className="text-center mb-3 text-muted">or</div>

            <div className="text-center mb-3">
              <button onClick={handleGoogleAuth} className="btn w-100 p-0 border-0 bg-transparent">
                <img src={googleButton} alt="Sign up with Google" className="img-fluid" />
              </button>
            </div>

            <div className="text-center">
              <span>Already have an account? </span>
              <Link to="/login" className="fw-bold text-decoration-none">Log in</Link>
            </div>
          </div>
        </div>

        {/* Right: Quote Section */}
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
            <p className="text-white-50 fst-italic">Loading quote...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
