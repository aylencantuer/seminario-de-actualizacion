// ApplicationProxy.js

/*Implementaremos un proxy entre el frontend y el backend para que toda la validación de permisos y acciones como 
listar, crear, editar, eliminar o comprar artículos se gestionen exclusivamente desde el backend.

Intermediario que expone funciones simples al UI 
 (listArticles, createArticle, etc.) y se comunica con el backend.
*/

function requestToBackend(username, action, data = {}) {
  return handleRequestFromProxy({ username, action, ...data });
}

function proxylistArticles(username) {
  return requestToBackend(username, 'LIST');
}

function createArticle(username, articleData) {
  return requestToBackend(username, 'CREATE', { article: articleData });
}

function editArticle(username, articleData) {
  return requestToBackend(username, 'EDIT', { article: articleData });
}

function deleteArticle(username, articleId) {
  return requestToBackend(username, 'DELETE', { id: articleId });
}

function purchaseArticle(username, articleId) {
  return requestToBackend(username, 'PURCHASE', { id: articleId });
}

window.proxyListArticles = proxyListArticles;
