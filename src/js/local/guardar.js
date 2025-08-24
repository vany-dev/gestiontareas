const TAREAS_RAPIDAS = 'tareas_rapidas';
const TAREAS_COMPLETAS = 'tareas_completas';

export function guardarTarea(tarea) {
  let tareas = JSON.parse(localStorage.getItem(TAREAS_RAPIDAS)) || [];
  tareas.push(tarea);
  localStorage.setItem(TAREAS_RAPIDAS, JSON.stringify(tareas));
}
export function eliminarTarea(tarea) {
  let tareas = JSON.parse(localStorage.getItem(TAREAS_RAPIDAS)) || [];
  tareas = tareas.filter(t => t.texto !== tarea.texto);
  localStorage.setItem(TAREAS_RAPIDAS, JSON.stringify(tareas));
}