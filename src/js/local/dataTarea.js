// Se almacenan las tareas rapidas en localStorage
const TAREAS_RAPIDAS = 'tareasRapidas';

// Función para obtener tareas con verificación
export function obtenerTareas() {
    try {
        const tareas = JSON.parse(localStorage.getItem(TAREAS_RAPIDAS)) || [];
        return Array.isArray(tareas) ? tareas : [];
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        return [];
    }
}

// Función para guardar tareas
export function guardarTarea(tarea) {
    try {
        const idTarea = 'TR-' + Date.now();
        const nuevaTarea = {
            id: idTarea,
            fecha: new Date().toLocaleString(),
            completada: false,
            ...tarea
        };
        
        const tareas = obtenerTareas();
        tareas.push(nuevaTarea);
        localStorage.setItem(TAREAS_RAPIDAS, JSON.stringify(tareas));
        return nuevaTarea;
    } catch (error) {
        console.error('Error al guardar tarea:', error);
        throw error;
    }
}

// Función para eliminar tarea
export function eliminarTarea(id) {
    try {
        const tareas = obtenerTareas();
        const tareasFiltradas = tareas.filter(tarea => tarea.id !== id);
        localStorage.setItem(TAREAS_RAPIDAS, JSON.stringify(tareasFiltradas));
        return tareasFiltradas;
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        throw error;
    }
}

// Función para marcar tarea como completada
export function toggleCompletada(id) {
    try {
        const tareas = obtenerTareas();
        const tareasActualizadas = tareas.map(tarea => 
            tarea.id === id 
                ? { ...tarea, completada: !tarea.completada }
                : tarea
        );
        localStorage.setItem(TAREAS_RAPIDAS, JSON.stringify(tareasActualizadas));
        return tareasActualizadas;
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        throw error;
    }
}

// Función para obtener estadísticas
export function obtenerEstadisticas() {
    const tareas = obtenerTareas();
    return {
        total: tareas.length,
        completadas: tareas.filter(t => t.completada).length,
        pendientes: tareas.filter(t => !t.completada).length
    };
}