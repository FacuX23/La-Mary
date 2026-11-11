// Claves para el LocalStorage
const CLAVE_TURNOS = "turnos_la_mary";
const CLAVE_MASCOTAS = "mascotas_la_mary";
const CLAVE_VETERINARIOS = "veterinarios";

// Variable de control para saber si estamos editando un turno
let idTurnoEditando = null;

// Obtener datos del Storage con seguridad
const obtenerTurnos = () => JSON.parse(localStorage.getItem(CLAVE_TURNOS)) || [];
const guardarTurnosStorage = (turnos) => localStorage.setItem(CLAVE_TURNOS, JSON.stringify(turnos));
const obtenerMascotasStorage = () => JSON.parse(localStorage.getItem(CLAVE_MASCOTAS)) || [];

// Obtener veterinarios (con respaldo por defecto si el storage estuviera vacío)
function obtenerVeterinariosStorage() {
    const data = localStorage.getItem(CLAVE_VETERINARIOS);
    if (data) {
        try {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
            console.error("Error al leer veterinarios", e);
        }
    }
    return [
        { nombre: "Dra. Sofía De los Ríos", especializacion: "Clínica de pequeños animales" },
        { nombre: "Dra. Camila Martínez", especializacion: "Dermatología veterinaria" },
        { nombre: "Dra. Lucía Benítez", especializacion: "Medicina preventiva" },
        { nombre: "Dr. Matías Giménez", especializacion: "Cirugía veterinaria" },
        { nombre: "Dra. Valeria Acosta", especializacion: "Cardiología veterinaria" },
        { nombre: "Dra. Florencia Ortíz", especializacion: "Clínica de pequeños animales" }
    ];
}

