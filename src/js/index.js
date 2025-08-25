import { guardarTarea, obtenerEstadisticas, guardarLista, obtenerListas, eliminarLista } from "./local/dataTarea.js";
import crearTarjeta, { cargarTareas, limpiarCompletadas, setListaActual, getListaActual } from "./render/renderTarea.js";

// Elementos del DOM
const formularioTarea = document.querySelector('#formulario-tarea');
const formularioLista = document.querySelector('#formulario-lista');
const inputTarea = document.querySelector('#nueva-tarea');
const selectPrioridad = document.querySelector('#prioridad');
const listaActividades = document.querySelector('#lista-actividades');

let listaActual = 'TR';

// Actualizar contador
function actualizarContador() {
  const stats = obtenerEstadisticas(listaActual);
  const contador = document.querySelector('#contador');
  if (contador) {
    contador.textContent = `${stats.pendientes} pendientes de ${stats.total} tareas`;
  }
}
window.actualizarContador = actualizarContador;

// Cargar listas
function cargarListas() {
  const listas = obtenerListas();
  listaActividades.innerHTML = `
    <li><a href="#" class="categoria-activa" data-lista="TR">Tareas rápidas</a></li>
  `;

  listas.forEach(lista => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="#" data-lista="${lista.id}">
        ${lista.nombre}
        <button class="btn-eliminar-lista" data-lista="${lista.id}">🗑️</button>
      </a>
    `;
    listaActividades.appendChild(li);
  });

  // Eventos
  document.querySelectorAll('[data-lista]').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.classList.contains('btn-eliminar-lista')) {
        e.preventDefault();
        e.stopPropagation();
        const listaId = e.target.dataset.lista;
        eliminarListaConfirmacion(listaId);
        return;
      }
      if (item.tagName === 'A') {
        e.preventDefault();
        cambiarLista(item.dataset.lista, item);
      }
    });
  });
}

// Cambiar lista
function cambiarLista(listaId, elemento) {
  document.querySelectorAll('[data-lista]').forEach(i => i.classList.remove('categoria-activa'));
  elemento.classList.add('categoria-activa');
  listaActual = listaId;
  setListaActual(listaId);
  cargarTareas();
  actualizarContador();

  const tituloTareas = document.querySelector('.tareas h2');
  if (listaId === 'TR') {
    tituloTareas.textContent = 'Tareas rápidas';
  } else {
    const listas = obtenerListas();
    const lista = listas.find(l => l.id === listaId);
    tituloTareas.textContent = lista ? lista.nombre : 'Tareas';
  }
}

// Confirmar eliminación de lista
function eliminarListaConfirmacion(listaId) {
  if (listaId === 'TR') {
    alert('No puedes eliminar la lista de Tareas rápidas');
    return;
  }
  if (confirm('¿Eliminar esta lista y todas sus tareas?')) {
    eliminarLista(listaId);
    cargarListas();
    if (listaActual === listaId) {
      cambiarLista('TR', document.querySelector('[data-lista="TR"]'));
    }
  }
}

// Eventos DOM
document.addEventListener('DOMContentLoaded', () => {
  cargarListas();
  cargarTareas();
  actualizarContador();

  const botonLimpiar = document.createElement('button');
  botonLimpiar.textContent = '🧹 Limpiar Completadas';
  botonLimpiar.classList.add('btn-limpiar');
  botonLimpiar.addEventListener('click', () => {
    limpiarCompletadas();
    actualizarContador();
  });

  document.querySelector('.tareas h2').after(botonLimpiar);
});

// Crear listas
formularioLista.addEventListener('submit', e => {
  e.preventDefault();
  const inputLista = document.querySelector('#nueva-lista');
  const nombreLista = inputLista.value.trim();
  if (!nombreLista) return alert('Escribe un nombre para la lista');

  const nuevaLista = guardarLista(nombreLista);
  cargarListas();
  inputLista.value = '';
  const nuevaListaElement = document.querySelector(`[data-lista="${nuevaLista.id}"]`);
  if (nuevaListaElement) cambiarLista(nuevaLista.id, nuevaListaElement);
});

// Crear tareas
formularioTarea.addEventListener('submit', e => {
  e.preventDefault();
  const text = inputTarea.value.trim();
  const prioridad = selectPrioridad.value;

  if (!text) return alert('Escribe una tarea');
  if (!prioridad) return alert('Selecciona una prioridad');

  const nuevaTarea = guardarTarea({ text, prioridad }, listaActual);
  const tarjeta = crearTarjeta(nuevaTarea);
  document.querySelector('#tareas-tarjetas').appendChild(tarjeta);

  formularioTarea.reset();
  actualizarContador();
});
