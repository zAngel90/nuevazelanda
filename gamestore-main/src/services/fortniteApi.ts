import axios from 'axios';

interface FortniteItem {
  mainId: string;
  offerId: string;
  displayName: string;
  displayDescription: string;
  displayType: string;
  mainType: string;
  displayAssets: {
    full_background: string;
    background: string;
  }[];
  price: {
    regularPrice: number;
    finalPrice: number;
    floorPrice: number;
  };
  rarity: {
    id: string;
    name: string;
  };
  section: {
    id: string;
    name: string;
  };
  granted: Array<{
    type: {
      name: string;
    };
  }>;
  buyAllowed: boolean;
  categories: string[];
  banner: any;
  giftAllowed: boolean;
  groupIndex: number;
  offerTag: string | null;
  priority: number;
  images: {
    icon: string;
    featured: string;
  };
}

export const getDailyShop = async () => {
  try {
    const response = await fetch('https://fortniteapi.io/v2/shop?lang=es', {
      headers: {
        'Authorization': 'eafc4329-54aeed01-a90cd52b-f749534c'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener datos de la tienda: ' + response.statusText);
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data);

    if (!data.shop || !Array.isArray(data.shop)) {
      throw new Error('Formato de respuesta inválido: no se encontró shop o no es un array');
    }

    // Términos relacionados con música para filtrar
    const musicTerms = [
      'music', 'música', 'track', 'pista', 
      'remix', 'beat', 'song', 'canción', 
      'lobby', 'audio', 'sound', 'sonido',
      'tune', 'melodía', 'melody', 'ritmo',
      'rhythm', 'baile', 'dance'
    ];

    const items = data.shop
      .filter((item: any) => {
        // Verificar si es un item de música
        if (!item || !item.mainId) return false;
        
        const nameLower = item.displayName?.toLowerCase() || '';
        const descLower = item.displayDescription?.toLowerCase() || '';
        const mainTypeLower = item.mainType?.toLowerCase() || '';
        
        // Excluir si contiene términos relacionados con música
        return !musicTerms.some(term => 
          nameLower.includes(term) || 
          descLower.includes(term) || 
          mainTypeLower.includes(term) ||
          mainTypeLower.includes('emote') // Excluir emotes también ya que suelen ser música
        );
      })
      .map((item: any) => ({
        mainId: item.mainId,
        offerId: item.offerId,
        displayName: item.displayName || '',
        displayDescription: item.displayDescription || '',
        displayType: item.displayType || '',
        mainType: item.mainType || '',
        displayAssets: item.displayAssets || [],
        price: {
          regularPrice: item.price?.regularPrice || 0,
          finalPrice: item.price?.finalPrice || 0,
          floorPrice: item.price?.floorPrice || 0
        },
        rarity: {
          id: item.rarity?.id || '',
          name: item.rarity?.name || ''
        },
        section: {
          id: item.section?.id || '',
          name: item.section?.name || ''
        },
        granted: item.granted || [],
        buyAllowed: item.buyAllowed || false,
        categories: item.categories || [],
        banner: item.banner,
        giftAllowed: item.giftAllowed || false,
        groupIndex: item.groupIndex || 0,
        offerTag: item.offerTag || null,
        priority: item.priority || 0
      }));

    console.log('Items procesados (sin música):', items);
    return items;
  } catch (error) {
    console.error('Error en getDailyShop:', error);
    throw new Error('Error al cargar los ítems de la tienda.');
  }
};