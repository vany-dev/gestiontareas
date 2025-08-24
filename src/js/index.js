import { guardarTarea } from "./local/guardar.js";

const inputTarea = document.querySelector('#nueva-tarea');
const selectPrioridad = document.querySelector('#prioridad');
const btnAgregar = document.querySelector('#btn-agregar');
const listaTareas = document.querySelector('#tareas-tarjetas');

btnAgregar.addEventListener('click', function(event) {
  event.preventDefault();

  const tarea = inputTarea.value.trim();
  const prioridad = selectPrioridad.value;

  if (tarea === '') {
    alert('Por favor, ingresa una tarea.');
    return;
  }
  if (prioridad === selectPrioridad.options[0].value) {
    alert('Por favor, selecciona una prioridad.');
    return;
  }

  guardarTarea({ texto: tarea, prioridad: prioridad });

  const tarjeta = document.createElement('div');
  tarjeta.classList.add('tarea', prioridad);

  const textoTarea = document.createElement('p');
  textoTarea.textContent = tarea;

  const btnEliminar = document.createElement('button');
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.addEventListener('click', function() {
    console.log('Eliminar tarea:', tarea);
    listaTareas.removeChild(tarjeta);
  });

  tarjeta.appendChild(textoTarea);
  tarjeta.appendChild(btnEliminar);
  listaTareas.appendChild(tarjeta);

  inputTarea.value = '';
  selectPrioridad.value = 'media';
});