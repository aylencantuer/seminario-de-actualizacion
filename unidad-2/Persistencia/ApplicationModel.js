import { saveToSessionStorage, loadFromSessionStorage } from './SessionStorageManager.js';

const maxLoginFailedAttempts = 3;

//Cargar authData desde sessionStorage, si no existe, usar valores por defecto
let authData = loadFromSessionStorage('authData', true); // true indica que esperamos un Map
if (!authData) {
  authData = new Map();
let userDataDefault = [
  { password: '1234AYL!!.', failedLoginCounter: 0, isLocked: false, role: 'ADMIN' },
  { password: '1234AYL!!.', failedLoginCounter: 0, isLocked: false, role: 'CLIENT' },
  { password: '1234AYL!!.', failedLoginCounter: 0, isLocked: false, role: 'SELLER' },
  { password: '1234AYL!!.', failedLoginCounter: 0, isLocked: false, role: 'WAREHOUSE' }
];
authData.set('scorpion', userDataDefault[0]);
authData.set('aylen', userDataDefault[1]);
authData.set('Sandra', userDataDefault[2]);
authData.set('Diego', userDataDefault[3]);
saveToSessionStorage('authData', authData);// Guardar los valores por defecto si no existían
}

// 2. Cargar articles desde sessionStorage, si no existen, usar valores por defecto
let articles = loadFromSessionStorage('articles'); 
if (!articles) {
  articles = [
    { id: 1, name: "Lavandina x 1L", price: 875.25, stock: 3000 },
    { id: 4, name: "Detergente x 500mL", price: 1102.45, stock: 2010 },
    { id: 22, name: "Jabón en polvo x 250g", price: 650.22, stock: 407 }
  ];
  saveToSessionStorage('articles', articles); 
}

function isValidUserGetData(username) {
  return authData.get(username);
}

