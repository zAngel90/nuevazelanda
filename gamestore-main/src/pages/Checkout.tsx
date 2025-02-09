import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Check, Gift, LogOut } from 'lucide-react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const CheckoutSteps = ({ currentStep, isAuthenticated }: { currentStep: number, isAuthenticated: boolean }) => {
  const steps = [
    { title: 'Resumen', description: 'Detalles del producto' },
    ...(!isAuthenticated ? [{ title: 'Usuario', description: 'Información de usuario' }] : []),
    { title: 'Pago', description: 'Confirmar y pagar' }
  ];

  return (
    <div className="flex justify-between">
      {steps.map((step, index) => {
        const isActive = index + 1 === currentStep;
        const isCompleted = index + 1 < currentStep;

        return (
          <div key={step.title} className="flex-1">
            <div className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 ${
                    currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const OrderSummary = ({ item, onContinue }) => {
  const navigate = useNavigate();
  const { items: cartItems } = useCart();

  const handleBack = () => {
    if (cartItems.length > 0) {
      navigate('/fortnite-shop', { state: { keepCart: true } });
    } else {
      navigate('/fortnite-shop');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Detalles del Producto</h2>
      <div className="flex gap-8 mb-8">
        <div className="w-1/3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={item.image}
              alt={item.displayName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.displayName}</h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Gift className="w-5 h-5 text-primary-500" />
              <span>Regalo Especial</span>
            </div>
            <p className="text-gray-600">Cantidad: 1</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary-600">{item.price.finalPrice}</span>
              <span className="text-gray-500">V-Bucks</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-6 border-t border-gray-100">
        <button
          onClick={handleBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          Volver a la tienda
        </button>
        <button
          onClick={onContinue}
          className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

const UserInformation = ({ onContinue, onBack }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor ingresa tu nombre de usuario');
      return;
    }
    onContinue(username);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Información de Usuario</h2>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de Usuario de Fortnite
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            placeholder="Ingresa tu usuario de Fortnite"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-600" />
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
};

const Payment = ({ item, username, onBack }) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const mounted = React.useRef(true);

  // Cleanup al desmontar
  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handlePayment = async () => {
    if (processing) return; // Evitar múltiples clicks

    try {
      setProcessing(true);
      setError('');
      setSuccess(false);
      
      // Validar campos requeridos
      if (!item.offerId || !item.displayName || !item.price?.finalPrice || !username) {
        setError('Faltan datos requeridos para procesar la orden');
        setProcessing(false);
        return;
      }

      // Crear la orden de Fortnite
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/db/api/fortnite/orders`, {
        offer_id: item.offerId,
        item_name: item.displayName,
        price: item.price.finalPrice,
        username: username
      });

      // Solo actualizar el estado si el componente sigue montado
      if (mounted.current) {
        if (response.data.success) {
          setSuccess(true);
          // Mostrar el mensaje de éxito de la respuesta
          const message = response.data.data?.message || '¡Orden creada exitosamente!';
          console.log('Orden creada:', message);
          
          // Esperar 2 segundos antes de redirigir
          setTimeout(() => {
            if (mounted.current) {
              navigate('/fortnite-shop');
            }
          }, 2000);
        } else {
          setError('No se pudo procesar la orden. Por favor, intente nuevamente.');
        }
        // Asegurarnos de que processing se actualice
        setProcessing(false);
      }
    } catch (err) {
      console.error('Error al crear orden:', err);
      // Solo actualizar el estado si el componente sigue montado
      if (mounted.current) {
        setError(
          err.response?.data?.error || 
          'Error al crear la orden. Por favor, intente nuevamente.'
        );
      }
      // Asegurarnos de que processing se actualice
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Confirmar Orden</h2>
      
      {/* Mostrar mensaje de éxito */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">¡Orden creada exitosamente! Redirigiendo...</span>
        </div>
      )}

      {/* Mostrar error si existe */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <p className="text-gray-600">
          ¿Estás seguro de que deseas procesar esta orden?
        </p>
        
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={processing}
          >
            Atrás
          </button>
          
          <button
            onClick={handlePayment}
            disabled={processing}
            className={`px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
              processing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <span>Confirmar Orden</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const { items } = useCart();
  const item = items[0]; // Asumimos que solo hay un item en el carrito

  // Obtener información del usuario del localStorage
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    if (!item) {
      navigate('/shop');
    }
    // Si hay un usuario autenticado, establecer su nombre de usuario
    if (user) {
      setUsername(user.username);
    }
  }, [item, navigate, user]);

  const handleContinue = () => {
    if (user) {
      // Si el usuario está autenticado, saltar directamente al paso de pago
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleUserSubmit = (username: string) => {
    setUsername(username);
    setStep(3);
  };

  const handleBack = (targetStep: number) => {
    if (targetStep === 1) {
      // Si volvemos al primer paso, mantenemos el item en el carrito
      setStep(1);
    } else {
      setStep(step - 1);
    }
  };

  if (!item) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <CheckoutSteps currentStep={step} isAuthenticated={!!user} />
          
          {step === 1 && <OrderSummary item={item} onContinue={handleContinue} />}
          {step === 2 && !user && (
            <UserInformation onContinue={handleUserSubmit} onBack={() => handleBack(1)} />
          )}
          {step === 3 && <Payment item={item} username={username} onBack={() => handleBack(1)} />}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
