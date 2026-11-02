import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Reservations from './pages/Reservations';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          {/* public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderConfirmation />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/login" element={<Login />} />

          {/* logged-in users only */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* admins only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* any other URL */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
       <ChatBot />
    </>
  );
}

export default App;