function authenticateUser(username, password) {
  let api_return = { status: false, result: null };

  if (username && password) {
    let userdata = isValidUserGetData(username);

    if (userdata) {
      if (!userdata.isLocked) {
        if (userdata.password === password) {
          api_return.status = true;
          // Resetear contador de intentos fallidos si el login es exitoso
          if (userdata.failedLoginCounter > 0) {
            userdata.failedLoginCounter = 0;
            saveToSessionStorage('authData', authData); // Guardar cambio en authData
          }
        } else {
          userdata.failedLoginCounter++;
          saveToSessionStorage('authData', authData); // Guardar cambio en authData

          if (userdata.failedLoginCounter >= maxLoginFailedAttempts) {
            userdata.isLocked = true;
            saveToSessionStorage('authData', authData); // Guardar cambio en authData
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

function registerUser(username, password, role) {
  if (authData.has(username)) {
    return { status: false, result: 'USER_ALREADY_EXISTS' };
  }

  authData.set(username, {
    password: password,
    failedLoginCounter: 0,
    isLocked: false,
    role: role
  });
  saveToSessionStorage('authData', authData);
  return { status: true, result: 'USER_CREATED_SUCCESSFULLY' };
}

function isValidPassword(password) {
  const lengthOk = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasAlphanumeric = /[A-Za-z0-9]/.test(password);
  const specialChars = password.replace(/[A-Za-z0-9]/g, '');
  const hasTwoSpecials = specialChars.length >= 2;

  return lengthOk && hasUppercase && hasAlphanumeric && hasTwoSpecials;
}

//Actualizar la contraseña y persistir el cambio
function updateUserPassword(username, newPassword) {
  const userdata = authData.get(username);
  if (userdata) {
    userdata.password = newPassword;
    saveToSessionStorage('authData', authData);
    return true; 
  }
  return false; 
}

function listArticles() {
  if (articles.length === 0) {
    return "No hay artículos registrados.";
  }

  let output = "Listado de artículos:\n";
  articles.forEach(article => {
    output += `ID: ${article.id} | Nombre: ${article.name} | Precio: $${article.price.toFixed(2)} | Stock: ${article.stock}\n`;
  });

  console.log("DEBUG listArticles output:", output);

  return output;
}

function createArticle(article) {
  let { id, name, price, stock } = article;
  id = parseInt(id);
  price = parseFloat(price);
  stock = parseInt(stock);

  if (isNaN(id) || articles.find(a => a.id === id)) {
    return "ID inválido o ya existente.";
  }

  if (!name || isNaN(price) || isNaN(stock)) {
    return "Datos inválidos.";
  }

  articles.push({ id, name, price, stock });
  saveToSessionStorage('articles', articles); 
  return "Artículo creado correctamente.";
}

function editArticle(articleUpdate) {
  let { id, name, price, stock } = articleUpdate;
  id = parseInt(id);
  let article = articles.find(a => a.id === id);

  if (!article) {
    return "Artículo no encontrado.";
  }

  if (name) article.name = name;
  if (!isNaN(parseFloat(price))) article.price = parseFloat(price);
  if (!isNaN(parseInt(stock))) article.stock = parseInt(stock);

  saveToSessionStorage('articles', articles);
  return "Artículo editado correctamente.";
}

function deleteArticle(id) {
  let index = articles.findIndex(a => a.id === id);

  if (index === -1) {
    return "Artículo no encontrado.";
  }

  articles.splice(index, 1);
  saveToSessionStorage('articles', articles);
  return "Artículo eliminado correctamente.";
}

function purchaseArticle(id) {
  let article = articles.find(a => a.id === id);

  if (!article) {
    return "Artículo no encontrado.";
  }

  if (article.stock <= 0) {
    return "No hay stock disponible para este artículo.";
  }

  let quantity = parseInt(prompt(`Ingrese cantidad a comprar (stock disponible: ${article.stock}):`));

  if (isNaN(quantity) || quantity <= 0) {
    return "Cantidad inválida.";
  }

  if (quantity > article.stock) {
    return "No hay suficiente stock para esa cantidad.";
  }

  let confirmPurchase = confirm(`Confirmar compra de ${quantity} unidad(es) de "${article.name}" por un total de $${(article.price * quantity).toFixed(2)}?`);

  if (confirmPurchase) {
    article.stock -= quantity;
    saveToSessionStorage('articles', articles);
    return `Compra realizada con éxito. Stock restante: ${article.stock}`;
  } else {
    return "Compra cancelada.";
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

function getArticleById(id) {
  return articles.find(a => a.id === id);
}

function handleRequestFromProxy({ username, action, article, id }) {
  const user = authData.get(username);
  if (!user || user.isLocked) {
    return { status: false, result: 'ACCESS_DENIED' };
  }

  switch (action) {
    case 'LIST':
      if (hasPermission(username, 'LIST')) {
        return { status: true, result: listArticles() };
      }
      break;

    case 'CREATE':
      if (hasPermission(username, 'CREATE')) {
        return { status: true, result: createArticle(article) };
      }
      break;

    case 'EDIT':
      if (hasPermission(username, 'EDIT')) {
        return { status: true, result: editArticle(article) };
      }
      break;

    case 'DELETE':
      if (hasPermission(username, 'DELETE')) {
        return { status: true, result: deleteArticle(id) };
      }
      break;

    case 'PURCHASE':
      if (hasPermission(username, 'PURCHASE')) {
        return { status: true, result: purchaseArticle(id) };
      }
      break;

    case 'GET_DETAILS':
      const foundArticle = getArticleById(id);
      if (foundArticle) {
          return { status: true, result: foundArticle };
      } else {
          return { status: false, result: 'ARTICLE_NOT_FOUND' };
      }
      break;
  }

  return { status: false, result: 'PERMISSION_DENIED' };
}

export {
  isValidUserGetData,
  authenticateUser,
  isValidPassword,
  listArticles,
  createArticle,
  editArticle,
  deleteArticle,
  purchaseArticle,
  hasPermission,
  canCreateUser,
  getArticleById,
  handleRequestFromProxy,
  updateUserPassword,
  registerUser,
  authData,
  articles
};