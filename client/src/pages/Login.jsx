import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  // false = login form, true = register form
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  // already logged in? go to the profile instead
  if (user) {
    return <Navigate to="/profile" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function switchMode() {
    setIsRegister(!isRegister);
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();

    // simple validation
    if (isRegister && form.name.trim() === '') {
      setError('Please enter your name.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const result = isRegister
      ? register(form.name.trim(), form.email.trim(), form.password)
      : login(form.email.trim(), form.password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    // admins go to the dashboard, customers to their profile
    navigate(result.user.role === 'admin' ? '/admin' : '/profile');
  }

  return (
    <div className="auth-card">
      <h2 className="page-title">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>

      {error && <p className="form-error">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {isRegister && (
          <label className="form-field">
            Full name
            <input name="name" value={form.name} onChange={handleChange} />
          </label>
        )}

        <label className="form-field">
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} />
        </label>

        <label className="form-field">
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </label>

        <button type="submit" className="btn">
          {isRegister ? 'Register' : 'Log In'}
        </button>
      </form>

      <p className="switch-text">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button className="link-btn" onClick={switchMode}>
          {isRegister ? 'Log in' : 'Register'}
        </button>
      </p>

      <p className="demo-hint">Admin demo: admin@restaurant.com / admin123</p>
    </div>
  );
}

export default Login;