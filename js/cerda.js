const urlParams = new URLSearchParams(window.location.search);
const cerdaId = urlParams.get("id");

const API_CERDA = `https://granja-la-cruz-backend.onrender.com/cerdas-farm/cerda/${cerdaId}/`;
const API_CELO = `https://granja-la-cruz-backend.onrender.com/cerdas-farm/control-celo/`;

const codigoCerda = document.getElementById("codigoCerda");
const estadoCerda = document.getElementById("estadoCerda");
const fechaNac = document.getElementById("fechaNac");
const tablaControles = document.getElementById("tablaControles");
const formControl = document.getElementById("formControl");

// Cargar cerda y sus controles
async function cargarCerda() {
    const res = await fetch(API_CERDA);
    const cerda = await res.json();

    codigoCerda.textContent = cerda.codigo;
    estadoCerda.textContent = cerda.estado;
    fechaNac.textContent = cerda.fecha_nacimiento;

    mostrarControles(cerda.controles_celo || []);
}

// Mostrar controles de celo en la tabla con botones Editar/Eliminar
function mostrarControles(controles) {
    tablaControles.innerHTML = "";
    controles.forEach(c => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${c.fecha_celo}</td>
            <td>${c.en_celo ? "Sí" : "No"}</td>
            <td>${c.observaciones}</td>
            <td>${c.fecha_proximo_celo || "-"}</td>
            <td>${c.fecha_servicio_recomendada || "-"}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarCelo(${c.id})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarCelo(${c.id})">Eliminar</button>
            </td>
        `;
        tablaControles.appendChild(row);
    });
}

// Agregar nuevo control de celo
formControl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        cerda: cerdaId,
        fecha_celo: document.getElementById("fechaCelo").value,
        observaciones: document.getElementById("observaciones").value
    };

    const res = await fetch(API_CELO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Control agregado");
        cargarCerda();
        formControl.reset();
    } else {
        alert("Error al agregar control");
    }
});

// Editar control de celo
window.editarCelo = async (id) => {
    const fecha = prompt("Nueva fecha de celo (YYYY-MM-DD)");
    const obs = prompt("Nueva observación");
    if (!fecha) return;

    const res = await fetch(`${API_CELO}${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha_celo: fecha, observaciones: obs })
    });

    if (res.ok) {
        alert("Control actualizado");
        cargarCerda();
    } else {
        alert("Error al actualizar control");
    }
};

// Eliminar control de celo
window.eliminarCelo = async (id) => {
    if (!confirm("¿Eliminar este control?")) return;

    const res = await fetch(`${API_CELO}${id}/`, { method: "DELETE" });
    if (res.ok) {
        alert("Control eliminado");
        cargarCerda();
    } else {
        alert("Error al eliminar control");
    }
};

cargarCerda();
