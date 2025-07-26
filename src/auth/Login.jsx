import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import googleButton from '../assets/Continue_with_Google_button.svg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMsg && <p className="error">{errorMsg}</p>}
          <button type="submit">Log In</button>
        </form>

        <img
          src={googleButton}
          alt="Continue with Google"
          className="google-button"
          onClick={handleGoogleLogin}
          style={{ cursor: 'pointer', marginTop: '1rem', width: '100%' }}
        />
      </div>
      <div className="visual-section">
        <p>
          Organize quotes that speak to you.
          <br />
          Receive a quote that understands.
        </p>
      </div>
    </div>
  );
}

export default Login;