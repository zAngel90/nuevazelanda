import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiConfig } from '../config/api';

interface BotStatus {
  isAuthenticated: boolean;
  displayName: string | null;
  lastError: string | null;
}

const Bot: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [botStatus, setBotStatus] = useState<BotStatus>({
    isAuthenticated: false,
    displayName: null,
    lastError: null
  });

  const checkBotStatus = async () => {
    try {
      const response = await fetch(`${apiConfig.botURL}/bot2/api/bot-status?botId=1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      const data = await response.json();
      
      setBotStatus({
        isAuthenticated: Boolean(data.isAuthenticated),
        displayName: data.displayName || null,
        lastError: null
      });
    } catch (error) {
      console.error('Error verificando estado:', error);
      setBotStatus(prev => ({
        ...prev,
        lastError: 'Error al verificar el estado del bot'
      }));
    }
  };

  useEffect(() => {
    checkBotStatus();
    const interval = setInterval(checkBotStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error('Por favor ingresa un nombre de usuario');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiConfig.botURL}/bot2/api/friend-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ 
          username, 
          botId: 'bot2',
          sendFromAllBots: true 
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('¡Solicitudes de amistad enviadas desde todos los bots!');
        setUsername('');
        checkBotStatus();
      } else {
        toast.error(data.message || 'Error al enviar las solicitudes de amistad');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section con efecto parallax */}
      <div className="relative h-[40vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('/fortnite-crew-bg.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
        <div className="relative h-full flex flex-col items-center justify-center">
          <div className="text-center space-y-2">
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600 leading-relaxed pb-1">
              Conecta con nuestros Bots
            </h1>
            <p className="text-lg text-white">
              Sigue los pasos para empezar a recibir regalos
            </p>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Estado del Bot */}
          <div className="bg-[#ADADAD] rounded-xl p-6 mb-8 shadow-lg border-2 border-gray-400">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Estado del Bot
              </h3>
              <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                botStatus.isAuthenticated
                  ? 'bg-green-500/20 text-green-700 border-2 border-green-500'
                  : 'bg-yellow-500/20 text-yellow-700 border-2 border-yellow-500'
              }`}>
                {botStatus.isAuthenticated ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            {botStatus.displayName && (
              <p className="mt-3 text-sm text-gray-700">
                Conectado como: <span className="font-bold text-gray-900">{botStatus.displayName}</span>
              </p>
            )}
            {botStatus.lastError && (
              <p className="mt-3 text-sm text-red-600 font-medium">
                Error: {botStatus.lastError}
              </p>
            )}
          </div>

          {/* Pasos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#ADADAD] rounded-xl p-6 text-gray-800 shadow-lg border-2 border-gray-400 transform transition-all hover:scale-105">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold mb-4 text-lg border-2 border-gray-600">
                1
              </div>
              <h3 className="text-lg font-bold mb-2">Ingresa tu nombre de usuario</h3>
              <p className="text-gray-700 text-sm">
                Escribe tu nombre de usuario de Fortnite
              </p>
            </div>

            <div className="bg-[#ADADAD] rounded-xl p-6 text-gray-800 shadow-lg border-2 border-gray-400 transform transition-all hover:scale-105">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold mb-4 text-lg border-2 border-gray-600">
                2
              </div>
              <h3 className="text-lg font-bold mb-2">Acepta la solicitud</h3>
              <p className="text-gray-700 text-sm">
                Acepta la solicitud de amistad en el juego
              </p>
            </div>

            <div className="bg-[#ADADAD] rounded-xl p-6 text-gray-800 shadow-lg border-2 border-gray-400 transform transition-all hover:scale-105">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold mb-4 text-lg border-2 border-gray-600">
                3
              </div>
              <h3 className="text-lg font-bold mb-2">¡Listo para recibir regalos!</h3>
              <p className="text-gray-700 text-sm">
                Ya puedes recibir regalos de nuestra tienda
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-[#ADADAD] rounded-xl p-6 shadow-lg border-2 border-gray-400">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-lg font-bold text-gray-800 mb-2">
                  Nombre de usuario de Fortnite
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent shadow-inner"
                  placeholder="Ej: Ninja"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-2 border-gray-600`}
              >
                {loading ? 'Enviando solicitud...' : 'Enviar solicitud de amistad'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Bot;