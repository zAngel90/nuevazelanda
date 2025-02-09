import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import FortniteShop from './components/FortniteShop';
import Bot from './components/Bot';
import Crew from './components/Crew';
import Register from './components/Register';
import UserLogin from './components/Login'; 
import AdminLogin from './pages/Login'; 
import AdminPanel from './pages/AdminPanel';
import VBucksManager from './pages/VBucksManager';
import UserManager from './pages/UserManager';
import Checkout from './pages/Checkout';
import { CartProvider } from './context/CartContext';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fortnite-shop" element={<FortniteShop />} />
              <Route path="/bot" element={<Bot />} />
              <Route path="/crew" element={<Crew />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} /> 
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/vbucks" element={<VBucksManager />} />
              <Route path="/admin/users" element={<UserManager />} />
              <Route path="/checkout" element={<Checkout />} /> 
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;