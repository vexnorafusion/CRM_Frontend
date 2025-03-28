/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const validEmail = 'xyz@gmail.com';
  const initialPassword = 'xyz123'; 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState(initialPassword);
   const navigate = useNavigate();

const handleLogin = () => {
    if (email === validEmail && password === storedPassword) {
      alert('Login successful');
       navigate('/Dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleUpdatePassword = () => {
    if (email === validEmail) {
      setStoredPassword(newPassword); // Update stored password
      setNewPassword('');
      setIsForgotPassword(false);
      setError('');
      alert('Password updated successfully');
    } else {
      setError('Invalid email');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backgroundColor: 'white' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>
          {isForgotPassword ? 'Forgot Password' : 'Login'}
        </h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        {isForgotPassword ? (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <button
              style={{ width: '100%', padding: '10px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}
              onClick={handleUpdatePassword}
            >
              Update Password
            </button>
          </>
        ) : (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <button
              style={{ width: '100%', padding: '10px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}
              onClick={handleLogin}
            >
              Login
            </button>
          </>
        )}
        <button
          style={{ marginTop: '16px', color: '#3b82f6', textDecoration: 'underline', width: '100%', textAlign: 'center', background: 'none', border: 'none' }}
          onClick={() => setIsForgotPassword(!isForgotPassword)}
        >
          {isForgotPassword ? 'Back to Login' : 'Forgot your password?'}
        </button>
      </div>
    </div>
  );
};

export default Login;
