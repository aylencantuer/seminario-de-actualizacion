// ApplicationUI.js

function showUserMenu(username) {
  let userdata = isValidUserGetData(username);
  let option;

  do {
    option = window.prompt("Menú de acciones:\n1. Cambiar contraseña\n2. Gestión de artículos\nX. Salir");

    if(option === null) {
      option = "X";
    }else{
      option = option.toUpperCase();
    }

    switch (option) {
      case "1":
        let newPassword = window.prompt("Ingrese nueva contraseña:");

        if (newPassword === null || newPassword === "") {
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

  if (!username || !authData.has(username)) {
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
    )

    // Manejar caso donde el usuario cancela el prompt
    if (option === null) {
      option = "X"; // Considerar como "Salir"
    } else {
      option = option.toUpperCase();
    }

    switch (option) {
      case "1": {
        const res = window.proxyListArticles(username);
        if (res.status) {
          alert(res.result); // o showArticles(res.result) si tenés esa función definida
        } else {
          alert("No tiene permiso o ocurrió un error." + res.result);
        }
        break;
      }

      case "2": {
        const newArticle = getArticleInput();
        if (newArticle) { 
          const res = window.proxyCreateArticle(username, newArticle);
          alert(res.status ? "Artículo creado correctamente." : "Permiso denegado o error: " + res.result);
        } else {
          alert("Creación de artículo cancelada o datos inválidos.");
        }
        break;
      }

      case "3": {
        let idToEdit = prompt("Ingrese el ID del artículo a editar:");
        if (idToEdit === null || isNaN(parseInt(idToEdit))) {
          alert("ID de artículo inválido o cancelación.");
          break;
        }
        idToEdit = parseInt(idToEdit);

        // Uso el proxy para obtener los detalles del artículo
        const detailsRes = window.proxyGetArticleDetails(username, idToEdit); // Llama al proxy
        if (!detailsRes.status) {
          alert("Error al obtener detalles del artículo: " + detailsRes.result);
          break;
        }
        const articleToDisplay = detailsRes.result; // El resultado es el objeto del artículo

        
        let articleName = prompt(`Ingrese el nuevo nombre del artículo (actual: ${articleToDisplay.name}, dejar vacío para no cambiar):`);
        let articlePrice = prompt(`Ingrese el nuevo precio del artículo (actual: ${articleToDisplay.price.toFixed(2)}, dejar vacío para no cambiar):`);
        let articleStock = prompt(`Ingrese el nuevo stock del artículo (actual: ${articleToDisplay.stock}, dejar vacío para no cambiar):`);

        let articleUpdate = { id: idToEdit };

        if (articleName !== null && articleName !== "") articleUpdate.name = articleName;
        
        if (articlePrice !== null && articlePrice !== "") {
          const parsedPrice = parseFloat(articlePrice);
          if (!isNaN(parsedPrice)) articleUpdate.price = parsedPrice;
          else alert("Precio ingresado no es un número válido. No se modificará el precio.");
        }
        if (articleStock !== null && articleStock !== "") {
          const parsedStock = parseInt(articleStock);
          if (!isNaN(parsedStock)) articleUpdate.stock = parsedStock;
          else alert("Stock ingresado no es un número válido. No se modificará el stock.");
        }

        if (Object.keys(articleUpdate).length === 1) { // Solo el ID está presente
          alert("No se proporcionaron datos para editar.");
          break;
        }

        const res = window.proxyEditArticle(username, articleUpdate);
        alert(res.status ? "Artículo editado correctamente." : "Permiso denegado o error: " + res.result);
        break;
      }

      case "4": {
        const idToDelete = prompt("Ingrese el ID del artículo a eliminar:");
        if (idToDelete === null || isNaN(parseInt(idToDelete))) {
          alert("ID de artículo inválido o cancelación.");
          break;
        }
        
        const res = window.proxyDeleteArticle(username, parseInt(idToDelete)); //
        alert(res.status ? "Artículo eliminado correctamente." : "Permiso denegado o error: " + res.result);
        break;
      }


      case "5": {
        const idToBuy = prompt("Ingrese el ID del artículo a comprar:");
        if (idToBuy === null || isNaN(parseInt(idToBuy))) {
          alert("ID de artículo inválido o cancelación.");
          break;
        }
        // Usar la función del proxy para comprar artículo
        const res = window.proxyPurchaseArticle(username, parseInt(idToBuy)); //
        alert(res.status ? res.result : "Permiso denegado o error: " + res.result);
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
  if (name === null || name === "") return null;

  let priceInput = prompt("Ingrese el precio del artículo:");
  if (priceInput === null) return null;
  let price = parseFloat(priceInput);
  if (isNaN(price) || price <= 0) {
    alert("Precio inválido.");
    return null;
  }

  let stockInput = prompt("Ingrese el stock inicial del artículo:", 0);
  if (stockInput === null) return null; 
  let stock = parseInt(stockInput, 0);
  if (isNaN(stock) || stock < 0) {
    alert("Stock inválido.");
    return null;
  }

  let idInput = prompt("Ingrese el ID del nuevo artículo:");
  if (idInput === null) return null;
  let id = parseInt(idInput);
  if (isNaN(id)) {
    alert("ID inválido.");
    return null;
  }

  return { id, name, price, stock };
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