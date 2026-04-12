// Renderizado de UI

function renderizarUI() {
    renderizarTablaPuntajes();
    if (Estado.esAdmin) {
        renderizarPanelAdmin();
    }
}

function renderizarTablaPuntajes() {
    const container = document.getElementById("tablaContainer");
    if (!container) return;
    
    if (!Estado.puntajesTotales || Estado.puntajesTotales.length === 0) {
        if (Estado.apuestas && Estado.apuestas.length > 0) {
            container.innerHTML = "<p>📊 Calculando puntajes...</p>";
        } else {
            container.innerHTML = `
                <div class="tabla-container">
                    <p style="text-align: center; padding: 40px;">
                        🏆 No hay apuestas registradas aún<br>
                        <small>Inicia sesión como administrador para comenzar</small>
                    </p>
                </div>
            `;
        }
        return;
    }
    
    let html = `
        <div class="tabla-container">
            <table class="tabla-puntajes">
                <thead>
                    <tr><th>Posición</th><th>Amigo</th><th>Equipo</th><th>Puntos</th><th>Monto</th></tr>
                </thead>
                <tbody>
    `;
    
    Estado.puntajesTotales.forEach((item, idx) => {
        html += `
            <tr>
                <td>${idx + 1}º</td>
                <td>${item.nombre || "?"}</td>
                <td>${item.equipo || "?"}</td>
                <td><strong>${item.puntos || 0}</strong></td>
                <td>${formatearMoneda(item.monto || 0)}</td>
            </tr>
        `;
    });
    
    const pozoTotal = Estado.apuestas.reduce((sum, a) => sum + (a.monto || 0), 0);
    html += `
                </tbody>
            </table>
        </div>
        <div class="pozo-total">
            <h3>💰 Pozo total: ${formatearMoneda(pozoTotal)}</h3>
            ${Estado.partidos.length === 0 ? '<p><small>⚽ Aún no hay resultados de partidos</small></p>' : ''}
        </div>
    `;
    
    container.innerHTML = html;
}

function mostrarPanelAdmin() {
    const panel = document.getElementById("adminPanel");
    const loginBtn = document.getElementById("adminLoginBtn");
    const logoutBtn = document.getElementById("adminLogoutBtn");
    
    if (panel) panel.style.display = "block";
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    
    renderizarPanelAdmin();
}

function ocultarPanelAdmin() {
    const panel = document.getElementById("adminPanel");
    const loginBtn = document.getElementById("adminLoginBtn");
    const logoutBtn = document.getElementById("adminLogoutBtn");
    
    if (panel) panel.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
}

function mostrarModalLogin() {
    const modal = document.getElementById("loginModal");
    if (!modal) return;
    
    modal.innerHTML = `
        <div class="modal-content">
            <h2>🔐 Acceso Administrador</h2>
            <form id="formLogin">
                <div class="form-group">
                    <label>Contraseña:</label>
                    <input type="password" id="loginPassword" required>
                </div>
                <button type="submit" class="btn-submit">Ingresar</button>
                <button type="button" id="closeModal" class="btn-cancel">Cancelar</button>
            </form>
        </div>
    `;
    modal.style.display = "flex";
    
    document.getElementById("formLogin")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const password = document.getElementById("loginPassword").value;
        await iniciarSesionAdmin(password);
    });
    
    document.getElementById("closeModal")?.addEventListener("click", () => {
        ocultarModalLogin();
    });
}

function ocultarModalLogin() {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "none";
}

function mostrarSpinner(mostrar) {
    const spinner = document.getElementById("loadingSpinner");
    if (!spinner) return;
    
    if (mostrar) {
        spinner.innerHTML = `<div class="spinner"></div>`;
        spinner.style.display = "flex";
    } else {
        spinner.style.display = "none";
    }
}