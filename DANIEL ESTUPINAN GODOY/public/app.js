// public/app.js
const API_BASE = '/api/presupuestos';

const tablaBody = document.querySelector('#tablaPresupuestos tbody');
const abrirModalBtn = document.getElementById('abrirModalBtn');
const presupuestoModalEl = document.getElementById('presupuestoModal');
const presupuestoModal = new bootstrap.Modal(presupuestoModalEl);
const presupuestoForm = document.getElementById('presupuestoForm');
const modalTitle = document.getElementById('modalTitle');

const inputId = document.getElementById('presupuestoId');
const inputPropietario = document.getElementById('propietario');
const inputMarca = document.getElementById('marca');
const inputPresupuesto = document.getElementById('presupuesto');
const inputFecha = document.getElementById('fecha');

let editMode = false;

document.addEventListener('DOMContentLoaded', () => {
  cargarPresupuestos();
});

// abrir modal para nuevo
abrirModalBtn.addEventListener('click', () => {
  editMode = false;
  modalTitle.textContent = 'Solicitar presupuesto';
  presupuestoForm.reset();
  inputId.value = '';
  presupuestoModal.show();
});

// submit del formulario (POST o PUT)
presupuestoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    propietario: inputPropietario.value.trim(),
    marca: inputMarca.value,
    presupuesto: Number(inputPresupuesto.value),
    fecha: inputFecha.value
  };

  try {
    if (editMode && inputId.value) {
      // PUT
      const res = await fetch(`${API_BASE}/${inputId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw await res.json();
    } else {
      // POST
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw await res.json();
    }

    presupuestoModal.hide();
    presupuestoForm.reset();
    cargarPresupuestos();
  } catch (err) {
    console.error(err);
    alert('Ocurrió un error al guardar. Revisa la consola.');
  }
});

async function cargarPresupuestos() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw await res.json();
    const json = await res.json();
    const items = json.presupuestos || [];
    renderTabla(items);
  } catch (err) {
    console.error('Error al cargar presupuestos', err);
  }
}

function renderTabla(items) {
  tablaBody.innerHTML = '';
  if (!items.length) {
    tablaBody.innerHTML = `<tr><td colspan="5" class="text-center">No hay presupuestos aún</td></tr>`;
    return;
  }

  items.forEach(item => {
    const tr = document.createElement('tr');

    const fechaFormateada = new Date(item.fecha).toLocaleDateString();

    tr.innerHTML = `
      <td>${escapeHtml(item.propietario)}</td>
      <td>${escapeHtml(item.marca)}</td>
      <td>${item.presupuesto.toFixed(2)}</td>
      <td>${fechaFormateada}</td>
      <td>
        <button class="btn btn-sm btn-primary btn-edit" data-id="${item._id}">Editar</button>
        <button class="btn btn-sm btn-danger btn-delete" data-id="${item._id}">Eliminar</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });

  // listeners editar/eliminar
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw await res.json();
        const { presupuesto } = await res.json();
        editMode = true;
        modalTitle.textContent = 'Editar presupuesto';
        inputId.value = presupuesto._id;
        inputPropietario.value = presupuesto.propietario;
        inputMarca.value = presupuesto.marca;
        inputPresupuesto.value = presupuesto.presupuesto;
        // fecha -> format yyyy-mm-dd
        inputFecha.value = new Date(presupuesto.fecha).toISOString().slice(0,10);
        presupuestoModal.show();
      } catch (err) {
        console.error(err);
        alert('No se pudo cargar el presupuesto para edición.');
      }
    });
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.dataset.id;
      if (!confirm('¿Eliminar presupuesto? Esta acción no se puede deshacer.')) return;
      try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw await res.json();
        cargarPresupuestos();
      } catch (err) {
        console.error(err);
        alert('No se pudo eliminar el presupuesto.');
      }
    });
  });
}

// Simple escape para seguridad básica al insertar HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
