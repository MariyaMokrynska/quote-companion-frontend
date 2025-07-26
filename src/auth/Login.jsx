import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';
import googleButton from '../assets/Continue_with_Google_button.svg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

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
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="auth-container">
      <div className="form-section">
        <h2 className="auth-title">Welcome Back</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>
          {errorMsg && <p className="error">{errorMsg}</p>}
          <button type="submit">Log In</button>
        </form>

        <div className="forgot-password">
          <Link to="/reset" className="bold-link">Forgot password?</Link>
        </div>

        <div className="center-align" style={{ margin: '1rem 0' }}>or</div>

        <div className="google-button" onClick={handleGoogleLogin}>
          <img
            src={googleButton}
            alt="Continue with Google"
            style={{ width: '100%' }}
          />
        </div>

        <div className="have-account center-align">
          <span>Don't have an account? </span>
          <Link to="/signup" className="bold-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;