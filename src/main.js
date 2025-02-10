import './style.css'
import { databases } from "../database";
import { ID } from 'appwrite';

const DATABASE_ID = "unibooks";
const COLLECTION_ID = "libros";

const botonAñadir = document.querySelector("#añadir");
const dialogAñadir = document.querySelector("#añadirFormDialog");
const cancelarForm = document.querySelector("#cancelarForm");
const añadirLibro = document.querySelector("#añadirLibro");
const añadirForm = document.querySelector("#añadirForm");

botonAñadir.addEventListener("click", () => {
	dialogAñadir.showModal();
});

cancelarForm.addEventListener("click", () => {
	dialogAñadir.close();
});

añadirLibro.addEventListener("click", async (evento) => {
	evento.preventDefault();

	const tituloInput = document.querySelector("#tituloInput");
	const autorInput = document.querySelector("#autorInput");
	const descripcionInput = document.querySelector("#descripcionInput");
	const imagenInput = document.querySelector("#imgInput");
	const calificacionInput = document.querySelector("#calificacionInput");

	const titulo = tituloInput.value;
	const autor = autorInput.value;
	const descripcion = descripcionInput.value;
	const imagen = imagenInput.value.length > 0 ? imagenInput.value : null;
	const calificacion = parseInt(calificacionInput.value);

	const libro = {
		titulo,
		autor,
		descripcion,
		imagen,
		calificacion
	}

	const respuestaLibros = await databases.createDocument(
		DATABASE_ID,
		COLLECTION_ID,
		ID.unique(),
		libro
	);

	añadirForm.reset();
});