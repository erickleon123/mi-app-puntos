// Utilidades de formato

function formatearMoneda(monto) {
    return `${CONFIG.APP.MONEDA}${(monto || 0).toFixed(2)}`;
}

function formatearFecha(fecha) {
    if (!fecha) return "";
    const d = new Date(fecha);
    return d.toLocaleDateString("es-ES");
}

function formatearPuntos(puntos) {
    return (puntos || 0).toString();
}

function capitalizarNombre(nombre) {
    if (!nombre) return "";
    return nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
}