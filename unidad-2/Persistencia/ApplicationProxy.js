// ApplicationProxy.js

import { handleRequestFromProxy } from './ApplicationModel.js';

/*Implementaremos un proxy entre el frontend y el backend para que toda la validación de permisos y acciones como 
listar, crear, editar, eliminar o comprar artículos se gestionen exclusivamente desde el backend.

Intermediario que expone funciones simples al UI 
 (listArticles, createArticle, etc.) y se comunica con el backend.
*/

function requestToBackend(username, action, data = {}) {
  return handleRequestFromProxy({ username, action, ...data });
}

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
    return requestToBackend(username, 'GET_DETAILS', { id: articleId });
}

// Exponemos las funciones del proxy al ámbito global (window) para que ApplicationUI pueda acceder a ellas.
window.proxyGetArticleDetails = proxyGetArticleDetails;
window.proxyListArticles = proxyListArticles;
window.proxyCreateArticle = proxyCreateArticle;
window.proxyEditArticle = proxyEditArticle;
window.proxyDeleteArticle = proxyDeleteArticle;
window.proxyPurchaseArticle = proxyPurchaseArticle;