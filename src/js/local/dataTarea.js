// --- GESTIÓN DE LISTAS ---
const LISTAS_KEY = 'listas';

// Obtener todas las listas
export function obtenerListas() {
  try {
    return JSON.parse(localStorage.getItem(LISTAS_KEY)) || [];
  } catch {
    return [];
  }
}

// Guardar nueva lista
export function guardarLista(nombre) {
  const listas = obtenerListas();
  const nuevaLista = {
    id: 'L-' + Date.now(),
    nombre
  };
  listas.push(nuevaLista);
  localStorage.setItem(LISTAS_KEY, JSON.stringify(listas));
  return nuevaLista;
}

// Eliminar lista y sus tareas
export function eliminarLista(id) {
  const listas = obtenerListas().filter(l => l.id !== id);
  localStorage.setItem(LISTAS_KEY, JSON.stringify(listas));
  localStorage.removeItem('tareas_' + id);
}

// --- GESTIÓN DE TAREAS ---
export function obtenerTareas(listaId = 'TR') {
  try {
    return JSON.parse(localStorage.getItem('tareas_' + listaId)) || [];
  } catch {
    return [];
  }
}

export function guardarTarea(tarea, listaId = 'TR') {
  const idTarea = listaId + '-' + Date.now();
  const nuevaTarea = {
    id: idTarea,
    fecha: new Date().toLocaleString(),
    completada: false,
    listaId,
    ...tarea
  };

  const tareas = obtenerTareas(listaId);
  tareas.push(nuevaTarea);
  localStorage.setItem('tareas_' + listaId, JSON.stringify(tareas));
  return nuevaTarea;
}

export function eliminarTarea(id, listaId = 'TR') {
  const tareas = obtenerTareas(listaId);
  const filtradas = tareas.filter(t => t.id !== id);
  localStorage.setItem('tareas_' + listaId, JSON.stringify(filtradas));
  return filtradas;
}

export function toggleCompletada(id, listaId = 'TR') {
  const tareas = obtenerTareas(listaId);
  const actualizadas = tareas.map(t =>
    t.id === id ? { ...t, completada: !t.completada } : t
  );
  localStorage.setItem('tareas_' + listaId, JSON.stringify(actualizadas));
  return actualizadas;
}

export function obtenerEstadisticas(listaId = 'TR') {
  const tareas = obtenerTareas(listaId);
  return {
    total: tareas.length,
    completadas: tareas.filter(t => t.completada).length,
    pendientes: tareas.filter(t => !t.completada).length
  };
}
