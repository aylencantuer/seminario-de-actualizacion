// SessionStorageManager.js

/**
 * Guarda datos en sessionStorage.
 * Los datos se serializan a JSON antes de ser almacenados.
 *  {string} key La clave bajo la cual se almacenarán los datos.
 *  {any} data Los datos a almacenar.
 */

export function saveToSessionStorage(key, data) {
  try {
    // Convertir el Map a un objeto plano antes de serializar
    let dataToStore = data;
    if (data instanceof Map) {
      dataToStore = Object.fromEntries(data);
    }
    const serializedData = JSON.stringify(dataToStore);
    sessionStorage.setItem(key, serializedData);
    console.log(`Datos guardados en sessionStorage con la clave: ${key}`);
  } catch (error) {
    console.error(`Error al guardar en sessionStorage para la clave ${key}:`, error);
  }
}

/**
 * Carga datos desde sessionStorage.
 * Los datos se deserializan de JSON y se convierten de nuevo a Map si son de tipo authData.
 *  {string} key La clave de los datos a recuperar.
 *  {boolean} isMap Indica si los datos esperados deben ser un Map (true para authData).
 *  {any | null} Los datos recuperados, o null si no se encuentran o hay un error.
 */
export function loadFromSessionStorage(key, isMap = false) {
  try {
    const serializedData = sessionStorage.getItem(key);
    if (serializedData === null) {
      console.log(`No se encontraron datos en sessionStorage para la clave: ${key}`);
      return null;
    }
    const parsedData = JSON.parse(serializedData);

    // Si esperamos un Map (ej. para authData), convertir el objeto plano de nuevo a Map
    if (isMap) {
      return new Map(Object.entries(parsedData));
    }
    return parsedData;
  } catch (error) {
    console.error(`Error al cargar desde sessionStorage para la clave ${key}:`, error);
    return null;
  }
}