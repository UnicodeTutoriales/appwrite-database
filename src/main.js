import './style.css'
import { databases } from "../database";
import { ID, Query } from 'appwrite';

const DATABASE_ID = "unibooks";
const LIBROS_ID = "libros";
const AUTORES_ID = "autores";

const botonAñadir = document.querySelector("#añadir");
const dialogAñadir = document.querySelector("#añadirFormDialog");
const cancelarForm = document.querySelector("#cancelarForm");
const añadirLibro = document.querySelector("#añadirLibro");
const añadirForm = document.querySelector("#añadirForm");
const cardContainer = document.querySelector("#card-container");
const ordernarSelect = document.querySelector("#ordenarSelect");

let autores;

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
	const nombre = autorInput.value;
	const descripcion = descripcionInput.value;
	const imagen = imagenInput.value.length > 0 ? imagenInput.value : null;
	const calificacion = parseInt(calificacionInput.value);

	const autorEncontrado = autores.documents.filter(autor => autor.nombre.toLowerCase() === nombre.toLowerCase());
	let autor;

	if (autorEncontrado.length === 0) {
		const documentoAutor = {
			nombre
		}

		const id = ID.unique();

		const respuestaAutores = await databases.createDocument(
			DATABASE_ID,
			AUTORES_ID,
			id,
			documentoAutor
		);

		autor = id;
	} else {
		autor = autorEncontrado[0].$id;
	}

	const libro = {
		titulo,
		descripcion,
		imagen,
		calificacion,
		autor
	}

	const respuestaLibros = await databases.createDocument(
		DATABASE_ID,
		LIBROS_ID,
		ID.unique(),
		libro
	);

	añadirForm.reset();
});

async function obtenerLibros(nombre) {
	let respuesta;

	if (nombre) {
		const autorEncontrado = autores.documents.filter(autor => autor.nombre === nombre);

		respuesta = await databases.listDocuments(
			DATABASE_ID,
			LIBROS_ID,
			[
				Query.equal("autor", autorEncontrado[0].$id)
			]
		);	
	} else {
		respuesta = await databases.listDocuments(
			DATABASE_ID,
			LIBROS_ID,
		);	
	}

	cardContainer.innerHTML = "";

	for (let documento of respuesta.documents) {
		const estrellas = `<i class="fas fa-star"></i>`.repeat(documento.calificacion);
		const cardHTML = `<div class="card neu-container">
					<img
						class="imagen"
						src="${documento.imagen}"
						alt="Portada"
					/>
					<p class="titulo">${documento.titulo}</p>
					<p class="autor">${documento.autor.nombre}</p>
					<p class="descripcion">
						${documento.descripcion}
					</p>
					<div class="rating">` 
						+ estrellas + 
					`</div>
					<button id=borrar-${documento.$id} class="eliminar">Eliminar</button>
				</div>`;

		cardContainer.insertAdjacentHTML('afterbegin', cardHTML);

		const botonBorrar = document.querySelector(`#borrar-${documento.$id}`);

		botonBorrar.addEventListener("click", () => {
			databases.deleteDocument(
				DATABASE_ID,
				LIBROS_ID,
				documento.$id
			);
		});
	}
}

async function obtenerAutores() {
	autores = await databases.listDocuments(
		DATABASE_ID,
		AUTORES_ID
	);

	autores.documents.unshift({ nombre: "Reciente" });

	ordernarSelect.innerHTML = "";

	for (let autor of autores.documents) {
		const optionHTML = `<option value="" class="neu-container">${autor.nombre}</option>`;

		ordernarSelect.insertAdjacentHTML("beforeend", optionHTML);
	}
}

ordernarSelect.addEventListener("change", () => {
	const indice = ordernarSelect.selectedIndex;
	const autor = ordernarSelect.options[indice].text;

	if (autor === "Reciente") {
		obtenerLibros();
	} else {
		obtenerLibros(autor);
	}
});

obtenerLibros();
obtenerAutores();