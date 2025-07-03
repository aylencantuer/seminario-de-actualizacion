// ApplicationModel.js

import * as IndexedDBManager from './IndexedDBManager.js';

let authData = new Map();
const maxLoginFailedAttempts = 3;

// Los artículos iniciales se definirán si no se cargan del almacenamiento
let articles = [
  { id: 1, name: "Lavandina x 1L", price: 875.25, stock: 3000 },
  { id: 4, name: "Detergente x 500mL", price: 1102.45, stock: 2010 },
  { id: 22, name: "Jabón en polvo x 250g", price: 650.22, stock: 407 }
];

// Datos de usuario predefinidos para inicialización si no hay en almacenamiento
const initialUserData = [ 
  { password: '1234AYL!!.', failedLoginCounter: 0, isLocked: false, role: 'ADMIN' },
  { password: '1234AYL!!.', failedLoginCounter: 0, isLocked: false, role: 'CLIENT' },
  { password: '1234AYL!!.', failedLoginCounter: 0, isLocked: false, role: 'SELLER' },
  { password: '1234AYL!!.', failedLoginCounter: 0, isLocked: false, role: 'WAREHOUSE' }
];

// --- Storage Configuration ---
// Define los tipos de almacenamiento para cada entidad.
const AUTH_STORAGE_TYPE = 'localStorage';
const ARTICLE_STORAGE_TYPE = 'indexedDB';

// Estos objetos simulan un manager para localStorage y sessionStorage
const localStorageManager = { 
    saveData: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`LocalStorage: Data for ${key} saved.`);
    },
    loadData: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

