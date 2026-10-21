// clave para almacenar y leer las mascotas en el navegador (LocalStorage)
const CLAVE_MASCOTAS = "mascotas_la_mary";

// variable temporal para guardar el ID de la mascota que se quiere eliminar (cuando se abre la modal)
let idMascotaAEliminar = null;

//función para obtener las mascotas del LocalStorage (si no hay nada, devuelve una lista vacía [])
const obtenerMascotas = () => {
    return JSON.parse(localStorage.getItem(CLAVE_MASCOTAS)) || [];
};

//función para guardar la lista actualizada en el LocalStorage
const guardarMascotasEnStorage = (mascotas) => {
    localStorage.setItem(CLAVE_MASCOTAS, JSON.stringify(mascotas));
};

// muestra el aviso flotante (Toast) cuando registramos una nueva mascota. Solo se dispara cuando se crea una nueva, no cuando se edita.
const mostrarToastExito = () => {
    const toastElement = document.getElementById("toastMascota");
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
};

//función para dibujar/mostrar las mascotas en la tabla de la página
const mostrarMascotas = () => {
    const tbody = document.getElementById("cuerpoTablaMascotas");
    const badgeTotal = document.getElementById("totalMascotas");
    
    tbody.innerHTML = ""; // Limpiamos la tabla para que no se dupliquen las filas
    const mascotas = obtenerMascotas();

    //actualizamos el contador del badge superior
    badgeTotal.textContent = `Total: ${mascotas.length}`;

    if (mascotas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay mascotas registradas todavía.</td></tr>`;
        return;
    }

    //recorremos cada mascota y armamos su fila en la tabla
    mascotas.forEach((mascota) => {
        tbody.innerHTML += `
            <tr>
                <td>${mascota.nombreMascota}</td>
                <td>${mascota.nombreDuenio}</td>
                <td>${mascota.color}</td>
                <td>${mascota.edad} años</td>
                <td>${mascota.peso} kg</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm me-1" onclick="prepararEdicion('${mascota.idMascota}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarMascota('${mascota.idMascota}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
};

//ejecutamos la función de mostrar apenas se cargue la página
document.addEventListener("DOMContentLoaded", mostrarMascotas);

//capturamos el formulario para cuando el usuario presione "Guardar"
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
        const nuevaMascota = {
            idMascota: "mascota_" + Date.now(),
            nombreMascota,
            nombreDuenio,
            color,
            edad,
            peso
        };

        mascotas.push(nuevaMascota);

        mostrarToastExito();
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

    //guardamos en el LocalStorage
    guardarMascotasEnStorage(mascotas);

    //actualizamos la tabla en pantalla
    mostrarMascotas();

    //limpiamos el formulario
    formMascota.reset();
    document.getElementById("idMascota").value = "";
    document.getElementById("tituloFormulario").textContent = "Registrar Nueva Mascota";
    document.getElementById("btnGuardar").textContent = "Guardar Mascota";
    document.getElementById("btnCancelarEdicion").classList.add("d-none");
});

//función para preparar la edición de una mascota
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

        //cambiamos textos visuales para que se note que estamos editando
        document.getElementById("tituloFormulario").textContent = `Editando a: ${mascotaAEditar.nombreMascota}`;
        document.getElementById("btnGuardar").textContent = "Actualizar Mascota";
        document.getElementById("btnCancelarEdicion").classList.remove("d-none");
        
        //subimos la vista hacia el formulario para mayor comodidad
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

//función para cancelar la edición
window.cancelarEdicion = () => {
    formMascota.reset();
    document.getElementById("idMascota").value = "";
    document.getElementById("tituloFormulario").textContent = "Registrar Nueva Mascota";
    document.getElementById("btnGuardar").textContent = "Guardar Mascota";
    document.getElementById("btnCancelarEdicion").classList.add("d-none");
};

//paso 1 para eliminar: Abrimos la modal de confirmación y guardamos el ID de la mascota que se quiere eliminar
window.eliminarMascota = (id) => {
    idMascotaAEliminar = id; // Guardamos el ID que quiere borrar
    const modalEliminarEl = document.getElementById("modalEliminar");
    const modalEliminar = new bootstrap.Modal(modalEliminarEl);
    modalEliminar.show();
};

//paso 2 para eliminar: Cuando el usuario confirma la eliminación, borramos la mascota del LocalStorage y actualizamos la tabla
document.getElementById("btnConfirmarEliminar").addEventListener("click", () => {
    if (idMascotaAEliminar) {
        let mascotas = obtenerMascotas();
        // filtramos la lista sacando la mascota que coincide con el ID guardado
        mascotas = mascotas.filter(m => m.idMascota !== idMascotaAEliminar);
        
        guardarMascotasEnStorage(mascotas);
        mostrarMascotas();

        // cerramos la modal de forma programática
        const modalEliminarEl = document.getElementById("modalEliminar");
        const modalInstance = bootstrap.Modal.getInstance(modalEliminarEl);
        modalInstance.hide();

        // limpiamos la variable temporal
        idMascotaAEliminar = null;
    }
});