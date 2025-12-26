const urlParams = new URLSearchParams(window.location.search);
const cerdaId = urlParams.get("id");

const API_CERDA = `https://granja-la-cruz-backend.onrender.com/cerdas-farm/cerda/${cerdaId}/`;
const API_CELO = `https://granja-la-cruz-backend.onrender.com/cerdas-farm/control-celo/`;

const codigoCerda = document.getElementById("codigoCerda");
const estadoCerda = document.getElementById("estadoCerda");
const fechaNac = document.getElementById("fechaNac");
const tablaControles = document.getElementById("tablaControles");
const formControl = document.getElementById("formControl");

// Mostrar info de la cerda y sus controles
async function cargarCerda() {
    const res = await fetch(API_CERDA);
    const cerda = await res.json();

    codigoCerda.textContent = cerda.codigo;
    estadoCerda.textContent = cerda.estado;
    fechaNac.textContent = cerda.fecha_nacimiento;

    tablaControles.innerHTML = "";
    if (cerda.controles_celo && cerda.controles_celo.length > 0) {
        cerda.controles_celo.forEach(c => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${c.fecha_celo}</td>
                <td>${c.en_celo ? "Sí" : "No"}</td>
                <td>${c.observaciones}</td>
                <td>${c.fecha_proximo_celo || "-"}</td>
                <td>${c.fecha_servicio_recomendada || "-"}</td>
            `;
            tablaControles.appendChild(row);
        });
    }
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

cargarCerda();
