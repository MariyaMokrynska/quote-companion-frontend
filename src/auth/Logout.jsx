import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();
      setTimeout(() => {
        navigate('/');
      }, 1500);
    };

    signOut();
  }, [navigate]);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-dark"
      style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      {/* Spinner */}
      <div className="spinner-border text-primary mb-4" role="status" style={{ width: '4rem', height: '4rem' }}>
        <span className="visually-hidden">Logging out...</span>
      </div>

      {/* Text */}
      <h2 className="mb-2 fw-semibold">Logging out...</h2>
      <p className="text-secondary fs-5">Please wait a moment</p>
    </div>
  );
}

export default Logout;
