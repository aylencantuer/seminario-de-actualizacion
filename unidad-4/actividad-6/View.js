import { Controller } from './controller.js';
import { Model } from './model.js';

/**
 * Clase View: Es el Web Component. Encargada de renderizar la UI y capturar eventos.
 * Solo se encarga de mostrar y notificar al Controlador, no tiene lógica de negocio.
 * Cumple con OCP: la lógica de renderizado es genérica para la estructura de la tabla.
 */
export class View extends HTMLElement {
    constructor() {
        super();
        
        // Inicialización de Model y Controller
        this.model = new Model(); 
        this.controller = new Controller(this, this.model);
        
        // 1. Crear elementos DOM
        this.requestBtn = document.createElement('button');
        this.requestBtn.innerText = 'Efectuar solicitud';
        this.requestBtn.className = 'w3-button w3-dark-grey';

        this.userTable = document.createElement('table');
        this.userTable.className = 'w3-table w3-bordered w3-card';

        // 2. Crear Modal Component (Asume que WCModalDialog.js fue cargado)
        this.userModal = document.createElement('wc-modal-dialog');
        this.userModal.id = 'userDataModal';
        
        this.modalContentContainer = document.createElement('div');
        this.modalContentContainer.slot = 'content'; 
        this.userModal.appendChild(this.modalContentContainer);

        // 3. Adjuntar al DOM del Web Component
        this.appendChild(this.requestBtn);
        this.appendChild(this.userTable);
        this.appendChild(this.userModal);
    }
    
    // --- Métodos de Enlace (Binding) ---
    // La View notifica al Controller qué evento ocurrió.
    
    connectedCallback() {
        this.controller.init();         
        this.requestBtn.onclick = () => this.controller.handleLoadUsers(); //delega al Controller
    }
    
    disconnectedCallback() {
        this.requestBtn.onclick = null;
    }

    /**
     * Enlaza el evento de click de fila al método del controlador.
     * @param {Function} handler - El método del controlador a ejecutar.
     */
    bindRowClick(handler) {
        // Esta función se llama en el Controller.init() o durante la renderización de la tabla.
        // Aquí solo la definimos, la asignación real ocurre en renderTable.
        this.rowClickHandler = handler; 
    }

    bindLoadUsers(handler) {
        this.requestBtn.onclick = handler;
    }

    // --- Métodos de Actualización (Renderizado) ---
    // La View es instruida por el Controller.

    setButtonLoading(isLoading) {
        this.requestBtn.disabled = isLoading;
        this.requestBtn.innerText = isLoading ? 'Cargando...' : 'Efectuar solicitud';
    }

    clearTable() {
        this.userTable.innerHTML = '';
    }
    
    showLoadingMessage(message) {
        this.userTable.innerHTML = `<p class="w3-text-gray w3-center w3-padding-16">${message}</p>`;
    }

    showErrorMessage(message) {
        this.userTable.innerHTML = `<p class="w3-text-red w3-center w3-padding-16">${message}</p>`;
    }
    
    /**
     * Renderiza la tabla de datos a partir de datos ya procesados.
     * @param {Array<Object>} data - Datos ya filtrados y listos para mostrar.
     * @param {Object} headersConfig - Configuración de encabezados {key: title}.
     */
    renderTable(data, headersConfig) {
        this.userTable.innerHTML = ''; // Limpiar la tabla
        
        const tableHead = this.userTable.createTHead();
        const headerRow = tableHead.insertRow();
        headerRow.className = 'w3-black'; 
        
        const headerKeys = Object.keys(headersConfig);
        headerKeys.forEach(key => {
            const th = document.createElement('th');
            th.innerText = headersConfig[key];
            headerRow.appendChild(th);
        });

        const tableBody = this.userTable.createTBody();

        data.forEach(user => {
            const row = tableBody.insertRow();
            row.className = 'w3-hover-blue';
            row.style.cursor = 'pointer';
            
            // Adjuntar ID y el manejador del Controller
            row.dataset.id = user.id; 
            row.onclick = () => this.rowClickHandler(user.id); // Llama al método del Controller con el ID

            // Creación de celdas
            headerKeys.forEach(key => {
                const cell = row.insertCell();
                if (key === 'email') {
                    const emailTag = document.createElement('span');
                    emailTag.className = 'w3-tag w3-round w3-light-grey';
                    emailTag.innerText = user[key];
                    cell.appendChild(emailTag);
                } else {
                    cell.innerText = user[key];
                }
            });
        });
    }
    
    showModalLoading(userId) {
        this.modalContentContainer.innerHTML = `<h3 class="w3-center">Cargando detalles para el Usuario ${userId}...</h3>`;
        this.userModal.open();
    }
    
    renderModalContent(contentHTML) {
        this.modalContentContainer.innerHTML = contentHTML;
    }
}

// Registrar el Web Component para que <x-user-table> esté disponible.
if (!customElements.get('x-user-table')) {
    customElements.define('x-user-table', View);
}
