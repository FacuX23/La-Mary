// Clave para guardar los datos en el LocalStorage
const CLAVE_STORAGE = "veterinarios";

// Variable para controlar si estamos creando un veterinario o editando uno existente
let idVeterinarioEditando = null;

// Para traer los elementos del DOM
const formulario = document.getElementById("formVeterinario");
const inputMatricula = document.getElementById("matricula");
const inputNombre = document.getElementById("nombre");
const inputEspecializacion = document.getElementById("especializacion");
const inputValorConsulta = document.getElementById("valorConsulta");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelarEdicion");
const tituloFormulario = document.getElementById("tituloFormulario");

// Función de recuperacion de los veterinarios desde LocalStorage
function obtenerVeterinarios() {
    const datos = localStorage.getItem(CLAVE_STORAGE);
    if (datos) {
        return JSON.parse(datos);
    }
    return [];
}

// Para guardar la lista en LocalStorage
function guardarVeterinarios(lista) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
}

// Para dar formato moneda al valor de consulta
function formatearMoneda(valor) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2
    }).format(valor);
}

// Función para renderizar la tabla de veterinarios
function mostrarVeterinarios(lista) {
    const tabla = document.getElementById("cuerpoTablaVeterinarios");
    const contador = document.getElementById("totalVeterinarios");
    const veterinarios = lista !== undefined ? lista : obtenerVeterinarios();
    if (contador) {
        contador.textContent = `Total: ${veterinarios.length}`;
    }
    if (!tabla) return;
    tabla.innerHTML = "";
    if (veterinarios.length === 0) {
        tabla.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No hay veterinarios registrados todavía.</td></tr>`;
        return;
    }
    veterinarios.forEach(function (vet) {
        tabla.innerHTML += `
            <tr>
                <td>${vet.matricula}</td>
                <td>${vet.nombre}</td>
                <td>${vet.especializacion}</td>
                <td>${formatearMoneda(vet.valorConsulta)}</td>
                <td class="text-center">
                    <button class="btn-edit btn-sm me-1" onclick="cargarParaEditar('${vet.idVeterinario}')">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#667451"><path d="M200-200h57l391-391-57-57-391 391v57Zm-40 80q-17 0-28.5-11.5T120-160v-97q0-16 6-30.5t17-25.5l505-504q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L313-143q-11 11-25.5 17t-30.5 6h-97Zm600-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                    Editar</button>
                    <button class="btn-delete btn-sm" onclick="eliminarVeterinario('${vet.idVeterinario}')">
                    <svg class="svg-danger" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#C62828"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM428.5-291.5Q440-303 440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280q17 0 28.5-11.5Zm160 0Q600-303 600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280q17 0 28.5-11.5ZM280-720v520-520Z"/></svg>
                    Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Para limpiar el formulario y volver al estado inicial
function limpiarFormulario() {
    idVeterinarioEditando = null;
    formulario.reset();
    if (tituloFormulario) {
        tituloFormulario.textContent = "Registrar Nuevo Veterinario";
    }
    if (btnGuardar) {
        btnGuardar.textContent = "Guardar Veterinario";
    }
    if (btnCancelar) {
        btnCancelar.classList.add("d-none");
    }
}

// Para dar de el alta o modificar
// Muestra el aviso flotante (Toast) cuando registramos un nuevo veterinario
const mostrarToastExito = () => {
    const toastElement = document.getElementById("toastVeterinario") || document.getElementById("toastMascota");
    if (toastElement) {
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    }
};

if (formulario) {
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const matricula = parseInt(inputMatricula.value);
        const nombre = inputNombre.value.trim();
        const especializacion = inputEspecializacion.value.trim();
        const valorConsulta = parseFloat(inputValorConsulta.value);
        if (isNaN(matricula) || nombre === "" || especializacion === "" || isNaN(valorConsulta)) {
            alert("Por favor complete todos los campos con datos válidos.");
            return;
        }
        const listaVeterinarios = obtenerVeterinarios();
        if (idVeterinarioEditando === null) {
            const nuevoVeterinario = {
                idVeterinario: crypto.randomUUID ? crypto.randomUUID() : "vet_" + Date.now(),
                matricula: matricula,
                nombre: nombre,
                especializacion: especializacion,
                valorConsulta: valorConsulta
            };
            listaVeterinarios.push(nuevoVeterinario);
            mostrarToastExito();
        } else {
            const indice = listaVeterinarios.findIndex(function (v) {
                return v.idVeterinario === idVeterinarioEditando;
            });
            if (indice !== -1) {
                listaVeterinarios[indice].matricula = matricula;
                listaVeterinarios[indice].nombre = nombre;
                listaVeterinarios[indice].especializacion = especializacion;
                listaVeterinarios[indice].valorConsulta = valorConsulta;
            }
        }
        guardarVeterinarios(listaVeterinarios);
        mostrarVeterinarios();
        limpiarFormulario();
    });
}

