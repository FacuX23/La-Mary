// Claves para el LocalStorage
const CLAVE_HC = "historia_clinica_la_mary";
const CLAVE_MASCOTAS = "mascotas_la_mary";
const CLAVE_VETERINARIOS = "veterinarios";

let idHCEditando = null;

// Obtener datos del Storage
const obtenerHC = () => JSON.parse(localStorage.getItem(CLAVE_HC)) || [];
const guardarHCStorage = (hc) => localStorage.setItem(CLAVE_HC, JSON.stringify(hc));
const obtenerMascotasStorage = () => JSON.parse(localStorage.getItem(CLAVE_MASCOTAS)) || [];

// Obtener veterinarios con respaldo seguro
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
const mostrarToastHC = (mensaje = "¡Ficha médica guardada exitosamente!") => {
    const toastEl = document.getElementById("toastHC");
    if (toastEl) {
        const toastBody = toastEl.querySelector(".toast-body");
        if (toastBody) toastBody.textContent = `✔ ${mensaje}`;
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
};

// Actualizar las tarjetas de métricas en la interfaz
function actualizarEstadisticasHC(registros) {
    const totalFichas = registros.length;
    
    // Contar cuántas mascotas únicas tienen historia clínica
    const mascotasUnicas = new Set(registros.map(r => r.mascota)).size;

    const elTotal = document.getElementById("statTotalFichas");
    const elPacientes = document.getElementById("statPacientesUnicos");
    const elInternados = document.getElementById("statInternados");

    if (elTotal) elTotal.textContent = totalFichas;
    if (elPacientes) elPacientes.textContent = mascotasUnicas;
    
    // Contar pacientes con internación activa según el texto de diagnóstico o tratamiento
    const internados = registros.filter(r => 
        r.diagnostico.toLowerCase().includes("intern") || 
        r.tratamiento.toLowerCase().includes("intern")
    ).length;

    if (elInternados) elInternados.textContent = `${internados} Pacientes`;
}

// Cargar selects en el formulario
function cargarSelectsHC() {
    const selectMascota = document.getElementById("selectMascotaHC");
    const selectVeterinario = document.getElementById("selectVeterinarioHC");

    if (selectMascota) {
        const mascotas = obtenerMascotasStorage();
        selectMascota.innerHTML = '<option value="" selected disabled>Seleccione una mascota...</option>';
        mascotas.forEach(m => {
            const option = document.createElement("option");
            option.value = m.nombreMascota;
            option.textContent = `${m.nombreMascota} - Dueño: ${m.nombreDuenio}`;
            selectMascota.appendChild(option);
        });
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

// Renderizar tabla de Historias Clínicas
function mostrarHC(listaFiltro) {
    const tbody = document.getElementById("tablaHCBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    const registros = listaFiltro !== undefined ? listaFiltro : obtenerHC();

    // Actualizamos las tarjetas de estadísticas con los datos actuales
    actualizarEstadisticasHC(registros);

    if (registros.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No hay fichas médicas registradas.</td></tr>`;
        return;
    }

    registros.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.fechaAtencion}</td>
                <td><strong>${item.mascota}</strong></td>
                <td>${item.diagnostico}</td>
                <td>${item.veterinario}</td>
                <td class="text-center text-nowrap">
                    <div class="d-flex flex-nowrap justify-content-center gap-2">
                    <button class="btn-edit btn-sm" onclick="cargarParaEditarHC('${item.idHC}')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#667451"><path d="M200-200h57l391-391-57-57-391 391v57Zm-40 80q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm600-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    Editar</button>
                    <button class="btn-delete btn-sm" onclick="eliminarHC('${item.idHC}')">
                    <svg class="svg-danger" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#C62828"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM428.5-291.5Q440-303 440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280q17 0 28.5-11.5Zm160 0Q600-303 600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280q17 0 28.5-11.5ZM280-720v520-520Z"/></svg>
                    Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Limpiar formulario y salir de modo edición
function limpiarFormularioHC() {
    idHCEditando = null;
    const form = document.getElementById("formHistoriaClinica");
    if (form) form.reset();

    const btnGuardar = document.getElementById("btnGuardarHC");
    const btnCancelar = document.getElementById("btnCancelarEdicionHC");
    const tituloForm = document.getElementById("tituloFormHC");

    if (btnGuardar) btnGuardar.textContent = "Guardar Ficha";
    if (btnCancelar) btnCancelar.classList.add("d-none");
    if (tituloForm) tituloForm.textContent = "Nueva Ficha Médica";

    cargarSelectsHC();
}

// Enviar formulario (Crear o Actualizar)
const formHistoriaClinica = document.getElementById("formHistoriaClinica");
if (formHistoriaClinica) {
    formHistoriaClinica.addEventListener("submit", (e) => {
        e.preventDefault();

        const mascota = document.getElementById("selectMascotaHC").value;
        const fechaAtencion = document.getElementById("fechaAtencion").value;
        const diagnostico = document.getElementById("diagnosticoHC").value.trim();
        const tratamiento = document.getElementById("tratamientoHC").value.trim();
        const veterinario = document.getElementById("selectVeterinarioHC").value;

        if (!mascota || !fechaAtencion || !diagnostico || !tratamiento || !veterinario) {
            alert("Por favor complete todos los campos requeridos.");
            return;
        }

        let listaHC = obtenerHC();

        if (idHCEditando === null) {
            // NUEVO REGISTRO
            const nuevaFicha = {
                idHC: "hc_" + Date.now(),
                mascota,
                fechaAtencion,
                diagnostico,
                tratamiento,
                veterinario
            };
            listaHC.push(nuevaFicha);
            mostrarToastHC("¡Ficha médica guardada exitosamente!");
        } else {
            // ACTUALIZAR REGISTRO
            listaHC = listaHC.map(item => {
                if (item.idHC === idHCEditando) {
                    return {
                        ...item,
                        mascota,
                        fechaAtencion,
                        diagnostico,
                        tratamiento,
                        veterinario
                    };
                }
                return item;
            });
            mostrarToastHC("¡Ficha médica actualizada exitosamente!");
        }

        guardarHCStorage(listaHC);
        mostrarHC();
        limpiarFormularioHC();
    });
}

// Cargar para editar
window.cargarParaEditarHC = (id) => {
    const listaHC = obtenerHC();
    const item = listaHC.find(h => h.idHC === id);
    if (!item) return;

    idHCEditando = id;

    document.getElementById("selectMascotaHC").value = item.mascota;
    document.getElementById("fechaAtencion").value = item.fechaAtencion;
    document.getElementById("diagnosticoHC").value = item.diagnostico;
    document.getElementById("tratamientoHC").value = item.tratamiento;
    document.getElementById("selectVeterinarioHC").value = item.veterinario;

    const btnGuardar = document.getElementById("btnGuardarHC");
    const btnCancelar = document.getElementById("btnCancelarEdicionHC");
    const tituloForm = document.getElementById("tituloFormHC");

    if (btnGuardar) btnGuardar.textContent = "Actualizar Ficha";
    if (btnCancelar) btnCancelar.classList.remove("d-none");
    if (tituloForm) tituloForm.textContent = "Editando Ficha Médica";

    window.scrollTo({ top: 0, behavior: "smooth" });
};

// Cancelar edición
const btnCancelarEdicionHC = document.getElementById("btnCancelarEdicionHC");
if (btnCancelarEdicionHC) {
    btnCancelarEdicionHC.addEventListener("click", limpiarFormularioHC);
}

// Variable temporal para guardar la ficha que se quiere eliminar (cuando se abre la modal)
let idHCAEliminar = null;

// Paso 1 para eliminar: abrimos la modal de confirmación y guardamos el ID de la ficha
window.eliminarHC = (id) => {
    idHCAEliminar = id;
    const modalEliminarEl = document.getElementById("modalEliminarHC");
    const modalEliminar = new bootstrap.Modal(modalEliminarEl);
    modalEliminar.show();
};

// Paso 2 para eliminar: cuando el usuario confirma, borramos la ficha del LocalStorage
const btnConfirmarEliminarHC = document.getElementById("btnConfirmarEliminarHC");
if (btnConfirmarEliminarHC) {
    btnConfirmarEliminarHC.addEventListener("click", () => {
        if (!idHCAEliminar) return;

        let listaHC = obtenerHC();
        listaHC = listaHC.filter(h => h.idHC !== idHCAEliminar);
        guardarHCStorage(listaHC);
        mostrarHC();

        // Cerramos la modal de forma programática
        const modalEliminarEl = document.getElementById("modalEliminarHC");
        const modalInstance = bootstrap.Modal.getInstance(modalEliminarEl);
        if (modalInstance) modalInstance.hide();

        mostrarToastHC("Ficha médica eliminada correctamente.");

        if (idHCEditando === idHCAEliminar) {
            limpiarFormularioHC();
        }

        // Limpiamos la variable temporal
        idHCAEliminar = null;
    });
}

// Buscador en tiempo real
const buscadorHC = document.getElementById("buscadorHC");
if (buscadorHC) {
    buscadorHC.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const listaHC = obtenerHC();
        const filtrados = listaHC.filter(h => 
            h.mascota.toLowerCase().includes(query) || 
            h.diagnostico.toLowerCase().includes(query) ||
            h.veterinario.toLowerCase().includes(query)
        );
        mostrarHC(filtrados);
    });
}

// Inicializar al cargar
document.addEventListener("DOMContentLoaded", () => {
    cargarSelectsHC();
    mostrarHC();
});