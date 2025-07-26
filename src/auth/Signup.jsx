import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';
import googleButton from '../assets/Sign_Up_with_Google_button.svg';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
  e.preventDefault();
  setErrorMsg('');

  const { data: signUpData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        display_name: name, // optional, metadata for display name
      },
    },
  });

  if (error) {
    setErrorMsg(error.message);
    return;
  }

  const userId = signUpData?.user?.id; // UUID
  if (!userId) {
    setErrorMsg('User ID not returned after signup');
    return;
  }

  // insert into custom user table
  const { error: insertError } = await supabase.from('user').insert({
    id: userId,  // must be UUID in your DB
    name,
    email,
    is_public: false,
  });

  if (insertError) {
    setErrorMsg(insertError.message);
    return;
  }

  // reset form and redirect
  setEmail('');
  setPassword('');
  setName('');
  navigate('/dashboard');
};


  const handleGoogleAuth = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="auth-container">
      <div className="form-section">
        <h2 className="auth-title">Create Your Account</h2>
        <form onSubmit={handleSignUp} className="auth-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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

          <button type="submit">Create Account</button>

          <div className="link" style={{ textAlign: 'left' }}>
            <Link to="/reset-password" className="bold-link">Forgot password?</Link>
          </div>

          <div className="link" style={{ textAlign: 'center' }}>or</div>

          <div className="google-button" onClick={handleGoogleAuth}>
            <img
              src={googleButton}
              alt="Sign up with Google"
              style={{ width: '100%' }}
            />
          </div>

          <div className="have-account">
            <span>Already have an account? </span>
            <Link to="/login" className="bold-link">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
