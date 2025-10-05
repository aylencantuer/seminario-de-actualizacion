/*
   Clase Model: Encargada de la lógica de negocio y acceso a datos.
 */
export class Model {
    constructor() {
        this.API_URL = 'https://jsonplaceholder.typicode.com';
    }

    /**
     * Obtiene la lista completa de usuarios.
     * @returns {Promise<Array>} Promesa que resuelve con el array de objetos de usuarios.
     */
    async getUsers() {
        console.log('Model: Solicitando lista de usuarios...');
        try {
            const response = await fetch(`${this.API_URL}/users/`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo obtener la lista de usuarios.`);
            }
            return response.json();
        } catch (error) {
            console.error('Model Error (getUsers):', error);
            throw error; // Propagar el error al controlador
        }
    }

    /**
     * Obtiene los detalles de un usuario específico por ID.
     * @param {string} userId - El ID del usuario.
     * @returns {Promise<Object>} Promesa que resuelve con el objeto detallado del usuario.
     */
    async getUserDetails(userId) {
        console.log(`Model: Solicitando detalles del usuario ${userId}...`);
        try {
            const response = await fetch(`${this.API_URL}/users/${userId}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: No se pudo obtener el detalle del usuario ${userId}.`);
            }
            return response.json();
        } catch (error) {
            console.error('Model Error (getUserDetails):', error);
            throw error;
        }
    }
}
