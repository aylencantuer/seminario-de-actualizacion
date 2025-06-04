// ApplicationModel.js

let authData = new Map();
const maxLoginFailedAttempts = 3;

let articles = [
  { id: 1, name: "Lavandina x 1L", price: 875.25, stock: 3000 },
  { id: 4, name: "Detergente x 500mL", price: 1102.45, stock: 2010 },
  { id: 22, name: "Jabón en polvo x 250g", price: 650.22, stock: 407 }
];

let userData = [
  {
    password: '1234AYL!!.',
    failedLoginCounter: 0,
    isLocked: false,
    role: 'ADMIN'
  },
  {
    password: '1234AYL!!.',
    failedLoginCounter: 0,
    isLocked: false,
    role: 'CLIENT'
  },
  {
    password: '1234AYL!!.',
    failedLoginCounter: 0,
    isLocked: false,
    role: 'SELLER'
  },
  {
    password: '1234AYL!!.',
    failedLoginCounter: 0,
    isLocked: false,
    role: 'WAREHOUSE'
  }
];

authData.set('scorpion', userData[0]);
authData.set('aylen', userData[1]);
authData.set('Sandra', userData[2]);
authData.set('Diego', userData[3]);


function isValidUserGetData(username) {
  return authData.get(username);
}

function authenticateUser(username, password) {
  let api_return = {
    status: false,
    result: null
  };

  if (username && password) {
    let userdata = isValidUserGetData(username);

    if (userdata) {
      if (!userdata.isLocked) {
        if (userdata.password === password) {
          api_return.status = true;
        } else {
          userdata.failedLoginCounter++;

          if (userdata.failedLoginCounter >= maxLoginFailedAttempts) {
            userdata.isLocked = true;
            api_return.result = 'BLOCKED_USER';
          } else {
            api_return.result = 'USER_PASSWORD_FAILED';
          }
        }
      } else {
        api_return.result = 'BLOCKED_USER';
      }
    } else {
      api_return.result = 'USER_PASSWORD_FAILED';
    }
  }

  return api_return;
}

function isValidPassword(password) {
  const lengthOk = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasAlphanumeric = /[A-Za-z0-9]/.test(password);
  const specialChars = password.replace(/[A-Za-z0-9]/g, '');
  const hasTwoSpecials = specialChars.length >= 2;

  return lengthOk && hasUppercase && hasAlphanumeric && hasTwoSpecials;
}

function listArticles() {
  if (articles.length === 0) {
    alert("No hay artículos registrados.");
    return;
  }

  let output = "Listado de artículos:\n";
  articles.forEach(article => {
    output += `ID: ${article.id} | Nombre: ${article.name} | Precio: $${article.price.toFixed(2)} | Stock: ${article.stock}\n`;
  });

  alert(output);
}

function createArticle() {
  let id = parseInt(prompt("Ingrese ID del nuevo artículo:"));
  if (isNaN(id) || articles.find(a => a.id === id)) {
    alert("ID inválido o ya existente.");
    return;
  }

  let name = prompt("Ingrese nombre del artículo:");
  let price = parseFloat(prompt("Ingrese precio:")); 
  let stock = parseInt(prompt("Ingrese stock:")); 

  if (!name || isNaN(price) || isNaN(stock)) {
    alert("Datos inválidos.");
    return;
  }

  articles.push({ id, name, price, stock });
  alert("Artículo creado correctamente.");
}

function editArticle() {
  let id = parseInt(prompt("Ingrese ID del artículo a editar:"));
  let article = articles.find(a => a.id === id); 

  if (!article) {
    alert("Artículo no encontrado.");
    return;
  }

  let name = prompt(`Nombre actual: ${article.name}\nNuevo nombre (dejar vacío para mantener):`);
  let price = prompt(`Precio actual: $${article.price}\nNuevo precio (dejar vacío para mantener):`);
  let stock = prompt(`Stock actual: ${article.stock}\nNuevo stock (dejar vacío para mantener):`);

  if (name) article.name = name;
  if (price) {
    let parsed = parseFloat(price);
    if (!isNaN(parsed)) article.price = parsed;
  }
  if (stock) {
    let parsed = parseInt(stock);
    if (!isNaN(parsed)) article.stock = parsed;
  }

  alert("Artículo editado correctamente.");
}

function deleteArticle() {
  let id = parseInt(prompt("Ingrese ID del artículo a eliminar:"));
  let index = articles.findIndex(a => a.id === id);

  if (index === -1) {
    alert("Artículo no encontrado.");
    return;
  }

  articles.splice(index, 1);
  alert("Artículo eliminado correctamente.");
}

function purchaseArticle() {
  let id = parseInt(prompt("Ingrese ID del artículo que desea comprar:"));
  let article = articles.find(a => a.id === id);

  if (!article) {
    alert("Artículo no encontrado.");
    return;
  }

  if (article.stock <= 0) {
    alert("No hay stock disponible para este artículo.");
    return;
  }

  let quantity = parseInt(prompt(`Ingrese cantidad a comprar (stock disponible: ${article.stock}):`));
  
  if (isNaN(quantity) || quantity <= 0) {
    alert("Cantidad inválida.");
    return;
  }

  if (quantity > article.stock) {
    alert("No hay suficiente stock para esa cantidad.");
    return;
  }

  let confirmPurchase = confirm(`Confirmar compra de ${quantity} unidad(es) de "${article.name}" por un total de $${(article.price * quantity).toFixed(2)}?`);
  
  if (confirmPurchase) {
    article.stock -= quantity;
    alert(`Compra realizada con éxito. Stock restante: ${article.stock}`);
  } else {
    alert("Compra cancelada.");
  }
}

function hasPermission(username, action) {
  const role = authData.get(username)?.role;

  const permissions = {
    ADMIN: ['LIST', 'CREATE', 'EDIT', 'DELETE', 'PURCHASE'],
    CLIENT: ['LIST', 'PURCHASE'],
    SELLER: ['LIST', 'PURCHASE'],
    WAREHOUSE: ['LIST', 'EDIT', 'PURCHASE']
  };

  return permissions[role]?.includes(action);
}

function canCreateUser(username) {
  let user = authData.get(username);
  return user?.role === 'ADMIN';
}
