// Autenticación de administrador

function verificarContraseñaAdmin(contrasenaIngresada) {
    return contrasenaIngresada === CONFIG.APP.ADMIN_PASSWORD;
}

async function iniciarSesionAdmin(contrasena) {
    if (verificarContraseñaAdmin(contrasena)) {
        guardarSesionAdmin(true);
        Estado.esAdmin = true;
        mostrarPanelAdmin();
        ocultarModalLogin();
        alert("✅ Sesión de administrador iniciada");
        return true;
    } else {
        alert("❌ Contraseña incorrecta");
        return false;
    }
}

function cerrarSesionAdmin() {
    guardarSesionAdmin(false);
    Estado.esAdmin = false;
    ocultarPanelAdmin();
    alert("Sesión cerrada");
}