const API_CERDAS = "https://granja-la-cruz-backend.onrender.com/cerdas-farm/cerda/";
const tablaCerdas = document.getElementById("tablaCerdas");
const btnBuscar = document.getElementById("btnBuscar");
const btnReset = document.getElementById("btnReset");
const buscarId = document.getElementById("buscarId");

// Form agregar cerda
const formAgregar = document.getElementById("formAgregar");
const codigoInput = document.getElementById("codigo");
const fechaNacimientoInput = document.getElementById("fechaNacimiento");
const estadoInput = document.getElementById("estado");

// Mostrar cerdas
function mostrarCerdas(cerdas) {
    tablaCerdas.innerHTML = "";
    cerdas.forEach(cerda => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cerda.id}</td>
            <td>${cerda.codigo}</td>
            <td>${cerda.estado}</td>
            <td>${cerda.fecha_nacimiento}</td>
            <td>
                <a href="cerda.html?id=${cerda.id}" class="btn btn-sm btn-success me-1">Ver</a>
                <button class="btn btn-sm btn-warning me-1" onclick="editarCerda(${cerda.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarCerda(${cerda.id})">Eliminar</button>
            </td>
        `;
        tablaCerdas.appendChild(row);
    });
}

// Cargar todas las cerdas
async function cargarCerdas() {
    const res = await fetch(API_CERDAS);
    const data = await res.json();
    mostrarCerdas(data);
}

// Buscar por ID
btnBuscar.addEventListener("click", async () => {
    const id = buscarId.value;
    if (!id) return cargarCerdas();

    try {
        const res = await fetch(`${API_CERDAS}${id}/`);
        if (!res.ok) throw new Error("Cerda no encontrada");
        const data = await res.json();
        mostrarCerdas([data]);
    } catch (error) {
        alert(error.message);
    }
});

btnReset.addEventListener("click", cargarCerdas);

// Agregar nueva cerda
formAgregar.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        codigo: codigoInput.value,
        fecha_nacimiento: fechaNacimientoInput.value,
        estado: estadoInput.value
    };

    const res = await fetch(API_CERDAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Cerda agregada");
        formAgregar.reset();
        cargarCerdas();
    } else {
        alert("Error al agregar cerda");
    }
});

// Editar cerda
window.editarCerda = async (id) => {
    try {
        const res = await fetch(`${API_CERDAS}${id}/`);
        const cerda = await res.json();

        const nuevoCodigo = prompt("Código", cerda.codigo);
        const nuevaFecha = prompt("Fecha de nacimiento (YYYY-MM-DD)", cerda.fecha_nacimiento);
        const nuevoEstado = prompt("Estado (vacia, preñada, lactante, servida)", cerda.estado);

        if (!nuevoCodigo || !nuevaFecha || !nuevoEstado) return;

        const resUpdate = await fetch(`${API_CERDAS}${id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                codigo: nuevoCodigo,
                fecha_nacimiento: nuevaFecha,
                estado: nuevoEstado
            })
        });

        if (resUpdate.ok) {
            alert("Cerda actualizada");
            cargarCerdas();
        } else {
            alert("Error al actualizar cerda");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
};

// Eliminar cerda
window.eliminarCerda = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar esta cerda?")) return;

    try {
        const res = await fetch(`${API_CERDAS}${id}/`, { method: "DELETE" });
        if (res.ok) {
            alert("Cerda eliminada");
            cargarCerdas();
        } else {
            alert("Error al eliminar cerda");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
};

cargarCerdas();
