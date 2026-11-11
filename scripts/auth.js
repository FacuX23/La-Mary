const PAGINAS_ADMIN = ["mascotas", "veterinarios", "turnos", "historia"];
const PAGINA_DESPUES_DEL_LOGIN = "panel.html";
const PAGINA_LOGIN = "login.html";

const haySesion = () => {
    return sessionStorage.getItem("token") !== null;
}

const estiloSesion = document.createElement("style");
estiloSesion.textContent = `html:not(.con-sesion) .solo-admin { display: none !important; } html.con-sesion .solo-visitante { display: none !important; }`;

document.head.appendChild(estiloSesion);

if (haySesion()) {
    document.documentElement.classList.add("con-sesion")
}

const direccionActual = window.location.pathname;
const esPaginaAdmin = PAGINAS_ADMIN.some((nombre) => direccionActual.includes(nombre));

if (esPaginaAdmin && !haySesion()) {
    window.location.replace(PAGINA_LOGIN);
}

const inciarSesion = async (evento) => {
    evento.preventDefault();


const usuario = document.getElementById("nombreUsuario").value.trim();
const constrasena = document.getElementById("contrasena").value;
const mensajeError = document.getElementById("login-error");

mensajeError.textContent = ""; 

try {
    const respuesta = await fetch('https://dummyjson.com/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usuario, password: constrasena })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        mensajeError.textContent = "Usuario o contraseña incorrectos.";
        return;
    }

    sessionStorage.setItem("token", datos.accessToken)
    window.location.href = PAGINA_DESPUES_DEL_LOGIN;

} catch (error) {
    mensajeError.textContent = "No se pudo conectar con el servidor. Intente más tarde.";
}}

const cerrarSesion = () => {
    sessionStorage.removeItem("token");
    window.location.href = "index.html"
}

document.addEventListener("DOMContentLoaded", () => {

    const botonSalir = document.getElementById("btn-cerrar-sesion");
    if (botonSalir) {
        botonSalir.addEventListener("click" , (evento) => {
            evento.preventDefault();
            cerrarSesion();
        });
    }

    const formularioLogin = document.getElementById("login-form");
    if (formularioLogin) {
        formularioLogin.addEventListener("submit", inciarSesion);
    }
});