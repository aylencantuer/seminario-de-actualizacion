// IndexedDBManager.js

const db_name = 'MyApplicationDB';
const db_version = 1;
const store_article = 'article'; 

let dbInstance = null; 


function onDbOpenSuccess(event) {
    dbInstance = event.target.result;
    console.log("IndexedDB: Base de datos abierta con éxito.");
    // Resolver la promesa de openDatabase
    if (this && typeof this.resolvePromise === 'function') {
        this.resolvePromise(dbInstance);
    }
}


function onDbOpenError(event) {
    console.error("IndexedDB: Error al abrir la base de datos:", event.target.errorCode);
    // Rechazar la promesa de openDatabase
    if (this && typeof this.rejectPromise === 'function') {
        this.rejectPromise(new Error("Error al abrir IndexedDB"));
    }
}

// Manejador de actualización de la base de datos.
function onDbUpgradeNeeded(event) {
    const db = event.target.result;
    console.log("IndexedDB: onupgradeneeded - Creando/actualizando almacenes de objetos.");

    // Crear el object store para article si no existe
    if (!db.objectStoreNames.contains(store_article)) {
        db.createObjectStore(store_article, { keyPath: 'id' });
    }
}


function openDatabase() {
    return new Promise(function(resolve, reject) {
        if (dbInstance) {
            resolve(dbInstance);
            return;
        }

        const request = indexedDB.open(db_name, db_version);

        //bind para pasar resolve/reject a los manejadores externos
        request.onsuccess = onDbOpenSuccess.bind({ resolvePromise: resolve, rejectPromise: reject });
        request.onerror = onDbOpenError.bind({ resolvePromise: resolve, rejectPromise: reject });
        request.onupgradeneeded = onDbUpgradeNeeded;
    });
}

function onSaveTransactionComplete(event) {
    console.log(`IndexedDB: Artículos guardados para la clave: ${this.key}`);
    this.resolvePromise();
}

function onSaveTransactionError(event) {
    console.error(`IndexedDB: Error en la transacción al guardar artículos:`, event.target.error);
    this.rejectPromise(new Error(`Error al guardar en IndexedDB para ${this.key}`));
}


function onSaveTransactionAbort(event) {
    console.warn(`IndexedDB: Transacción abortada al guardar artículos:`, event.target.error);
    this.rejectPromise(new Error(`Transacción abortada al guardar en IndexedDB para ${this.key}`));
}


function onClearStoreSuccess(event) {
    //this.articlesData y this.store provienen del bind
    this.articlesData.forEach(function(article) { 
        this.store.put(article); // 'put' inserta o actualiza
    }.bind(this)); //Aseguramos que 'this' dentro del forEach sea el contexto correcto
}

function onClearStoreError(event) {
    console.error(`IndexedDB: Error al limpiar el store de artículos:`, event.target.error);
    this.rejectPromise(new Error(`Error al limpiar el store en IndexedDB para ${this.key}`));
}

export async function saveToIndexedDB(key, articlesData) {
    if (key !== 'articles') {
        console.warn(`IndexedDBManager: saveToIndexedDB solo soporta la clave 'articles'. Se ignorará la clave '${key}'.`);
        return;
    }

    const db = await openDatabase();
    const transaction = db.transaction(store_article, 'readwrite');
    const store = transaction.objectStore(store_article);

    return new Promise(function(resolve, reject) { 
        //bind para pasar el contexto y las variables necesarias a los manejadores
        const context = { key: key, resolvePromise: resolve, rejectPromise: reject, articlesData: articlesData, store: store };
        
        transaction.oncomplete = onSaveTransactionComplete.bind(context);
        transaction.onerror = onSaveTransactionError.bind(context);
        transaction.onabort = onSaveTransactionAbort.bind(context);

        const clearRequest = store.clear();
        clearRequest.onsuccess = onClearStoreSuccess.bind(context);
        clearRequest.onerror = onClearStoreError.bind(context);
    });
}

function onLoadGetAllSuccess(event) {
    const data = event.target.result;
    if (data && data.length > 0) {
        console.log(`IndexedDB: Artículos cargados para la clave: ${this.key}`);
        this.resolvePromise(data);
    } else {
        console.log(`IndexedDB: No se encontraron artículos para la clave: ${this.key}`);
        this.resolvePromise(null);
    }
}

function onLoadGetAllError(event) {
    console.error(`IndexedDB: Error al cargar artículos:`, event.target.error);
    this.rejectPromise(new Error(`Error al cargar desde IndexedDB para ${this.key}`));
}

export async function loadFromIndexedDB(key) {
    if (key !== 'articles') {
        console.warn(`IndexedDBManager: loadFromIndexedDB solo soporta la clave 'articles'. Se ignorará la clave '${key}'.`);
        return null;
    }

    const db = await openDatabase();
    const transaction = db.transaction(store_article, 'readonly');
    const store = transaction.objectStore(store_article);

    return new Promise(function(resolve, reject) { 
        const getAllRequest = store.getAll();
        const context = { key: key, resolvePromise: resolve, rejectPromise: reject };

        getAllRequest.onsuccess = onLoadGetAllSuccess.bind(context);
        getAllRequest.onerror = onLoadGetAllError.bind(context);
    });
}

// Llama a openDatabase una vez para inicializar la conexión
// Esto asegurará que la DB esté lista antes de que se necesite
openDatabase().catch(function(error) { // Función tradicional para el catch
    console.error("Error inicializando IndexedDB:", error);
});