const sessionStorageManager = {
    saveData: function(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
        console.log(`SessionStorage: Data for ${key} saved.`);
    },
    loadData: function(key) {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

// Estas funciones serán asignadas dinámicamente según la configuración de almacenamiento
let saveAuthData;
let loadAuthData;
let saveArticles; 
let loadArticles;

/**
 * Inicializa las funciones de guardado y carga de datos según los tipos de almacenamiento configurados.
 */
function initializeStorageManagers() { //función para inicializar los managers

    // Configuración para los datos de autenticación
    switch (AUTH_STORAGE_TYPE) {
        case 'localStorage':
            // Para authData (Map), lo convertimos a array para almacenar y de array a Map al cargar
            saveAuthData = function() { localStorageManager.saveData('authData', Array.from(authData.entries())); }; // MODIFICACIÓN
            loadAuthData = function() { 
                const loaded = localStorageManager.loadData('authData');
                return loaded ? new Map(loaded) : null;
            };
            break;
        case 'sessionStorage':
            saveAuthData = function() { sessionStorageManager.saveData('authData', Array.from(authData.entries())); }; 
            loadAuthData = function() { 
                const loaded = sessionStorageManager.loadData('authData');
                return loaded ? new Map(loaded) : null;
            };
            break;
        default:
            console.error(`Tipo de almacenamiento no soportado para authData: ${AUTH_STORAGE_TYPE}. Se usará SessionStorage por defecto.`); // MODIFICACIÓN
            saveAuthData = function() { sessionStorageManager.saveData('authData', Array.from(authData.entries())); }; // MODIFICACIÓN
            loadAuthData = function() { // MODIFICACIÓN
                const loaded = sessionStorageManager.loadData('authData');
                return loaded ? new Map(loaded) : null;
            };
            break;
    }

    //Configuración para los datos de artículos
    switch (ARTICLE_STORAGE_TYPE) {
        case 'localStorage':
            saveArticles = function() { localStorageManager.saveData('articles', articles); }; // MODIFICACIÓN
            loadArticles = function() { return localStorageManager.loadData('articles'); }; // MODIFICACIÓN
            break;
        case 'sessionStorage':
            saveArticles = function() { sessionStorageManager.saveData('articles', articles); }; // MODIFICACIÓN
            loadArticles = function() { return sessionStorageManager.loadData('articles'); }; // MODIFICACIÓN
            break;
        case 'indexedDB':
            saveArticles = async function() { await IndexedDBManager.saveToIndexedDB('articles', articles); }; // MODIFICACIÓN: Usa IndexedDBManager
            loadArticles = async function() { return await IndexedDBManager.loadFromIndexedDB('articles'); }; // MODIFICACIÓN: Usa IndexedDBManager
            break;
        default:
            console.error(`Tipo de almacenamiento no soportado para artículos: ${ARTICLE_STORAGE_TYPE}. Se usará SessionStorage por defecto.`); // MODIFICACIÓN
            saveArticles = function() { sessionStorageManager.saveData('articles', articles); }; // MODIFICACIÓN
            loadArticles = function() { return sessionStorageManager.loadData('articles'); }; // MODIFICACIÓN
            break;
    }
}

//Inicializa los managers al cargar el script
initializeStorageManagers();

//Carga los datos al inicio de la aplicación de forma asíncrona
async function loadAllData() {
    console.log("Cargando datos de autenticación...");
    const loadedAuth = await loadAuthData(); 
    if (loadedAuth && loadedAuth.size > 0) {
        authData = loadedAuth;
        console.log("Datos de autenticación cargados.");
    } else {
        // Si no hay datos, datos predefinidos:
        console.log("No se encontraron datos de autenticación en el almacenamiento. Inicializando con datos predefinidos."); // MODIFICACIÓN
        authData.set('scorpion', initialUserData[0]);
        authData.set('aylen', initialUserData[1]);
        authData.set('Sandra', initialUserData[2]);
        authData.set('Diego', initialUserData[3]);
        await saveAuthData(); //Guarda los datos predefinidos inicialmente
    }

    console.log("Cargando datos de artículos...");
    const loadedArticles = await loadArticles();
    if (loadedArticles && loadedArticles.length > 0) {
        articles = loadedArticles;
        console.log("Artículos cargados.");
    } else {
        console.log("No se encontraron artículos en el almacenamiento. Usando datos predefinidos.");
        await saveArticles(); //Guarda los artículos predefinidos inicialmente
    }
}

// Llama a loadAllData inmediatamente para asegurar que los datos estén cargados cuando se ejecuta el script
loadAllData().catch(error => {
    console.error("Error al cargar todos los datos al inicio:", error);
});


function isValidUserGetData(username) {
  return authData.get(username);
}

async function authenticateUser(username, password) {
  let api_return = {
    status: false,
    result: null
  };

  if ((username !== undefined && username !== null && username !== '') && (password !== undefined && password !== null && password !== '')) {
    let userdata = authData.get(username);

    if (userdata) {
        if (userdata.isLocked) {
            api_return.result = 'BLOCKED_USER';
        } else if (userdata.password === password) {
            api_return.status = true;
            userdata.failedLoginCounter = 0; 
            await saveAuthData();
        } else {
            api_return.status = false;
            api_return.result = 'USER_PASSWORD_FAILED';

            userdata.failedLoginCounter++;
            await saveAuthData();

            if (userdata.failedLoginCounter >= maxLoginFailedAttempts) {
                userdata.isLocked = true;
                await saveAuthData();
                api_return.result = 'BLOCKED_USER';
            }
        }
    } else {
      api_return.result = 'USER_PASSWORD_FAILED';
    }
  }

  return api_return;
}

async function registerUser(username, password, role) {
  if (authData.has(username)) {
    return { status: false, result: 'USER_ALREADY_EXISTS' };
  }

  authData.set(username, {
    password: password,
    failedLoginCounter: 0,
    isLocked: false,
    role: role
  });
  await saveAuthData();
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

async function updateUserPassword(username, newPassword) { 
  const userdata = authData.get(username);
  if (userdata) {
    userdata.password = newPassword;
    await saveAuthData(); 
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

async function createArticle(article) {
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
  await saveArticles();
  return "Artículo creado correctamente.";
}

async function editArticle(articleUpdate) {
  let { id, name, price, stock } = articleUpdate;
  id = parseInt(id);
  let article = articles.find(a => a.id === id);

  if (!article) {
    return "Artículo no encontrado.";
  }

  if (name) article.name = name;
  if (!isNaN(parseFloat(price))) article.price = parseFloat(price);
  if (!isNaN(parseInt(stock))) article.stock = parseInt(stock);

  await saveArticles();
  return "Artículo editado correctamente.";
}

async function deleteArticle(id) {
  let index = articles.findIndex(a => a.id === id);

  if (index === -1) {
    return "Artículo no encontrado.";
  }

  articles.splice(index, 1);
  await saveArticles();
  return "Artículo eliminado correctamente.";
}

async function purchaseArticle(id) {
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
    await saveArticles();
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

async function handleRequestFromProxy({ username, action, article, id }) { 
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
        return { status: true, result: await createArticle(article) };
      }
      break;

    case 'EDIT':
      if (hasPermission(username, 'EDIT')) {
        return { status: true, result: await editArticle(article) };
      }
      break;

    case 'DELETE':
      if (hasPermission(username, 'DELETE')) {
        return { status: true, result: await deleteArticle(id) };
      }
      break;

    case 'PURCHASE':
      if (hasPermission(username, 'PURCHASE')) {
        return { status: true, result: await purchaseArticle(id) };
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


//La palabra clave await "pausa" la ejecución de una 
// función async hasta que la Promise que le sigue se resuelve.

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