// Mostrar Toast de éxito
const mostrarToastTurno = (mensaje = "¡Operación realizada con éxito!") => {
    const toastEl = document.getElementById("toastTurno");
    if (toastEl) {
        const toastBody = toastEl.querySelector(".toast-body");
        if (toastBody) toastBody.textContent = `✔ ${mensaje}`;
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
};

// Poblar los selects del formulario al cargar la página
function cargarSelects() {
    const selectMascota = document.getElementById("selectMascota");
    const selectVeterinario = document.getElementById("selectVeterinario");

    if (selectMascota) {
        const mascotas = obtenerMascotasStorage();
        selectMascota.innerHTML = '<option value="" selected disabled>Ej: Lupita - Gata (Seleccione paciente...)</option>';
        
        if (mascotas.length > 0) {
            mascotas.forEach(m => {
                const option = document.createElement("option");
                option.value = m.nombreMascota;
                option.textContent = `${m.nombreMascota} - Dueño: ${m.nombreDuenio} (${m.color})`;
                selectMascota.appendChild(option);
            });
        }
    }

    if (selectVeterinario) {
        const veterinarios = obtenerVeterinariosStorage();
        selectVeterinario.innerHTML = '<option value="" selected disabled>Seleccione profesional...</option>';
        
        veterinarios.forEach(v => {
            const option = document.createElement("option");
            option.value = v.nombre;
            option.textContent = `${v.nombre} (${v.especializacion})`;
            selectVeterinario.appendChild(option);
        });
    }
}

// Generar horarios cada 20 minutos
function generarHorariosDisponibles() {
    const selectHora = document.getElementById("horaTurno");
    if (!selectHora) return;

    selectHora.innerHTML = '<option value="" selected disabled>Desplegar para elegir horario...</option>';

    const rangosHorarios = [
        { inicioH: 9, inicioM: 0, finH: 13, finM: 0 },   // Mañana: 09:00 a 13:00
        { inicioH: 16, inicioM: 0, finH: 20, finM: 0 }  // Tarde: 16:00 a 20:00
    ];

    rangosHorarios.forEach(rango => {
        let horaActual = new Date();
        horaActual.setHours(rango.inicioH, rango.inicioM, 0, 0);

        let horaFin = new Date();
        horaFin.setHours(rango.finH, rango.finM, 0, 0);

        while (horaActual < horaFin) {
            const h = String(horaActual.getHours()).padStart(2, '0');
            const m = String(horaActual.getMinutes()).padStart(2, '0');
            const horaString = `${h}:${m}`;

            const option = document.createElement("option");
            option.value = horaString;
            option.textContent = `${horaString} hs`;
            selectHora.appendChild(option);

            horaActual.setMinutes(horaActual.getMinutes() + 20);
        }
    });
}

// Renderizar la tabla de turnos
function mostrarTurnos(listaFiltro) {
    const tbody = document.getElementById("tablaTurnosBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    const turnos = listaFiltro !== undefined ? listaFiltro : obtenerTurnos();

    if (turnos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No hay turnos agendados todavía.</td></tr>`;
        return;
    }

    turnos.forEach(t => {
        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="d-flex flex-column">
                        <span>${t.fecha}</span>
                        <span class="text-muted small">${t.hora} hs</span>
                    </div>
                </td>
                <td>${t.mascota}</td>
                <td>${t.nombreDueño}</td>
                <td>${t.veterinario}</td>
                <td class="text-center text-nowrap">
                    <div class="d-flex flex-nowrap justify-content-center gap-2">
                        <button class="btn-edit btn-sm me-1" onclick="cargarParaEditar('${t.idTurno}')">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#667451"><path d="M200-200h57l391-391-57-57-391 391v57Zm-40 80q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm600-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                        Editar</button>
                        <button class="btn-delete btn-sm" onclick="cancelarTurno('${t.idTurno}')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#C62828"><path d="M12,13.4l2.9,2.9q0.28,0.27 0.7,0.27t0.7-0.27q0.27-0.28 0.27-0.7T16.3,14.9L13.4,12l2.9-2.9q0.27-0.28 0.27-0.7T16.3,7.7T15.6,7.43T14.9,7.7L12,10.6L9.1,7.7Q8.83,7.43 8.4,7.43T7.7,7.7T7.43,8.4T7.7,9.1L10.6,12L7.7,14.9q-0.27,0.27-0.27,0.7T7.7,16.3t0.7,0.27q0.43,0 0.7-0.27L12,13.4ZM12,22q-2.07,0-3.9-0.79q-1.82-0.79-3.17-2.14Q3.58,17.73 2.79,15.9T2,12Q2,9.92 2.79,8.1Q3.58,6.27 4.93,4.93Q6.28,3.57 8.1,2.79Q9.93,2 12,2t3.9,0.79t3.17,2.14q1.35,1.35 2.14,3.17Q22,9.92 22,12t-0.79,3.9t-2.14,3.17q-1.35,1.35-3.17,2.14T12,22Zm0-2q3.35,0 5.68-2.32T20,12T17.68,6.32T12,4T6.33,6.32T4,12t2.33,5.68T12,20Zm0-8Z"/></svg>
                        Cancelar</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Limpiar formulario y salir del modo edición
function limpiarFormularioTurno() {
    idTurnoEditando = null;
    const formTurno = document.getElementById("formTurno");
    if (formTurno) formTurno.reset();

    const btnGuardar = document.getElementById("btnGuardarTurno");
    const btnCancelar = document.getElementById("btnCancelarEdicion");
    
    if (btnGuardar) btnGuardar.textContent = "Agendar Turno";
    if (btnCancelar) btnCancelar.classList.add("d-none");
    
    cargarSelects();
    generarHorariosDisponibles();
}

// Enviar formulario (Crear o Actualizar)
const formTurno = document.getElementById("formTurno");
if (formTurno) {
    formTurno.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombreDueño = document.getElementById("nombreDueño").value.trim();
        const mascotaSeleccionada = document.getElementById("selectMascota").value;
        const fecha = document.getElementById("fechaTurno").value;
        const hora = document.getElementById("horaTurno").value;
        const veterinario = document.getElementById("selectVeterinario").value;

        if (!nombreDueño || !mascotaSeleccionada || !fecha || !hora || !veterinario) {
            alert("Por favor complete todos los campos obligatorios.");
            return;
        }

        // 1. VALIDACIÓN DE TITULARIDAD (Dueño y Mascota)
        const mascotasRegistradas = obtenerMascotasStorage();
        const mascotaEncontrada = mascotasRegistradas.find(m => 
            m.nombreMascota.toLowerCase() === mascotaSeleccionada.toLowerCase() &&
            m.nombreDuenio.toLowerCase() === nombreDueño.toLowerCase()
        );

        if (!mascotaEncontrada) {
            alert(`⚠️ Error de validación: La mascota "${mascotaSeleccionada}" no pertenece al dueño ingresado ("${nombreDueño}"). Verifique los datos.`);
            return;
        }

        // 2. VALIDACIÓN DE DISPONIBILIDAD HORARIA DEL PROFESIONAL
        const turnos = obtenerTurnos();
        const turnoOcupado = turnos.find(t => 
            t.veterinario === veterinario && 
            t.fecha === fecha && 
            t.hora === hora && 
            t.idTurno !== idTurnoEditando // Excluye el propio turno si estamos editando
        );

        if (turnoOcupado) {
            alert(`⚠️ Horario no disponible: El profesional "${veterinario}" ya tiene un turno agendado el día ${fecha} a las ${hora} hs.`);
            return;
        }

        if (idTurnoEditando === null) {
            // CREAR NUEVO TURNO
            const nuevoTurno = {
                idTurno: "turno_" + Date.now(),
                nombreDueño,
                mascota: mascotaSeleccionada,
                fecha,
                hora,
                veterinario
            };
            turnos.push(nuevoTurno);
            mostrarToastTurno("¡Turno agendado exitosamente!");
        } else {
            // ACTUALIZAR TURNO EXISTENTE
            const turnosActualizados = turnos.map(t => {
                if (t.idTurno === idTurnoEditando) {
                    return {
                        ...t,
                        nombreDueño,
                        mascota: mascotaSeleccionada,
                        fecha,
                        hora,
                        veterinario
                    };
                }
                return t;
            });
            guardarTurnosStorage(turnosActualizados);
            mostrarToastTurno("¡Turno actualizado exitosamente!");
        }

        if (idTurnoEditando === null) {
            guardarTurnosStorage(turnos);
        }

        mostrarTurnos();
        limpiarFormularioTurno();
    });
}

// Cargar datos en el formulario para editar
window.cargarParaEditar = (id) => {
    const turnos = obtenerTurnos();
    const turno = turnos.find(t => t.idTurno === id);
    if (!turno) return;

    idTurnoEditando = id;

    document.getElementById("nombreDueño").value = turno.nombreDueño;
    document.getElementById("fechaTurno").value = turno.fecha;

    const selectMascota = document.getElementById("selectMascota");
    if (selectMascota) selectMascota.value = turno.mascota;

    const selectHora = document.getElementById("horaTurno");
    if (selectHora) selectHora.value = turno.hora;

    const selectVeterinario = document.getElementById("selectVeterinario");
    if (selectVeterinario) selectVeterinario.value = turno.veterinario;

    const btnGuardar = document.getElementById("btnGuardarTurno");
    const btnCancelar = document.getElementById("btnCancelarEdicion");

    if (btnGuardar) btnGuardar.textContent = "Actualizar Cambios";
    if (btnCancelar) btnCancelar.classList.remove("d-none");

    window.scrollTo({ top: 0, behavior: "smooth" });
};

// Botón cancelar edición
const btnCancelarEdicion = document.getElementById("btnCancelarEdicion");
if (btnCancelarEdicion) {
    btnCancelarEdicion.addEventListener("click", limpiarFormularioTurno);
}

// Variable temporal para guardar el turno que se quiere cancelar (cuando se abre la modal)
let idTurnoACancelar = null;

// Paso 1 para cancelar: abrimos la modal de confirmación y guardamos el ID del turno
window.cancelarTurno = (id) => {
    idTurnoACancelar = id;
    const modalCancelarEl = document.getElementById("modalCancelarTurno");
    const modalCancelar = new bootstrap.Modal(modalCancelarEl);
    modalCancelar.show();
};

// Paso 2 para cancelar: cuando el usuario confirma, borramos el turno del LocalStorage
const btnConfirmarCancelarTurno = document.getElementById("btnConfirmarCancelarTurno");
if (btnConfirmarCancelarTurno) {
    btnConfirmarCancelarTurno.addEventListener("click", () => {
        if (!idTurnoACancelar) return;

        let turnos = obtenerTurnos();
        turnos = turnos.filter(t => t.idTurno !== idTurnoACancelar);
        guardarTurnosStorage(turnos);
        mostrarTurnos();

        // Cerramos la modal de forma programática
        const modalCancelarEl = document.getElementById("modalCancelarTurno");
        const modalInstance = bootstrap.Modal.getInstance(modalCancelarEl);
        if (modalInstance) modalInstance.hide();

        mostrarToastTurno("Turno cancelado correctamente.");

        if (idTurnoEditando === idTurnoACancelar) {
            limpiarFormularioTurno();
        }

        // Limpiamos la variable temporal
        idTurnoACancelar = null;
    });
}

// Buscador de turnos
const buscadorTurnos = document.getElementById("buscadorTurnos");
if (buscadorTurnos) {
    buscadorTurnos.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const turnos = obtenerTurnos();
        const filtrados = turnos.filter(t => 
            t.mascota.toLowerCase().includes(query) || 
            t.nombreDueño.toLowerCase().includes(query) ||
            t.veterinario.toLowerCase().includes(query)
        );
        mostrarTurnos(filtrados);
    });
}

// Inicializar al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    cargarSelects();
    generarHorariosDisponibles();
    mostrarTurnos();
});