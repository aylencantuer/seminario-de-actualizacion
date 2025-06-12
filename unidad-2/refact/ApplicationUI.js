// ApplicationUI.js

function showUserMenu(username) {
  let userdata = isValidUserGetData(username);
  let option;

  do {
    option = window.prompt("Menú de acciones:\n1. Cambiar contraseña\n2. Gestión de artículos\nX. Salir").toUpperCase();

    switch (option) {
      case "1":
        let newPassword = window.prompt("Ingrese nueva contraseña:");

        if (!newPassword) {
          alert("La contraseña no puede estar vacía.");
        } else if (!isValidPassword(newPassword)) {
          alert("La contraseña debe tener entre 8 y 16 caracteres alfanuméricos, al menos una mayúscula y al menos 2 símbolos especiales.");
        } else {
          userdata.password = newPassword;
          alert("Contraseña cambiada exitosamente.");
        }
        break;

      case "2":
        manageArticles();
        break;
    }

  } while (option !== "X");
}

function manageArticles() {
  let option;
  const username = prompt("Confirme su nombre de usuario:");

  if (!authData.has(username)) {
    alert("Usuario inválido.");
    return;
  }

  do {
    option = window.prompt(
      "Gestión de artículos:\n" +
      "1. Listar artículos\n" +
      "2. Nuevo artículo\n" +
      "3. Editar artículo\n" +
      "4. Eliminar artículo\n" +
      "5. Comprar artículo\n" +
      "X. Volver"
    ).toUpperCase();

    switch (option) {
      case "1": {
        const res = requestToBackend(username, "LIST");
        if (res.status) {
          alert(res.result); // o showArticles(res.result) si tenés esa función definida
        } else {
          alert("No tiene permiso o ocurrió un error.");
        }
        break;
      }

      case "2": {
        const newArticle = getArticleInput(); // Asegurate de que devuelva un objeto válido
        const res = requestToBackend(username, "CREATE", { article: newArticle });
        alert(res.status ? "Artículo creado correctamente." : "Permiso denegado o error.");
        break;
      }

      case "3": {
        const articleToEdit = getArticleInput(); // Debe contener ID y nuevos valores
        const res = requestToBackend(username, "EDIT", { article: articleToEdit });
        alert(res.status ? "Artículo editado correctamente." : "Permiso denegado o error.");
        break;
      }

      case "4": {
        const idToDelete = prompt("Ingrese el ID del artículo a eliminar:");
        const res = requestToBackend(username, "DELETE", { id: parseInt(idToDelete) });
        alert(res.status ? "Artículo eliminado correctamente." : "Permiso denegado o error.");
        break;
      }

      case "5": {
        const idToBuy = prompt("Ingrese el ID del artículo a comprar:");
        const res = requestToBackend(username, "PURCHASE", { id: parseInt(idToBuy) });
        alert(res.status ? "Compra realizada con éxito." : "Permiso denegado o error.");
        break;
      }

      case "X":
        break;

      default:
        alert("Opción inválida.");
    }
  } while (option !== "X");
}

        /*
         Solicita al usuario los datos necesarios para crear o editar un artículo.
        Devuelve un objeto { name, price, stock } si todo es válido, o null si se cancela.El backend (simulado por handleRequestFromProxy) responde con un objeto que típicamente tiene esta estructura:

          {
            status: true,               // indica si la operación fue exitosa
            result: [...],              // contiene los artículos, mensaje, o null según el caso
            message: "OK"               // opcional: puede ser "Permiso denegado", "Artículo no encontrado", etc.
          } */

      


function getArticleInput() {
  let name = prompt("Ingrese el nombre del artículo:");
  if (!name) return null;

  let price = parseFloat(prompt("Ingrese el precio del artículo:"));
  if (isNaN(price) || price <= 0) {
    alert("Precio inválido.");
    return null;
  }

  let stock = parseInt(prompt("Ingrese el stock inicial del artículo:"), 10);
  if (isNaN(stock) || stock < 0) {
    alert("Stock inválido.");
    return null;
  }

  return { name, price, stock };
}


function GUI_login() {
  let username = window.prompt("Ingrese su nombre de usuario:");
  let password = window.prompt("Ingrese contraseña:");

  let api_return = authenticateUser(username, password);

  if (api_return.status) {
    alert(`¡Bienvenido/a ${username}!`);
    showUserMenu(username);
  } else {
    switch (api_return.result) {
      case 'BLOCKED_USER':
        alert('Usuario bloqueado. Contacte al administrador');
        break;
      case 'USER_PASSWORD_FAILED':
        alert('Usuario y/o contraseña incorrecta');
        break;
      default:
        alert('Error desconocido');
    }
  }
}

function GUI_register(adminUsername) {
  if (!canCreateUser(adminUsername)) {
    alert("Acceso denegado. Solo administradores pueden crear cuentas.");
    return;
  }

  let role = prompt("Ingrese rol de usuario (ADMIN, CLIENT, SELLER, WAREHOUSE):").toUpperCase();

  if (!['ADMIN', 'CLIENT', 'SELLER', 'WAREHOUSE'].includes(role)) {
    alert("Rol inválido.");
    return;
  }

  let username = window.prompt("Ingrese nuevo nombre de usuario:");

  if (!username || authData.has(username)) {
    alert("Nombre de usuario inválido o ya existente.");
    return;
  }

  let password = window.prompt("Ingrese contraseña:");

  if (!isValidPassword(password)) {
    alert("La contraseña debe tener entre 8 y 16 caracteres alfanuméricos, al menos una mayúscula y al menos 2 símbolos especiales.");
    return;
  }

  authData.set(username, {
    password: password,
    failedLoginCounter: 0,
    isLocked: false,
    role: role
  });

  alert("Cuenta creada exitosamente.");
}

function GUI_mainMenu() {
  let option;

  do {
    option = window.prompt("Menú principal:\n1. Iniciar sesión\n2. Crear cuenta (solo Admin)\nX. Salir").toUpperCase();

    switch (option) {
      case "1":
        GUI_login();
        break;

      case "2":
        let adminUser = prompt("Ingrese nombre de usuario administrador:");
        let adminPass = prompt("Ingrese contraseña:");

        let result = authenticateUser(adminUser, adminPass);

        if (result.status) {
          if (canCreateUser(adminUser)) {
            GUI_register(adminUser);
          } else {
            alert("No tiene permisos para crear cuentas.");
          }
        } else {
          alert("Credenciales incorrectas o usuario bloqueado.");
        }
        break;
    }
  } while (option !== "X");
}

function main() {
  GUI_mainMenu();
}

window.onload = main;

handle