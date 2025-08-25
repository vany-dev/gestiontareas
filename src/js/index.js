import { guardarTarea, obtenerEstadisticas } from "./local/dataTarea.js";
import crearTarjeta, { cargarTareas, limpiarCompletadas } from "./render/renderTarea.js";

// Elementos del DOM
const formulario = document.querySelector('#formulario-tarea');
const inputTarea = document.querySelector('#nueva-tarea');
const selectPrioridad = document.querySelector('#prioridad');
const listaTareas = document.querySelector('#tareas-tarjetas');

// Función para actualizar el contador (ahora está en index.js)
function actualizarContador() {
    const stats = obtenerEstadisticas();
    const contador = document.querySelector('#contador');
    if (contador) {
        contador.textContent = `${stats.pendientes} pendientes de ${stats.total} tareas`;
    }
}

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarTareas();
    actualizarContador();
    
    // Agregar botón de limpiar completadas
    const botonLimpiar = document.createElement('button');
    botonLimpiar.textContent = '🧹 Limpiar Completadas';
    botonLimpiar.classList.add('btn-limpiar');
    botonLimpiar.addEventListener('click', function() {
        limpiarCompletadas();
        actualizarContador();
    });
    
    const contenedorTareas = document.querySelector('.tareas');
    const tituloTareas = contenedorTareas.querySelector('h2');
    tituloTareas.after(botonLimpiar);
});

// Manejar envío del formulario
formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    const text = inputTarea.value.trim();
    const prioridad = selectPrioridad.value;

    // Validaciones
    if (text === '') {
        alert('Por favor, ingresa una tarea.');
        inputTarea.focus();
        return;
    }
    
    if (prioridad === '') {
        alert('Por favor, selecciona una prioridad.');
        selectPrioridad.focus();
        return;
    }

    try {
        // Crear y guardar tarea
        const nuevaTarea = {
            text: text,
            prioridad: prioridad
        };
        
        const tareaGuardada = guardarTarea(nuevaTarea);
        const tarjeta = crearTarjeta(tareaGuardada);
        listaTareas.appendChild(tarjeta);

        // Resetear formulario
        formulario.reset();
        selectPrioridad.value = '';
        inputTarea.focus();

        // Actualizar contador
        actualizarContador();

    } catch (error) {
        console.error('Error al guardar tarea:', error);
        alert('Error al guardar la tarea. Intenta nuevamente.');
    }
});

// export function filtrarPorPrioridad(prioridad) {
//     const tareas = obtenerTareas();
//     const tareasFiltradas = prioridad === 'todas' 
//         ? tareas 
//         : tareas.filter(t => t.prioridad === prioridad);
    
//     listaTareas.innerHTML = '';
//     tareasFiltradas.forEach(tarea => {
//         const tarjeta = crearTarjeta(tarea);
//         listaTareas.appendChild(tarjeta);
//     });
//     actualizarContador();
// }