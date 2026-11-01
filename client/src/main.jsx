import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import App from './App.jsx';
import './index.css';
import { OrderProvider } from './context/OrderContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <BrowserRouter>
      <CartProvider>
        <OrderProvider>
          <App />
        </OrderProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);