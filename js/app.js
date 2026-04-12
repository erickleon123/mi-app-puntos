// Aplicación principal con PocketBase

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Iniciando app con PocketBase...");
    console.log("Conectando a:", CONFIG.POCKETBASE_URL);
    
    // Verificar sesión guardada
    verificarSesionAdmin();
    
    // Cargar datos desde PocketBase
    await cargarDatosDesdePocketBase();
    
    // Configurar event listeners
    const adminLoginBtn = document.getElementById("adminLoginBtn");
    const adminLogoutBtn = document.getElementById("adminLogoutBtn");
    
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener("click", () => {
            mostrarModalLogin();
        });
    }
    
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener("click", () => {
            cerrarSesionAdmin();
        });
    }
    
    console.log("App lista con PocketBase");
});