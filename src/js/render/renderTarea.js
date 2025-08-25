import { eliminarTarea, toggleCompletada, obtenerTareas } from "../local/dataTarea.js";

let listaActual = 'TR';

export function setListaActual(listaId) {
  listaActual = listaId;
}

export function getListaActual() {
  return listaActual;
}

export default function crearTarjeta(data) {
  const { text, prioridad, id, completada, fecha, listaId } = data;

  const tarjeta = document.createElement('div');
  tarjeta.classList.add('tarea', prioridad);
  if (completada) tarjeta.classList.add('completada');

  tarjeta.innerHTML = `
    <div class="tarea-contenido">
      <div class="tarea-header">
        <span class="prioridad-badge">${prioridad.toUpperCase()}</span>
        <span class="fecha">${fecha}</span>
        ${listaId && listaId !== 'TR' ? `<span class="lista-badge">${listaId.split('-')[0]}</span>` : ''}
      </div>
      <p class="tarea-texto">${text}</p>
      <div class="tarea-acciones">
        <button class="btn-completar">${completada ? '↩️ Rehacer' : '✅ Completar'}</button>
        <button class="btn-eliminar">🗑️ Eliminar</button>
      </div>
    </div>
  `;

  const btnEliminar = tarjeta.querySelector('.btn-eliminar');
  const btnCompletar = tarjeta.querySelector('.btn-completar');

  btnEliminar.addEventListener('click', () => {
    if (confirm('¿Eliminar esta tarea?')) {
      eliminarTarea(id, listaActual);
      tarjeta.remove();
      window.actualizarContador?.();
    }
  });

  btnCompletar.addEventListener('click', () => {
    toggleCompletada(id, listaActual);
    tarjeta.classList.toggle('completada');
    btnCompletar.textContent = tarjeta.classList.contains('completada')
      ? '↩️ Rehacer'
      : '✅ Completar';
    window.actualizarContador?.();
  });

  return tarjeta;
}

export function cargarTareas() {
  const listaTareasElement = document.querySelector('#tareas-tarjetas');
  const tareas = obtenerTareas(listaActual);
  listaTareasElement.innerHTML = '';

  if (tareas.length === 0) {
    listaTareasElement.innerHTML = `
      <div class="tarea-vacia">
        <p>No hay tareas en esta lista</p>
        <small>¡Agrega tu primera tarea usando el formulario arriba!</small>
      </div>
    `;
    return;
  }

  tareas.forEach(tarea => {
    const tarjeta = crearTarjeta(tarea);
    listaTareasElement.appendChild(tarjeta);
  });
}

export function limpiarCompletadas() {
  const tareas = obtenerTareas(listaActual);
  const incompletas = tareas.filter(t => !t.completada);
  localStorage.setItem('tareas_' + listaActual, JSON.stringify(incompletas));
  cargarTareas();
}
