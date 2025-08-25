import { eliminarTarea, toggleCompletada, obtenerEstadisticas, obtenerTareas } from "../local/dataTarea.js";

const listaTareas = document.querySelector('#tareas-tarjetas');

// Eliminamos la función actualizarContador de aquí ya que ahora está en index.js
// y se pasa como callback cuando sea necesario

export default function crearTarjeta(data) {
    const { text, prioridad, id, completada, fecha } = data;
    
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarea', prioridad);
    if (completada) tarjeta.classList.add('completada');

    // Contenido de la tarjeta
    tarjeta.innerHTML = `
        <div class="tarea-contenido">
            <div class="tarea-header">
                <span class="prioridad-badge">${prioridad.toUpperCase()}</span>
                <span class="fecha">${fecha}</span>
            </div>
            <p class="tarea-texto">${text}</p>
            <div class="tarea-acciones">
                <button class="btn-completar">${completada ? '↩️ Rehacer' : '✅ Completar'}</button>
                <button class="btn-eliminar">🗑️ Eliminar</button>
            </div>
        </div>
    `;

    // Event listeners
    const btnEliminar = tarjeta.querySelector('.btn-eliminar');
    const btnCompletar = tarjeta.querySelector('.btn-completar');

    btnEliminar.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            eliminarTarea(id);
            tarjeta.remove();
            // El contador se actualizará externamente
            if (typeof window.actualizarContador === 'function') {
                window.actualizarContador();
            }
        }
    });

    btnCompletar.addEventListener('click', function() {
        toggleCompletada(id);
        tarjeta.classList.toggle('completada');
        btnCompletar.textContent = tarjeta.classList.contains('completada') ? '↩️ Rehacer' : '✅ Completar';
        // El contador se actualizará externamente
        if (typeof window.actualizarContador === 'function') {
            window.actualizarContador();
        }
    });

    return tarjeta;
}

// Función para cargar todas las tareas
export function cargarTareas() {
    const tareas = obtenerTareas();
    listaTareas.innerHTML = '';
    
    tareas.forEach(tarea => {
        const tarjeta = crearTarjeta(tarea);
        listaTareas.appendChild(tarjeta);
    });
}

// Función para limpiar tareas completadas
export function limpiarCompletadas() {
    const tareas = obtenerTareas();
    const incompletas = tareas.filter(t => !t.completada);
    localStorage.setItem('tareasRapidas', JSON.stringify(incompletas));
    cargarTareas();
}