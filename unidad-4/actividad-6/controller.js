

import { Model } from './model.js';
/**
 * Clase Controller: Encargada de gestionar la lógica de la aplicación.
 * Responde a eventos de la Vista, solicita datos al Modelo y actualiza la Vista.
 */
export class Controller {
    /**
     * @param {View} viewInstance - Instancia de la clase View.
     * @param {Model} modelInstance - de la clase Model.
     */
    constructor(viewInstance, modelInstance) {
        this.view = viewInstance;
        this.model = modelInstance;

        // Definición de las columnas que queremos mostrar y sus títulos (Lógica de Negocio)
        this.columnsConfig = {
            id: 'ID',
            username: 'Usuario',
            name: 'Nombre',
            email: 'Correo',
            website: 'Web',
            phone: 'Celular'
        };
    }

    init() {
        // Enlazar los eventos de la Vista con los métodos del Controlador
        this.view.bindLoadUsers(this.handleLoadUsers.bind(this));
        this.view.bindRowClick(this.handleRowClick.bind(this));
        console.log('Controller: Inicializado. Listo para recibir eventos de la View.');
    }

    // --- Manejadores de Eventos de la Vista ---

    async handleLoadUsers() {
        this.view.setButtonLoading(true); // Informar a la View que debe deshabilitar el botón
        this.view.clearTable();
        this.view.showLoadingMessage("Cargando lista de usuarios...");

        try {
            const rawUsers = await this.model.getUsers();
            
            // 1. Procesamiento de datos (Filtrado y Mapeo) - Lógica del Controlador
            const processedData = rawUsers.map(user => {
                const row = {};
                Object.keys(this.columnsConfig).forEach(key => {
                    row[key] = user[key];
                });
                return row;
            });

            // 2. Instruir a la View para renderizar la tabla con los datos procesados
            this.view.renderTable(processedData, this.columnsConfig);

        } catch (error) {
            this.view.showErrorMessage('Error al cargar la lista de usuarios.');
        } finally {
            this.view.setButtonLoading(false); // Informar a la View que debe habilitar el botón
        }
    }

    async handleRowClick(userId) {
        this.view.showModalLoading(userId); // Muestra el modal en estado de carga

        try {
            const userDetails = await this.model.getUserDetails(userId);
            
            // 1. Procesamiento de datos detallados (Formateo) - Lógica del Controlador
            const modalContent = this.formatUserDetails(userDetails);

            // 2. Instruir a la View para actualizar el contenido del modal
            this.view.renderModalContent(modalContent);
        } catch (error) {
            this.view.renderModalContent(`<h3 class="w3-center w3-text-red">Error al obtener el detalle del usuario ${userId}.</h3><p>${error.message}</p>`);
        }
    }

    // --- Lógica de Formateo y Mapeo (Business Logic) ---

    formatUserDetails(user) {
        // Aquí se define cómo se extrae y se formatea la información detallada
        return `
            <h3 class="w3-border-bottom w3-padding-16 w3-text-blue">Detalles de ${user.name} (ID: ${user.id})</h3>
            
            <div class="w3-container w3-margin-top">
                <h4><i class="fa fa-map-marker"></i> Dirección</h4>
                <p><strong>Calle:</strong> ${user.address.street}, ${user.address.suite}</p>
                <p><strong>Ciudad:</strong> ${user.address.city}</p>
                <p><strong>Código Postal:</strong> ${user.address.zipcode}</p>
            </div>
            
            <div class="w3-container w3-margin-top">
                <h4><i class="fa fa-building"></i> Compañía</h4>
                <p><strong>Nombre:</strong> ${user.company.name}</p>
                <p><strong>Eslogan:</strong> "${user.company.catchPhrase}"</p>
                <p><strong>Área de Negocio:</strong> ${user.company.bs}</p>
            </div>
        `;
    }
}
