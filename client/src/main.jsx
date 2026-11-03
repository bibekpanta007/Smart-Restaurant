import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import App from './App.jsx';
import './index.css';
import { OrderProvider } from './context/OrderContext';
import { ReservationProvider } from './context/ReservationContext';
import { AuthProvider } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <ReservationProvider>
              <App />
            </ReservationProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);