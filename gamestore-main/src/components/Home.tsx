import React, { useEffect, useState } from 'react';
import { ChevronRight, Star, TrendingUp, Zap, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDailyShop, FortniteItem } from '../services/fortniteApi';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState<FortniteItem[]>([]);
  const [latestItems, setLatestItems] = useState<FortniteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const shopItems = await getDailyShop();
        const filteredItems = shopItems
          .filter(item => {
            const lowerDisplayType = item.displayType?.toLowerCase() || '';
            const lowerMainId = item.mainId?.toLowerCase() || '';
            const lowerDisplayName = item.displayName?.toLowerCase() || '';
            const lowerDescription = item.displayDescription?.toLowerCase() || '';
            
            const musicKeywords = ['track', 'música', 'music', 'jam', 'beat', 'remix', 'sonido', 'sound'];
            return !musicKeywords.some(keyword => 
              lowerDisplayType.includes(keyword) || 
              lowerMainId.includes(keyword) || 
              lowerDisplayName.includes(keyword) || 
              lowerDescription.includes(keyword)
            );
          })
          .slice(0, 4);
        
        setFeaturedItems(filteredItems);
      } catch (error) {
        console.error('Error fetching Fortnite items:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestItems = async () => {
      try {
        const shopItems = await getDailyShop();
        setLatestItems(shopItems);
      } catch (error) {
        console.error('Error fetching Fortnite items:', error);
      }
    };

    fetchFeaturedItems();
    fetchLatestItems();
  }, []);

  const getBestImage = (item: FortniteItem) => {
    if (item.displayAssets?.[0]?.url) {
      return item.displayAssets[0].url;
    }
    return item.displayAssets?.[0]?.background || '';
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - Modernizado */}
      <section className="relative h-screen w-full flex items-center overflow-hidden hero-background">
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="w-full max-w-[1440px] mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-7xl md:text-8xl font-bold text-white mb-8 leading-tight">
              Tus items y<br/>
              accesorios<br/>
              <span className="text-primary-400">Definitivos</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed">
              Consigue los mejores ítems de Fortnite hoy mismo. <br/>
              Skins y accesorios exclusivos para ganar tus partidas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/fortnite-shop"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5" />
                Explorar Tienda
              </Link>
              <button className="px-8 py-4 bg-black/30 hover:bg-black/40 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105">
                Ver Ofertas
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fortnite Items - Renovado */}
      <section className="py-24 relative bg-gradient-to-b from-gray-100 via-[#D9DBDF] to-[#D9DBDF]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Items Destacados de Fortnite</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explora nuestra selección de items más populares y exclusivos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {loading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-80 rounded-2xl mb-4"></div>
                  <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/4 rounded"></div>
                </div>
              ))
            ) : (
              featuredItems.map((item) => (
                <div key={item.mainId} className="group">
                  <div className="relative overflow-hidden rounded-2xl mb-4 bg-gray-50">
                    {getBestImage(item) ? (
                      <img 
                        src={getBestImage(item)}
                        alt={item.displayName}
                        className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-80 bg-gray-100 flex items-center justify-center p-4 text-center">
                        <span className="text-gray-800 font-semibold">{item.displayName}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <Link 
                          to="/fortnite-shop" 
                          className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Ver en Tienda
                        </Link>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {item.displayName}
                  </h3>
                  <p className="text-gray-600 mb-2">{item.mainType}</p>
                  <p className="text-primary-600 font-bold text-lg">{item.price.finalPrice} V-Bucks</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonios Section - Reemplaza Latest Items Section */}
      <section className="py-20 relative bg-gradient-to-b from-[#D9DBDF] via-white to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-gray-600 text-lg">
              Descubre por qué somos la opción preferida de miles de gamers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-800">Carlos R.</h4>
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "El mejor servicio que he encontrado para comprar items de Fortnite. Entrega inmediata y precios increíbles."
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-800">Ana M.</h4>
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Excelente atención al cliente. Tuve un problema con mi compra y lo resolvieron de inmediato. ¡100% recomendado!"
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-800">Diego L.</h4>
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Los mejores precios del mercado y un proceso de compra super sencillo. ¡Seguiré comprando aquí!"
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;