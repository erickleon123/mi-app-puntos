// Servicio de comunicación con PocketBase

let pbClient = null;

function initPocketBase() {
    if (!pbClient) {
        pbClient = {
            baseUrl: CONFIG.POCKETBASE_URL,
            collections: CONFIG.COLECCIONES
        };
    }
    return pbClient;
}

async function cargarDatosDesdePocketBase() {
    mostrarSpinner(true);
    try {
        const pb = initPocketBase();
        
        const apuestasUrl = `${pb.baseUrl}/api/collections/${pb.collections.APUESTAS}/records?perPage=100`;
        const partidosUrl = `${pb.baseUrl}/api/collections/${pb.collections.PARTIDOS}/records?perPage=100`;
        
        console.log("Cargando apuestas desde:", apuestasUrl);
        console.log("Cargando partidos desde:", partidosUrl);
        
        // Cargar apuestas
        let apuestasItems = [];
        try {
            const apuestasResponse = await fetch(apuestasUrl);
            if (apuestasResponse.ok) {
                const apuestasData = await apuestasResponse.json();
                apuestasItems = apuestasData.items || [];
                console.log("Apuestas cargadas:", apuestasItems.length);
            } else {
                console.warn("Error cargando apuestas:", apuestasResponse.status);
            }
        } catch (error) {
            console.error("Error en fetch de apuestas:", error);
        }
        
        // Cargar partidos
        let partidosItems = [];
        try {
            const partidosResponse = await fetch(partidosUrl);
            if (partidosResponse.ok) {
                const partidosData = await partidosResponse.json();
                partidosItems = partidosData.items || [];
                console.log("Partidos cargados:", partidosItems.length);
            } else {
                console.warn("Error cargando partidos:", partidosResponse.status);
            }
        } catch (error) {
            console.error("Error en fetch de partidos:", error);
        }
        
        Estado.apuestas = apuestasItems.map(item => ({
            id: item.id,
            nombre: item.nombre || "",
            equipo: item.equipo || "",
            monto: item.monto || 0,
            puntos: item.puntos || 0,
            fecha: item.fecha || new Date().toISOString()
        }));
        
        Estado.partidos = partidosItems.map(item => ({
            id: item.id,
            equipoA: item.equipoA || "",
            equipoB: item.equipoB || "",
            ganador: item.ganador || "",
            fase: item.fase || "",
            fecha: item.fecha || new Date().toISOString()
        }));
        
        calcularPuntajesTotales();
        renderizarUI();
        
        console.log("✅ Datos cargados:", Estado.apuestas.length, "apuestas,", Estado.partidos.length, "partidos");
        return true;
        
    } catch (error) {
        console.error("Error general:", error);
        if (!error.message?.includes("404")) {
            alert("Error al conectar con PocketBase. Asegúrate que el servidor está corriendo en " + CONFIG.POCKETBASE_URL);
        }
        return false;
    } finally {
        mostrarSpinner(false);
    }
}

async function guardarApuestaEnPocketBase(apuesta) {
    mostrarSpinner(true);
    try {
        const pb = initPocketBase();
        
        const response = await fetch(`${pb.baseUrl}/api/collections/${pb.collections.APUESTAS}/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: apuesta.nombre,
                equipo: apuesta.equipo,
                monto: apuesta.monto,
                puntos: apuesta.puntos || 0,
                fecha: new Date().toISOString()
            })
        });
        
        const data = await response.json();
        
        if (data.id) {
            await cargarDatosDesdePocketBase();
            alert("✅ Apuesta guardada");
            return true;
        } else {
            alert("Error: " + JSON.stringify(data));
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de red");
        return false;
    } finally {
        mostrarSpinner(false);
    }
}

async function guardarResultadoEnPocketBase(resultado) {
    mostrarSpinner(true);
    try {
        const pb = initPocketBase();
        
        const response = await fetch(`${pb.baseUrl}/api/collections/${pb.collections.PARTIDOS}/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                equipoA: resultado.equipoA,
                equipoB: resultado.equipoB,
                ganador: resultado.ganador,
                fase: resultado.fase,
                fecha: new Date().toISOString()
            })
        });
        
        const data = await response.json();
        
        if (data.id) {
            await cargarDatosDesdePocketBase();
            alert("✅ Resultado guardado");
            return true;
        } else {
            alert("Error: " + JSON.stringify(data));
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de red");
        return false;
    } finally {
        mostrarSpinner(false);
    }
}

function calcularPuntajesTotales() {
    const puntajesMap = new Map();
    
    if (!Estado.apuestas || Estado.apuestas.length === 0) {
        Estado.puntajesTotales = [];
        return;
    }
    
    for (const apuesta of Estado.apuestas) {
        let puntos = 0;
        let bonos = 0;
        
        if (Estado.partidos && Estado.partidos.length > 0) {
            for (const partido of Estado.partidos) {
                if (partido.ganador === apuesta.equipo) {
                    puntos += REGLAS_PUNTUACION.VICTORIA;
                } else if (partido.ganador === "empate" && 
                          (partido.equipoA === apuesta.equipo || partido.equipoB === apuesta.equipo)) {
                    puntos += REGLAS_PUNTUACION.EMPATE;
                }
            }
            
            const fasesAlcanzadas = new Set(Estado.partidos
                .filter(p => p.ganador === apuesta.equipo)
                .map(p => p.fase));
            
            if (fasesAlcanzadas.has("octavos")) bonos += REGLAS_PUNTUACION.BONOS.OCTAVOS;
            if (fasesAlcanzadas.has("cuartos")) bonos += REGLAS_PUNTUACION.BONOS.CUARTOS;
            if (fasesAlcanzadas.has("semifinal")) bonos += REGLAS_PUNTUACION.BONOS.SEMIFINAL;
            if (fasesAlcanzadas.has("final")) bonos += REGLAS_PUNTUACION.BONOS.FINAL;
            if (fasesAlcanzadas.has("campeon")) bonos += REGLAS_PUNTUACION.BONOS.CAMPEON;
        }
        
        const total = puntos + bonos;
        
        if (puntajesMap.has(apuesta.nombre)) {
            const existing = puntajesMap.get(apuesta.nombre);
            existing.puntos += total;
            existing.monto += apuesta.monto;
        } else {
            puntajesMap.set(apuesta.nombre, {
                nombre: apuesta.nombre,
                equipo: apuesta.equipo,
                puntos: total,
                monto: apuesta.monto
            });
        }
    }
    
    Estado.puntajesTotales = Array.from(puntajesMap.values());
    Estado.puntajesTotales.sort((a, b) => b.puntos - a.puntos);
    
    console.log("Puntajes calculados:", Estado.puntajesTotales.length, "jugadores");
}

async function eliminarApuesta(id) {
    if (!confirm("¿Eliminar esta apuesta?")) return false;
    
    mostrarSpinner(true);
    try {
        const pb = initPocketBase();
        
        const response = await fetch(`${pb.baseUrl}/api/collections/${pb.collections.APUESTAS}/records/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await cargarDatosDesdePocketBase();
            alert("✅ Apuesta eliminada");
            return true;
        } else {
            alert("Error al eliminar");
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    } finally {
        mostrarSpinner(false);
    }
}