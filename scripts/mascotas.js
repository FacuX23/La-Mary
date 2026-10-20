// 1. Definimos la clave con la que vamos a guardar las mascotas en la memoria del navegador
const CLAVE_MASCOTAS = "mascotas_la_mary";

// 2. Función para obtener las mascotas del LocalStorage (si no hay nada, devuelve una lista vacía [])
const obtenerMascotas = () => {
    return JSON.parse(localStorage.getItem(CLAVE_MASCOTAS)) || [];
};

// 3. Función para guardar la lista actualizada en el LocalStorage
const guardarMascotasEnStorage = (mascotas) => {
    localStorage.setItem(CLAVE_MASCOTAS, JSON.stringify(mascotas));
};

// 4. Función para dibujar/mostrar las mascotas en la tabla de la página
const mostrarMascotas = () => {
    const tbody = document.getElementById("cuerpoTablaMascotas");
    const badgeTotal = document.getElementById("totalMascotas");

    tbody.innerHTML = ""; // Limpiamos la tabla para que no se dupliquen las filas
    const mascotas = obtenerMascotas();

    // Actualizamos el contador del badge superior
    badgeTotal.textContent = `Total: ${mascotas.length}`;

    if (mascotas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay mascotas registradas todavía.</td></tr>`;
        return;
    }

    // Recorremos cada mascota y armamos su fila en la tabla
    mascotas.forEach((mascota) => {
        tbody.innerHTML += `
            <tr>
                <td>${mascota.nombreMascota}</td>
                <td>${mascota.nombreDuenio}</td>
                <td>${mascota.color}</td>
                <td>${mascota.edad} años</td>
                <td>${mascota.peso} kg</td>
                <td class="text-center">
                    <button class="btn-edit btn-sm me-1" onclick="prepararEdicion('${mascota.idMascota}')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#667451"><path d="M200-200h57l391-391-57-57-391 391v57Zm-40 80q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm600-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    Editar</button>
                    <button class="btn-delete btn-sm" onclick="eliminarMascota('${mascota.idMascota}')">
                    <svg class="svg-danger" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#C62828"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM428.5-291.5Q440-303 440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280q17 0 28.5-11.5Zm160 0Q600-303 600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280q17 0 28.5-11.5ZM280-720v520-520Z"/></svg>
                    Eliminar</button>
                </td>
            </tr>
        `;
    });
};

// Ejecutamos la función de mostrar apenas se cargue la página
document.addEventListener("DOMContentLoaded", mostrarMascotas);

// 5. Capturamos el formulario para cuando el usuario presione "Guardar"
const formMascota = document.getElementById("formMascota");

formMascota.addEventListener("submit", (e) => {
    e.preventDefault(); // Evitamos que la página se recargue sola

    // Tomamos los valores de los inputs del formulario
    const idMascota = document.getElementById("idMascota").value;
    const nombreMascota = document.getElementById("nombreMascota").value.trim();
    const nombreDuenio = document.getElementById("nombreDuenio").value.trim();
    const color = document.getElementById("color").value.trim();
    const edad = parseInt(document.getElementById("edad").value);
    const peso = parseFloat(document.getElementById("peso").value);

    const mascotas = obtenerMascotas();

    if (idMascota === "") {
        // --- CASO NUEVA MASCOTA (ALTA) ---
        // Generamos un ID único usando la fecha actual en milisegundos
        const nuevaMascota = {
            idMascota: "mascota_" + Date.now(),
            nombreMascota,
            nombreDuenio,
            color,
            edad,
            peso
        };

        // Agregamos la nueva mascota a la lista
        mascotas.push(nuevaMascota);
    } else {
        // --- CASO EDITAR MASCOTA EXISTENTE ---
        const index = mascotas.findIndex(m => m.idMascota === idMascota);
        if (index !== -1) {
            mascotas[index].nombreMascota = nombreMascota;
            mascotas[index].nombreDuenio = nombreDuenio;
            mascotas[index].color = color;
            mascotas[index].edad = edad;
            mascotas[index].peso = peso;
        }
    }

    // Guardamos en el LocalStorage
    guardarMascotasEnStorage(mascotas);

    // Actualizamos la tabla en pantalla
    mostrarMascotas();

    // Limpiamos el formulario
    formMascota.reset();
    document.getElementById("idMascota").value = "";
    document.getElementById("tituloFormulario").textContent = "Registrar Nueva Mascota";
    document.getElementById("btnGuardar").textContent = "Guardar Mascota";
    document.getElementById("btnCancelarEdicion").classList.add("d-none");
});

// 6. Función para preparar la edición de una mascota
window.prepararEdicion = (id) => {
    const mascotas = obtenerMascotas();
    const mascotaAEditar = mascotas.find(m => m.idMascota === id);

    if (mascotaAEditar) {
        document.getElementById("idMascota").value = mascotaAEditar.idMascota;
        document.getElementById("nombreMascota").value = mascotaAEditar.nombreMascota;
        document.getElementById("nombreDuenio").value = mascotaAEditar.nombreDuenio;
        document.getElementById("color").value = mascotaAEditar.color;
        document.getElementById("edad").value = mascotaAEditar.edad;
        document.getElementById("peso").value = mascotaAEditar.peso;

        // Cambiamos textos visuales para que se note que estamos editando
        document.getElementById("tituloFormulario").textContent = `Editando a: ${mascotaAEditar.nombreMascota}`;
        document.getElementById("btnGuardar").textContent = "Actualizar Mascota";
        document.getElementById("btnCancelarEdicion").classList.remove("d-none");

        // Subimos la vista hacia el formulario para mayor comodidad
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// 7. Función para cancelar la edición
window.cancelarEdicion = () => {
    formMascota.reset();
    document.getElementById("idMascota").value = "";
    document.getElementById("tituloFormulario").textContent = "Registrar Nueva Mascota";
    document.getElementById("btnGuardar").textContent = "Guardar Mascota";
    document.getElementById("btnCancelarEdicion").classList.add("d-none");
};

// 8. Función para eliminar una mascota
window.eliminarMascota = (id) => {
    if (confirm("¿Estás segura de que querés eliminar esta mascota de los registros?")) {
        let mascotas = obtenerMascotas();
        // Filtramos la lista sacando la mascota que coincide con el ID
        mascotas = mascotas.filter(m => m.idMascota !== id);

        guardarMascotasEnStorage(mascotas);
        mostrarMascotas();
    }
};