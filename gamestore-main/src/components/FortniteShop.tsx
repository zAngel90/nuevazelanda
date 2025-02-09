import React, { useEffect, useState } from 'react';
import { getDailyShop } from '../services/fortniteApi';
import { Filter, ChevronDown, ChevronUp, Loader2, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from 'react-router-dom';

interface ShopItem {
  mainId: string;
  offerId: string;
  displayName: string;
  displayDescription: string;
  price: {
    regularPrice: number;
    finalPrice: number;
    floorPrice: number;
  };
  rarity: {
    id: string;
    name: string;
  };
  displayAssets: {
    full_background: string;
    background: string;
  }[];
  categories: string[];
}

const FortniteShop: React.FC = () => {
  const { addItem, getItemQuantity, hasItems } = useCart();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<string>('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();

  // Estados para los filtros
  const [rarityFilters, setRarityFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  
  // Estados para los acordeones
  const [isRarityOpen, setIsRarityOpen] = useState(false);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);

  useEffect(() => {
    // Si estamos regresando del checkout y tenemos keepCart en true, no hacemos nada
    const state = location.state as { keepCart?: boolean };
    if (state?.keepCart) {
      return;
    }
    fetchItems();
  }, [location]);

  useEffect(() => {
    setFilteredItems(applyAllFilters(items));
  }, [items, rarityFilters, priceRange]);

  const fetchItems = async () => {
    try {
      const data = await getDailyShop();
      setItems(data);
      setFilteredItems(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los items');
      setLoading(false);
    }
  };

  const handleRarityFilter = (rarity: string) => {
    setRarityFilters(prev => {
      const normalized = rarity.toLowerCase();
      return prev.includes(normalized)
        ? prev.filter(r => r !== normalized)
        : [...prev, normalized];
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const applyAllFilters = (items: ShopItem[]) => {
    let filtered = [...items];

    if (rarityFilters.length > 0) {
      filtered = filtered.filter(item =>
        item.rarity?.name && rarityFilters.includes(item.rarity.name.toLowerCase())
      );
    }

    if (priceRange.min !== 0 || priceRange.max !== 2000) {
      filtered = filtered.filter(
        item =>
          item.price?.finalPrice >= priceRange.min &&
          item.price?.finalPrice <= priceRange.max
      );
    }

    return filtered;
  };

  // Obtener rarezas únicas
  const uniqueRarities = Array.from(new Set(
    items.map(item => item.rarity?.name).filter(Boolean)
  ));

  // Función para manejar la adición de items al carrito
  const handleAddToCart = (item: ShopItem) => {
    const result = addItem({
      mainId: item.mainId,
      offerId: item.offerId,
      displayName: item.displayName,
      displayDescription: item.displayDescription,
      price: item.price,
      rarity: item.rarity,
      displayAssets: item.displayAssets,
      categories: item.categories,
      image: item.displayAssets[0]?.full_background || item.displayAssets[0]?.background,
      quantity: 1
    });

    if (result.success) {
      setLastAddedItem(item.displayName);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } else {
      setErrorMessage(result.message || '');
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Cargando tienda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-24 flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-28">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Filtros */}
        <div className="lg:w-64">
          {/* Filtro de Rareza */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <button
              onClick={() => setIsRarityOpen(!isRarityOpen)}
              className="w-full px-6 py-5 flex items-center justify-between text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-primary-600" />
                <span className="font-medium">Rareza</span>
              </div>
              {isRarityOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            
            {isRarityOpen && (
              <div className="p-6">
                <div className="flex flex-col gap-3">
                  {uniqueRarities.map((rarity) => (
                    <button
                      key={rarity}
                      onClick={() => handleRarityFilter(rarity)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        rarityFilters.includes(rarity.toLowerCase())
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-primary-600 ${
                          rarityFilters.includes(rarity.toLowerCase()) ? 'bg-white' : ''
                        }`}
                      />
                      {rarity}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filtro de Precio */}
          <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
            <button
              onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
              className="w-full px-6 py-5 flex items-center justify-between text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-primary-600" />
                <span className="font-medium">Filtrar por Precio</span>
              </div>
              {isPriceFilterOpen ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            
            {isPriceFilterOpen && (
              <div className="p-6">
                <div className="space-y-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange.min} V-Bucks</span>
                    <span>{priceRange.max} V-Bucks</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                    name="max"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contenido Principal */}
        <main className="flex-1">
          {/* Notificación flotante */}
          {showNotification && (
            <div className="fixed bottom-4 right-4 bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span>{lastAddedItem} agregado al carrito</span>
              </div>
            </div>
          )}

          {/* Notificación de error */}
          {showErrorMessage && (
            <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
              <div className="flex items-center gap-2">
                <X className="w-5 h-5" />
                <span>{errorMessage}</span>
              </div>
            </div>
          )}
          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.mainId}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 lg:aspect-none group-hover:opacity-90 transition-opacity lg:h-80">
                  {item.displayAssets && item.displayAssets[0] && (
                    <img
                      src={item.displayAssets[0].full_background || item.displayAssets[0].background}
                      alt={item.displayName}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.displayName}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">{item.rarity.name}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-medium text-primary-600">
                      {item.price.finalPrice} V-Bucks
                    </p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`p-2 rounded-full transition-colors relative ${
                        hasItems && getItemQuantity(item.mainId) === 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-primary-600 hover:bg-primary-50'
                      }`}
                      title={hasItems && getItemQuantity(item.mainId) === 0 
                        ? "No es posible enviar dos regalos simultáneamente"
                        : "Agregar al carrito"}
                      disabled={hasItems && getItemQuantity(item.mainId) === 0}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {getItemQuantity(item.mainId) > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {getItemQuantity(item.mainId)}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No se encontraron items para los filtros seleccionados.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FortniteShop;