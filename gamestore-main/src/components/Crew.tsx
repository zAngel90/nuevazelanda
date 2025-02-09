import React, { useState } from 'react';
import { Crown, ShoppingCart, User, Coins, Trophy, Rocket, Gift, Sparkles } from 'lucide-react';

const Crew = () => {
  const [selectedPlan, setSelectedPlan] = useState<number>(0);

  const plans = [
    {
      duration: "1 Mes",
      price: "COP 25,000.00",
      monthly: "COP 25,000.00 / mes",
      savings: null
    },
    {
      duration: "2 Meses",
      price: "COP 44,000.00",
      monthly: "COP 22,000.00 / mes",
      savings: "Ahorras COP 6,000.00"
    },
    {
      duration: "3 Meses",
      price: "COP 60,000.00",
      monthly: "COP 20,000.00 / mes",
      savings: "Ahorras COP 15,000.00"
    },
    {
      duration: "6 Meses",
      price: "COP 105,000.00",
      monthly: "COP 17,500.00 / mes",
      savings: "Ahorras COP 45,000.00"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Hero Section con efecto parallax */}
      <div className="relative h-[40vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('/fortnite-crew-bg.jpg')] bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('/fortnite-crew-bg.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
        <div className="relative h-full flex flex-col items-center">
          <div className="text-center mt-16 space-y-2">
            <div className="relative">
              <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600 leading-relaxed pb-1">
                Elige tu Plan
              </h1>
            </div>
            <p className="text-xl text-gray-100">
              Únete al Crew y obtén recompensas exclusivas
            </p>
          </div>
        </div>
      </div>

      {/* Sección de Planes */}
      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
                relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300
                ${selectedPlan === index 
                  ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white scale-105 shadow-xl' 
                  : 'bg-white hover:scale-105 shadow-lg'}
              `}
              onClick={() => setSelectedPlan(index)}
            >
              <div className="absolute top-0 right-0 w-20 h-20">
                {selectedPlan === index && (
                  <div className="absolute top-[6px] right-[-24px] rotate-45 bg-yellow-400 text-black text-xs py-1 w-32 text-center font-bold">
                    SELECTED
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{plan.duration}</h3>
                <div className={`text-3xl font-bold mb-2 ${selectedPlan === index ? 'text-white' : 'text-cyan-500'}`}>
                  {plan.price}
                </div>
                <div className={`text-sm mb-2 ${selectedPlan === index ? 'text-gray-100' : 'text-gray-500'}`}>
                  {plan.monthly}
                </div>
                {plan.savings && (
                  <div className="text-sm font-medium text-green-500">
                    {plan.savings}
                  </div>
                )}
              </div>

              <div className={`mt-4 p-4 ${selectedPlan === index ? 'bg-black bg-opacity-20' : 'bg-gray-50'}`}>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Crown className={`w-4 h-4 ${selectedPlan === index ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    <span>Skin mensual exclusiva</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${selectedPlan === index ? 'bg-cyan-300' : 'bg-cyan-500'}`} />
                    <span>1000 V-Bucks mensuales</span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de Compra */}
        <div className="text-center mt-12">
          <button
            className="
              bg-gradient-to-r from-cyan-500 to-purple-600 
              hover:from-cyan-600 hover:to-purple-700
              text-white font-bold py-4 px-8 rounded-xl
              transform transition-all duration-300 hover:scale-105
              flex items-center justify-center gap-2 mx-auto
              shadow-lg
            "
          >
            <ShoppingCart className="w-5 h-5" />
            Comprar Plan de {plans[selectedPlan].duration}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            * La suscripción se renueva automáticamente al finalizar el periodo. Puedes cancelar en cualquier momento.
          </p>
        </div>

        {/* Sección de Beneficios Exclusivos */}
        <div className="mt-24 mb-16">
          <h2 className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600">
            Beneficios Exclusivos
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Únete al Crew de Fortnite y obtén acceso a contenido exclusivo, recompensas mensuales y mucho más
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Skin Mensual */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Skin Mensual Exclusiva</h3>
              <p className="text-gray-600">
                Recibe cada mes una skin única y exclusiva que solo los miembros del Crew pueden obtener. ¡Destaca en el campo de batalla!
              </p>
            </div>

            {/* V-Bucks */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">1,000 V-Bucks Mensuales</h3>
              <p className="text-gray-600">
                Obtén 1,000 V-Bucks cada mes para gastar en el objeto que quieras de la tienda. ¡Personaliza tu experiencia al máximo!
              </p>
            </div>

            {/* Pase de Batalla */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pase de Batalla Incluido</h3>
              <p className="text-gray-600">
                Accede al Pase de Batalla actual y futuros mientras seas miembro. ¡Desbloquea más de 100 recompensas cada temporada!
              </p>
            </div>

            {/* Acceso Anticipado */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Acceso Anticipado</h3>
              <p className="text-gray-600">
                Sé el primero en probar nuevas características y contenido exclusivo antes que nadie. ¡Vive Fortnite como nunca antes!
              </p>
            </div>

            {/* Recompensas Extra */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recompensas Extra</h3>
              <p className="text-gray-600">
                Recibe objetos adicionales, emotes, pantallas de carga y más sorpresas cada mes. ¡Las recompensas nunca terminan!
              </p>
            </div>

            {/* Eventos Especiales */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Eventos Especiales</h3>
              <p className="text-gray-600">
                Participa en eventos exclusivos para miembros del Crew y obtén recompensas únicas. ¡No te pierdas ninguna aventura!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crew;