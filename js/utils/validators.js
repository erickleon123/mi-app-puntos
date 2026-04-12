// Validadores

function validarMonto(monto) {
    const num = parseFloat(monto);
    if (isNaN(num)) return { valido: false, mensaje: MENSAJES_ERROR.MONTO_INVALIDO };
    if (num < CONFIG.APP.MONTO_MINIMO) return { valido: false, mensaje: MENSAJES_ERROR.MONTO_MINIMO };
    return { valido: true, valor: num };
}

function validarNombre(nombre) {
    if (!nombre || nombre.trim() === "") {
        return { valido: false, mensaje: MENSAJES_ERROR.NOMBRE_REQUERIDO };
    }
    return { valido: true, valor: nombre.trim() };
}

function validarEquipo(equipo) {
    if (!EQUIPOS_DISPONIBLES.includes(equipo)) {
        return { valido: false, mensaje: MENSAJES_ERROR.EQUIPO_INVALIDO };
    }
    return { valido: true };
}