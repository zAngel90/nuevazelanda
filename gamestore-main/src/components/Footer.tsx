import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#EBECEA] text-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Tienda</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-gray-900 transition-colors">Inicio</Link></li>
              <li><Link to="/fortnite-shop" className="hover:text-gray-900 transition-colors">Fortnite Shop</Link></li>
              <li><Link to="/nuevos" className="hover:text-gray-900 transition-colors">Nuevos Lanzamientos</Link></li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Contacto</h3>
            <ul className="space-y-2">
              <li><a href="mailto:info@gamestore.com" className="hover:text-gray-900 transition-colors">Email</a></li>
              <li><a href="tel:+1234567890" className="hover:text-gray-900 transition-colors">Teléfono</a></li>
              <li><Link to="/ubicacion" className="hover:text-gray-900 transition-colors">Ubicación</Link></li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Soporte</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:text-gray-900 transition-colors">FAQ</Link></li>
              <li><Link to="/ayuda" className="hover:text-gray-900 transition-colors">Centro de Ayuda</Link></li>
              <li><Link to="/politicas" className="hover:text-gray-900 transition-colors">Políticas</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Redes Sociales</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors flex items-center justify-center md:justify-start">
                  <i className="fab fa-facebook mr-2"></i> Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors flex items-center justify-center md:justify-start">
                  <i className="fab fa-instagram mr-2"></i> Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors flex items-center justify-center md:justify-start">
                  <i className="fab fa-twitter mr-2"></i> Twitter
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Medios de Pago</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center md:justify-start">
                <i className="fab fa-cc-visa mr-2"></i> Visa
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <i className="fab fa-cc-mastercard mr-2"></i> Mastercard
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <i className="fab fa-cc-paypal mr-2"></i> PayPal
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-8 border-t border-gray-300">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} GameStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
