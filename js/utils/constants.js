// Constantes del sistema de puntuación

const REGLAS_PUNTUACION = {
    VICTORIA: 3,
    EMPATE: 1,
    DERROTA: 0,
    BONOS: {
        OCTAVOS: 2,
        CUARTOS: 3,
        SEMIFINAL: 4,
        FINAL: 5,
        CAMPEON: 6
    }
};

const FASES_TORNEO = {
    GRUPOS: "grupos",
    OCTAVOS: "octavos",
    CUARTOS: "cuartos",
    SEMIFINAL: "semifinal",
    FINAL: "final",
    CAMPEON: "campeon"
};

const EQUIPOS_DISPONIBLES = [
    "Argentina", "Brasil", "Francia", "Inglaterra", "España",
    "Alemania", "Holanda", "Portugal", "Bélgica", "Croacia",
    "Uruguay", "México", "Estados Unidos", "Japón", "Corea del Sur",
    "Marruecos", "Senegal", "Camerún", "Ghana", "Australia"
];

const MENSAJES_ERROR = {
    MONTO_INVALIDO: "El monto debe ser un número válido",
    MONTO_MINIMO: `El monto mínimo es ${CONFIG.APP.MONTO_MINIMO}`,
    EQUIPO_INVALIDO: "Selecciona un equipo válido",
    NOMBRE_REQUERIDO: "El nombre del amigo es requerido"
};