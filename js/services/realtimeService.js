// Servicio de tiempo real con PocketBase (SSE)

let realtimeActive = false;
let apuestasSource = null;
let partidosSource = null;

function iniciarRealtime() {
    if (realtimeActive) return;
    
    try {
        const pbUrl = CONFIG.POCKETBASE_URL;
        
        apuestasSource = new EventSource(`${pbUrl}/api/collections/${CONFIG.COLECCIONES.APUESTAS}/records/events`);
        partidosSource = new EventSource(`${pbUrl}/api/collections/${CONFIG.COLECCIONES.PARTIDOS}/records/events`);
        
        apuestasSource.onmessage = (event) => {
            console.log("Cambio en apuestas:", event.data);
            cargarDatosDesdePocketBase();
        };
        
        partidosSource.onmessage = (event) => {
            console.log("Cambio en partidos:", event.data);
            cargarDatosDesdePocketBase();
        };
        
        apuestasSource.onerror = () => console.log("SSE apuestas desconectado");
        partidosSource.onerror = () => console.log("SSE partidos desconectado");
        
        realtimeActive = true;
        console.log("🔴 Realtime activado");
    } catch (error) {
        console.error("Error iniciando realtime:", error);
    }
}

function detenerRealtime() {
    if (apuestasSource) apuestasSource.close();
    if (partidosSource) partidosSource.close();
    realtimeActive = false;
    console.log("🔴 Realtime detenido");
}