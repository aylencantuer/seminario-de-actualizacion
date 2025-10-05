// web-component.js
export class UserTableExample extends HTMLElement {
  constructor() {
    super();
    
    // 1. Elementos principales (Botón y Tabla)
    this.requestBtn = document.createElement('button');
    this.requestBtn.innerText = 'Efectuar solicitud';
    this.requestBtn.className = 'w3-button w3-dark-grey';

    this.userTable = document.createElement('table');
    this.userTable.className = 'w3-table w3-bordered w3-card';

    // 2. Elementos del Diálogo Modal (Usando el WCModalDialog de la Unidad 3)
    this.userModal = document.createElement('wc-modal-dialog');
    this.userModal.id = 'userDataModal';
    
    // Contenedor para los detalles dinámicos. Usará el slot="content" del modal.
    this.modalContentContainer = document.createElement('div');
    this.modalContentContainer.slot = 'content'; 
    this.modalContentContainer.innerHTML = '<h3 class="w3-center">Detalles del Usuario</h3><p>Haga clic en una fila para ver los detalles.</p>';

    this.userModal.appendChild(this.modalContentContainer);

    // Adjuntar todos los elementos al componente principal
    this.appendChild(this.requestBtn);
    this.appendChild(this.userTable);
    this.appendChild(this.userModal);
    
    // 3. Configuración de encabezados
    this.headersConfig = {
      id: 'ID',
      username: 'Usuario',
      name: 'Nombre',
      email: 'Correo',
      website: 'Web',
      phone: 'Celular'
    };
  }

  // Función auxiliar para generar el HTML del contenido del modal (address, company)
  renderModalContent(user) {
    // Generamos el HTML con los datos requeridos (address y company)
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
  
  // Lógica para manejar el click en la fila, Fetch dinámico y mostrar el modal
  handleRowClick(event) {
    // Usamos .closest('tr') para asegurarnos de que el evento viene de una fila
    const clickedRow = event.target.closest('tr');
    if (!clickedRow || !clickedRow.dataset.id) return; // Si no hay ID, salir

    const userId = clickedRow.dataset.id;
    
    // 1. Mostrar estado de carga y abrir el modal
    this.modalContentContainer.innerHTML = `<h3 class="w3-center">Cargando detalles para el Usuario ${userId}...</h3>`;
    this.userModal.open(); 

    // 2. Realizar la petición Fetch dinámica
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los detalles del usuario: ' + userId);
        }
        return response.json();
      })
      .then(user => {
        // 3. Renderizar y mostrar la información
        this.modalContentContainer.innerHTML = this.renderModalContent(user);
      })
      .catch(error => {
        console.error('Error en la petición de detalles:', error);
        this.modalContentContainer.innerHTML = `<h3 class="w3-center">Error al cargar los detalles.</h3><p>${error.message}</p>`;
      });
  }

  // Método de creación de la tabla (con row.onclick y data-id)
  createUserTable(data) {
    this.userTable.innerHTML = '';
    
    if (data.length === 0) {
      this.userTable.innerText = 'No hay usuarios para mostrar.';
      return;
    }

    const tableHead = this.userTable.createTHead();
    const headerRow = tableHead.insertRow();
    headerRow.className = 'w3-black'; // Encabezado de color
    
    const headerKeys = Object.keys(this.headersConfig);
    headerKeys.forEach(key => {
      const th = document.createElement('th');
      th.innerText = this.headersConfig[key];
      headerRow.appendChild(th);
    });

    const tableBody = this.userTable.createTBody();

    data.forEach(user => {
      const row = tableBody.insertRow();
      row.className = 'w3-hover-blue';
      row.style.cursor = 'pointer'; 
      
      // *** Clave Actividad 5: Adjuntar el ID del usuario a la fila (data-id) ***
      row.dataset.id = user.id; 
      
      // *** Clave Actividad 5: Adjuntar el listener de clic a la fila con bind(this) ***
      row.onclick = this.handleRowClick.bind(this); 

      // Creación de celdas (misma lógica que Actividad 4)
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
  
  // Petición inicial (sin cambios)
  onRequestButtonClick() {
    this.requestBtn.disabled = true;
    this.userTable.innerHTML = '';

    fetch('https://jsonplaceholder.typicode.com/users/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la red.');
        }
        return response.json();
      })
      .then(data => {
        this.createUserTable(data);
      })
      .catch(error => {
        console.error('Hubo un problema con la operación de Fetch: ', error);
        this.userTable.innerText = 'Error al cargar los datos.';
      })
      .finally(() => {
        this.requestBtn.disabled = false;
      });
  }
  
  // Ciclo de vida: conectado al DOM
  connectedCallback() {
    this.requestBtn.onclick = this.onRequestButtonClick.bind(this);
    
    // Opcional: escuchar los eventos del modal para fines de log/acción
    this.userModal.addEventListener('accept', () => {
        console.log('El modal de detalle fue cerrado por ACEPTAR.');
    });
    this.userModal.addEventListener('cancel', () => {
        console.log('El modal de detalle fue cerrado por CANCELAR o botón X.');
    });
  }
  
  // Ciclo de vida: desconectado del DOM
  disconnectedCallback() {
    this.requestBtn.onclick = null;
    // La limpieza de los listeners del modal la hace el propio WCModalDialog
  }
}

// Definir el Web Component
customElements.define('x-user-table', UserTableExample);