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
  let username = prompt("Confirme su nombre de usuario:"); // necesario para evaluar permisos

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
      case "1":
        if (hasPermission(username, 'LIST')) {
          listArticles();
        } else {
          alert("No tiene permiso para listar artículos.");
        }
        break;

      case "2":
        if (hasPermission(username, 'CREATE')) {
          createArticle();
        } else {
          alert("No tiene permiso para crear artículos.");
        }
        break;

      case "3":
        if (hasPermission(username, 'EDIT')) {
          editArticle();
        } else {
          alert("No tiene permiso para editar artículos.");
        }
        break;

      case "4":
        if (hasPermission(username, 'DELETE')) {
          deleteArticle();
        } else {
          alert("No tiene permiso para eliminar artículos.");
        }
        break;

      case "5":
        if (hasPermission(username, 'PURCHASE')) {
          purchaseArticle();
        } else {
          alert("No tiene permiso para comprar artículos.");
        }
        break;
    }
  } while (option !== "X");
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