// Función para cargar los datos en el formulario
window.cargarParaEditar = function (id) {
    const listaVeterinarios = obtenerVeterinarios();
    const vet = listaVeterinarios.find(function (v) {
        return v.idVeterinario === id;
    });
    if (!vet) return;
    idVeterinarioEditando = id;
    inputMatricula.value = vet.matricula;
    inputNombre.value = vet.nombre;
    inputEspecializacion.value = vet.especializacion;
    inputValorConsulta.value = vet.valorConsulta;

    if (tituloFormulario) {
        tituloFormulario.textContent = `Editando a: ${vet.nombre}`;
    }
    if (btnGuardar) {
        btnGuardar.textContent = "Actualizar Cambios";
    }
    if (btnCancelar) {
        btnCancelar.classList.remove("d-none");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
};

// Cancelar edición
if (btnCancelar) {
    btnCancelar.addEventListener("click", limpiarFormulario);
}

// Variable temporal para el ID que se quiere eliminar
let idVeterinarioAEliminar = null;

// Paso 1 para eliminar: Abrir modal de confirmación
window.eliminarVeterinario = function (id) {
    idVeterinarioAEliminar = id;
    const modalEliminarEl = document.getElementById("modalEliminar");
    if (modalEliminarEl) {
        const modalEliminar = new bootstrap.Modal(modalEliminarEl);
        modalEliminar.show();
    } else {
        if (confirm("¿Está seguro de que desea eliminar a este veterinario?")) {
            let listaVeterinarios = obtenerVeterinarios().filter(function (v) {
                return v.idVeterinario !== id;
            });
            guardarVeterinarios(listaVeterinarios);
            mostrarVeterinarios();
        }
    }
};

// Paso 2 para eliminar: Cuando confirma desde la modal
const btnConfirmar = document.getElementById("btnConfirmarEliminar");
if (btnConfirmar) {
    btnConfirmar.addEventListener("click", function () {
        if (idVeterinarioAEliminar) {
            let listaVeterinarios = obtenerVeterinarios();
            listaVeterinarios = listaVeterinarios.filter(function (v) {
                return v.idVeterinario !== idVeterinarioAEliminar;
            });

            guardarVeterinarios(listaVeterinarios);
            mostrarVeterinarios();

            if (idVeterinarioEditando === idVeterinarioAEliminar) {
                limpiarFormulario();
            }

            const modalEliminarEl = document.getElementById("modalEliminar");
            if (modalEliminarEl) {
                const modalInstance = bootstrap.Modal.getInstance(modalEliminarEl);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }

            idVeterinarioAEliminar = null;
        }
    });
}

const inputBuscador = document.getElementById("buscadorVeterinarios");
if (inputBuscador) {
    inputBuscador.addEventListener("input", function (e) {
        const query = e.target.value.toLowerCase().trim();
        const lista = obtenerVeterinarios().filter(function (vet) {
            return (
                vet.nombre.toLowerCase().includes(query) ||
                vet.especializacion.toLowerCase().includes(query) ||
                vet.matricula.toString().includes(query)
            );
        });
        mostrarVeterinarios(lista);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    mostrarVeterinarios();
});