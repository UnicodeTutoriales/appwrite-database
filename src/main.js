import './style.css'

const botonAñadir = document.querySelector("#añadir");
const dialogAñadir = document.querySelector("#añadirFormDialog");
const cancelarForm = document.querySelector("#cancelarForm");

botonAñadir.addEventListener("click", () => {
	dialogAñadir.showModal();
});

cancelarForm.addEventListener("click", () => {
	dialogAñadir.close();
});