// Configuración para PocketBase
// ⚠️ CAMBIA ESTA URL por la que te dé Railway después del despliegue
const CONFIG = {
    POCKETBASE_URL: "mi-app-puntos-production.up.railway.app",  // ← CAMBIAR
    
    COLECCIONES: {
        APUESTAS: "apuestas",
        PARTIDOS: "partidos",
        CONFIG: "configuracion"
    },
    
    APP: {
        NOMBRE: "Apuestas Mundial",
        MONEDA: "$",
        MONTO_MINIMO: 10,
        ADMIN_PASSWORD: "mundial2026"  // ← CAMBIAR por una segura
    }
};
