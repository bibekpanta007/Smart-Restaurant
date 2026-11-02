import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// demo admin account (in Assignment 2 users will come from the database)
const defaultUsers = [
  { id: 1, name: 'Admin', email: 'admin@restaurant.com', password: 'admin123', role: 'admin' },
];

export function AuthProvider({ children }) {
  // all registered users
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  // the logged-in user, saved so they stay logged in after a refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  function login(email, password) {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Incorrect email or password.' };
    }

    // never keep the password in the logged-in user
    const loggedInUser = { id: found.id, name: found.name, email: found.email, role: found.role };
    setUser(loggedInUser);
    return { success: true, user: loggedInUser };
  }

  function register(name, email, password) {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    // new accounts are always customers
    const newUser = { id: Date.now(), name, email, password, role: 'customer' };
    setUsers((prev) => [...prev, newUser]);

    const loggedInUser = { id: newUser.id, name, email, role: 'customer' };
    setUser(loggedInUser);
    return { success: true, user: loggedInUser };
  }

  function logout() {
    setUser(null);
  }

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, users, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}