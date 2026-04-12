// Funciones del panel de administración

function renderizarPanelAdmin() {
    const container = document.getElementById("adminPanel");
    if (!container || !Estado.esAdmin) return;
    
    const apuestasList = Estado.apuestas && Estado.apuestas.length > 0 
        ? Estado.apuestas.map(apuesta => `
            <tr>
                <td>${apuesta.nombre || "?"}</td>
                <td>${apuesta.equipo || "?"}</td>
                <td>${formatearMoneda(apuesta.monto || 0)}</td>
                <td>${apuesta.puntos || 0}</td>
                <td>
                    <button onclick="eliminarApuesta('${apuesta.id}')" class="btn-danger">🗑️</button>
                </td>
            </tr>
        `).join('')
        : '<tr><td colspan="5">No hay apuestas registradas</td></tr>';
    
    container.innerHTML = `
        <div class="admin-section">
            <h2>🔧 Panel de Administración</h2>
            
            <div class="card">
                <h3>📝 Registrar nueva apuesta</h3>
                <form id="formApuesta">
                    <div class="form-group">
                        <label>Nombre del amigo:</label>
                        <input type="text" id="apuestaNombre" required>
                    </div>
                    <div class="form-group">
                        <label>Equipo:</label>
                        <select id="apuestaEquipo" required>
                            <option value="">Seleccionar...</option>
                            ${EQUIPOS_DISPONIBLES.map(e => `<option value="${e}">${e}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Monto (${CONFIG.APP.MONEDA}):</label>
                        <input type="number" id="apuestaMonto" min="${CONFIG.APP.MONTO_MINIMO}" required>
                    </div>
                    <button type="submit" class="btn-submit">Guardar apuesta</button>
                </form>
            </div>
            
            <div class="card">
                <h3>⚽ Ingresar resultado de partido</h3>
                <form id="formResultado">
                    <div class="form-group">
                        <label>Equipo A:</label>
                        <select id="resultadoEquipoA" required>
                            <option value="">Seleccionar...</option>
                            ${EQUIPOS_DISPONIBLES.map(e => `<option value="${e}">${e}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Equipo B:</label>
                        <select id="resultadoEquipoB" required>
                            <option value="">Seleccionar...</option>
                            ${EQUIPOS_DISPONIBLES.map(e => `<option value="${e}">${e}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ganador:</label>
                        <select id="resultadoGanador" required>
                            <option value="">Seleccionar...</option>
                            <option value="empate">Empate</option>
                            ${EQUIPOS_DISPONIBLES.map(e => `<option value="${e}">${e}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Fase del torneo:</label>
                        <select id="resultadoFase" required>
                            <option value="grupos">Fase de grupos</option>
                            <option value="octavos">Octavos de final</option>
                            <option value="cuartos">Cuartos de final</option>
                            <option value="semifinal">Semifinal</option>
                            <option value="final">Final</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-submit">Guardar resultado</button>
                </form>
            </div>
            
            <div class="card">
                <h3>📋 Apuestas registradas</h3>
                <div style="overflow-x: auto;">
                    <table class="tabla-puntajes">
                        <thead>
                            <tr><th>Amigo</th><th>Equipo</th><th>Monto</th><th>Puntos</th><th></th></tr>
                        </thead>
                        <tbody>
                            ${apuestasList}
                        </tbody>
                    </table>
                </div>
                <p><small>Total: ${Estado.apuestas?.length || 0} apuestas registradas</small></p>
            </div>
        </div>
    `;
    
    document.getElementById("formApuesta")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("apuestaNombre").value;
        const equipo = document.getElementById("apuestaEquipo").value;
        const monto = parseFloat(document.getElementById("apuestaMonto").value);
        
        const validacion = validarNombre(nombre);
        if (!validacion.valido) {
            alert(validacion.mensaje);
            return;
        }
        
        const apuesta = { nombre, equipo, monto, puntos: 0 };
        await guardarApuestaEnPocketBase(apuesta);
        e.target.reset();
    });
    
    document.getElementById("formResultado")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const equipoA = document.getElementById("resultadoEquipoA").value;
        const equipoB = document.getElementById("resultadoEquipoB").value;
        const ganador = document.getElementById("resultadoGanador").value;
        const fase = document.getElementById("resultadoFase").value;
        
        const resultado = { equipoA, equipoB, ganador, fase };
        await guardarResultadoEnPocketBase(resultado);
        e.target.reset();
    });
}

window.eliminarApuesta = eliminarApuesta;