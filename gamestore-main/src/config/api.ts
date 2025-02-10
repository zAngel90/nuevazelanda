// Configuración de la API
export const API_CONFIG = {
    // URL base para la VPS
    BASE_URL: 'http://85.31.233.39:3003',
    
    // Endpoints
    ENDPOINTS: {
        FRIEND_REQUEST: '/bot2/api/friend-request',
        BOT_STATUS: '/bot2/api/bot-status',
        VALIDATE_FRIEND: '/bot2/api/validate-friend',
        CHECK_FRIENDSHIP: '/bot2/api/check-friendship',
        RAW_CATALOG: '/bot2/api/raw-catalog',
        SEND_GIFT: '/bot2/api/send-gift'
    }
};

export const apiConfig = {
    // URL de la VPS
    botURL: API_CONFIG.BASE_URL,
    // Agregar el origen para referencia
    origin: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
}