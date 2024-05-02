// Función para agregar un nuevo contacto a la tabla
function agregarContacto() {
    // Obtener los valores de los campos del formulario
    var id = document.getElementById("id").value;
    var nombre = document.getElementById("nombre").value;
    var apellido = document.getElementById("apellido").value;
    var email = document.getElementById("email").value;
    var direccion = document.getElementById("direccion").value;
    
    // Obtener los números de teléfono
    var telefonos = [];
    var telefonoInputs = document.querySelectorAll(".telefono");
    telefonoInputs.forEach(function(input) {
        if (input.value.trim() !== "") {
            telefonos.push(input.value.trim());
        }
    });

    // Crear una nueva fila en la tabla con los datos del nuevo contacto
    var tableBody = document.getElementById("contact-table").getElementsByTagName("tbody")[0];
    var newRow = tableBody.insertRow();
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${nombre}</td>
        <td>${apellido}</td>
        <td>${email}</td>
        <td>${direccion}</td>
        <td>${telefonos.join(", ")}</td>
        <td>
            <button class="editar">Editar</button>
            <button onclick="borrarContacto(this)">Borrar</button>
        </td>
    `;

    // Limpiar los campos del formulario después de agregar el contacto
    document.getElementById("id").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("email").value = "";
    document.getElementById("direccion").value = "";

    // Limpiar los campos de teléfono
    telefonoInputs.forEach(function(input) {
        input.value = "";
    });
}

// Agregar evento al formulario para capturar el envío y agregar un contacto
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío por defecto del formulario
    agregarContacto(); // Llamar a la función para agregar un contacto
});

// Función para cargar los datos del contacto en el formulario al hacer clic en "Editar"
function cargarDatosParaEditar(event) {
    var fila = event.target.closest("tr"); // Obtener la fila que contiene el botón "Editar"
    var celdas = fila.getElementsByTagName("td"); // Obtener todas las celdas de la fila

    // Llenar los campos del formulario con los datos del contacto
    document.getElementById("id").value = celdas[0].textContent;
    document.getElementById("nombre").value = celdas[1].textContent;
    document.getElementById("apellido").value = celdas[2].textContent;
    document.getElementById("email").value = celdas[3].textContent;
    document.getElementById("direccion").value = celdas[4].textContent;

    // Agregar números de teléfono al formulario
    var telefonos = celdas[5].textContent.split(", ");
    var telefonoInputs = document.querySelectorAll(".telefono");
    telefonos.forEach(function(telefono, index) {
        if (index < telefonoInputs.length) {
            telefonoInputs[index].value = telefono;
        }
    });
}

// Agregar evento de clic a los botones "Editar"
var botonesEditar = document.querySelectorAll(".editar");
botonesEditar.forEach(function(boton) {
    boton.addEventListener("click", cargarDatosParaEditar);
});

// Agregar evento al formulario para capturar el envío y guardar los cambios del contacto editado
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío por defecto del formulario
    // Aquí puedes agregar la lógica para guardar los cambios del contacto editado en la tabla
});

// Seleccionar todos los botones "Borrar"
var botonesBorrar = document.querySelectorAll("button.borrar");

// Agregar evento de clic a cada botón "Borrar"
botonesBorrar.forEach(function(boton) {
    boton.addEventListener("click", function() {
        borrarContacto(boton); // Llamar a la función borrarContacto con el botón como argumento
    });
});

