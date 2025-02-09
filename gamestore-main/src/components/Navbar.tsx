import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, User, Gamepad2, Home, Gift, Sparkles, Tag, Trash2, MessageSquare, Users, LogOut } from 'lucide-react';
import logo from '../assets/logo.svg';
import { useCart } from '../context/CartContext';
import { useClickOutside } from '../hooks/useClickOutside';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavLink = ({ to, icon, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 ${
        isActive 
          ? 'text-primary-600 bg-primary-50/50 font-medium' 
          : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50/50'
      }`}
    >
      {icon}
      <span className="text-sm">{children}</span>
    </Link>
  );
};

const SearchBar = () => (
  <div className="relative flex-1 max-w-xl">
    <input
      type="text"
      placeholder="Buscar items..."
      className="w-full px-4 py-2.5 pl-11 rounded-xl border border-gray-200 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all duration-200"
    />
    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
  </div>
);

const UserDropdown = ({ isOpen }) => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg py-2 z-50">
        <div className="px-4 py-3">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bienvenido</h3>
            <p className="text-sm text-gray-600 mb-4">Inicia sesión para continuar</p>
            <Link 
              to="/login" 
              className="block w-full px-4 py-2 mb-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="block w-full px-4 py-2 text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg py-2 z-50">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <User className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.username}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
      
      <div className="py-2">
        <Link 
          to="/profile" 
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <User className="w-5 h-5" />
          <span>Mi Perfil</span>
        </Link>
        <Link 
          to="/purchases" 
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Tag className="w-5 h-5" />
          <span>Mis Compras</span>
        </Link>
      </div>

      <div className="border-t border-gray-100 pt-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

const CartDropdown = ({ isOpen, cartItems = [], onRemoveItem }) => {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.price.finalPrice * item.quantity), 0);

  return (
    <div className="fixed right-4 top-20 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="flex items-center justify-between text-white mb-2">
          <h3 className="text-xl font-bold">Mi Carrito</h3>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm">{cartItems.length} item(s)</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      {cartItems.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-300" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h4>
          <p className="text-gray-500 text-sm">¡Agrega algunos items para empezar!</p>
        </div>
      ) : (
        <>
          {/* Items List */}
          <div className="max-h-[400px] overflow-y-auto">
            {cartItems.map((item) => (
              <div 
                key={item.mainId} 
                className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 relative group"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={item.image} 
                      alt={item.displayName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1 pr-8">{item.displayName}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-gray-500">Regalo Especial</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary-600">{item.price.finalPrice}</span>
                        <span className="text-sm text-gray-500">V-Bucks</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => onRemoveItem(item.mainId)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Total</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary-600">{total}</span>
                <span className="text-gray-500">V-Bucks</span>
              </div>
            </div>
            <Link 
              to="/checkout"
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl text-center font-medium hover:bg-primary-700 transition-colors"
            >
              Proceder al Pago
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const { items: cartItems, removeItem, isOpen: isCartOpen, toggleCart, closeCart } = useCart();
  
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(cartDropdownRef, () => closeCart());
  useClickOutside(userDropdownRef, () => setIsUserOpen(false));

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/", icon: <Home className="w-5 h-5" />, label: "Inicio" },
    { to: "/crew", icon: <Users className="w-5 h-5" />, label: "Crew" },
    { to: "/bot", icon: <MessageSquare className="w-5 h-5" />, label: "Bot" },
    { to: "/fortnite-shop", icon: <Gamepad2 className="w-5 h-5" />, label: "Fortnite" },
  ];

  return (
    <header className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 flex items-center gap-1.5"
          >
            <img src={logo} alt="GameStore" className="h-8 w-auto" />
          </Link>

          {/* Search Bar - Centered */}
          <div className="hidden lg:flex flex-1 justify-center mx-6">
            <SearchBar />
          </div>

          {/* Desktop Navigation and Actions - Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} icon={link.icon}>
                  {link.label}
                </NavLink>
              ))}
            </div>
            
            {/* User Menu with Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button 
                className="p-2 hover:bg-gray-50/50 rounded-lg transition-all duration-300"
                onClick={() => {
                  setIsUserOpen(!isUserOpen);
                  closeCart();
                }}
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
              <UserDropdown isOpen={isUserOpen} />
            </div>
            
            {/* Cart Button with Dropdown */}
            <div className="relative" ref={cartDropdownRef}>
              <button 
                className="p-2 hover:bg-gray-50/50 rounded-lg transition-all duration-300 relative"
                onClick={() => {
                  toggleCart();
                  setIsUserOpen(false);
                }}
              >
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <CartDropdown 
                isOpen={isCartOpen} 
                cartItems={cartItems} 
                onRemoveItem={removeItem}
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-50/50 rounded-lg transition-all duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="space-y-2">
              <div className="px-2 pb-4">
                <SearchBar />
              </div>
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} icon={link.icon}>
                  {link.label}
                </NavLink>
              ))}
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-50/50 rounded-lg transition-all duration-300"
                >
                  <User className="w-5 h-5" />
                  <span>Mi Perfil</span>
                </Link>
                <Link 
                  to="/purchases" 
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-50/50 rounded-lg transition-all duration-300"
                >
                  <Tag className="w-5 h-5" />
                  <span>Mis Compras</span>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;