// ApplicationProxy.js
// Implementaremos un proxy entre el frontend y el backend para que toda la validación de permisos y acciones como 
// listar, crear, editar, eliminar o comprar artículos se gestionen exclusivamente desde el backend.
// Intermediario que expone funciones simples al UI 
//  (listArticles, createArticle, etc.) y se comunica con el backend.

// Esta función es el punto de entrada principal para todas las solicitudes al backend.
function requestToBackend(username, action, data = {}) {
  // Aquí se llama a la función del modelo que maneja las solicitudes, pasando todos los datos necesarios.
  return handleRequestFromProxy({ username, action, ...data });
}

// Funciones expuestas por el proxy para ser usadas por la UI
function proxyListArticles(username) {
  return requestToBackend(username, 'LIST');
}

function proxyCreateArticle(username, articleData) {
  return requestToBackend(username, 'CREATE', { article: articleData });
}

function proxyEditArticle(username, articleData) {
  return requestToBackend(username, 'EDIT', { article: articleData });
}

function proxyDeleteArticle(username, articleId) {
  return requestToBackend(username, 'DELETE', { id: articleId });
}

function proxyPurchaseArticle(username, articleId) {
  return requestToBackend(username, 'PURCHASE', { id: articleId });
}

function proxyGetArticleDetails(username, articleId) {
    // Asumiendo que handleRequestFromProxy también puede manejar una acción 'GET_DETAILS'
    return requestToBackend(username, 'GET_DETAILS', { id: articleId });
}
window.proxyGetArticleDetails = proxyGetArticleDetails;
// Exponemos las funciones del proxy al ámbito global (window) para que ApplicationUI pueda acceder a ellas.
// Esto es importante para que ApplicationUI.js pueda "ver" estas funciones.
window.proxyListArticles = proxyListArticles;
window.proxyCreateArticle = proxyCreateArticle;
window.proxyEditArticle = proxyEditArticle;
window.proxyDeleteArticle = proxyDeleteArticle;
window.proxyPurchaseArticle = proxyPurchaseArticle;