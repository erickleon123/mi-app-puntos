// Manejo de sesión

function guardarSesionAdmin(esAdmin) {
    if (esAdmin) {
        localStorage.setItem("adminSession", "true");
        localStorage.setItem("adminSessionTime", Date.now().toString());
    } else {
        localStorage.removeItem("adminSession");
        localStorage.removeItem("adminSessionTime");
    }
}

function verificarSesionAdmin() {
    const session = localStorage.getItem("adminSession");
    const sessionTime = localStorage.getItem("adminSessionTime");
    
    if (session === "true" && sessionTime) {
        const tiempoTranscurrido = Date.now() - parseInt(sessionTime);
        const HORA = 3600000;
        if (tiempoTranscurrido < HORA) {
            Estado.esAdmin = true;
            mostrarPanelAdmin();
            return true;
        } else {
            guardarSesionAdmin(false);
            return false;
        }
    }
    return false;
}