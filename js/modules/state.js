// Estado global de la aplicación

const Estado = {
    apuestas: [],
    partidos: [],
    puntajesTotales: [],
    esAdmin: false,
    cargando: false
};

function actualizarEstado(nuevoEstado) {
    Object.assign(Estado, nuevoEstado);
    if (typeof renderizarUI === 'function') {
        renderizarUI();
    }
}