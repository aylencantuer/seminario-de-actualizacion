// web-component.js
export class UserTableExample extends HTMLElement {
  constructor() {
    super();
    
    this.requestBtn = document.createElement('button');
    this.requestBtn.innerText = 'Efectuar solicitud';
    this.requestBtn.className = 'w3-button w3-dark-grey'; // Estilo de W3.CSS para el botón

    this.userTable = document.createElement('table');
    this.userTable.className = 'w3-table w3-bordered w3-card'; // Estilo de W3.CSS para la tabla

    this.appendChild(this.requestBtn);
    this.appendChild(this.userTable);
  

  // Definir el orden y los nombres de los encabezados
    this.headersConfig = {
      id: 'ID',
      username: 'Usuario',
      name: 'Nombre',
      email: 'Correo',
      website: 'Web',
      phone: 'Celular'
    };
  }

  createUserTable(data) {
    this.userTable.innerHTML = '';
    
    if (data.length === 0) {
      this.userTable.innerText = 'No hay usuarios para mostrar.';
      return;
    }

    // Crear la fila de encabezado de la tabla (<thead>) con HTMLTableElement.
    const tableHead = this.userTable.createTHead();
    const headerRow = tableHead.insertRow();
    headerRow.className = 'w3-black'; // Color del encabezado
    
    // Crear las celdas de encabezado con los nombres alternativos
    const headerKeys = Object.keys(this.headersConfig);
    headerKeys.forEach(key => {
      const th = document.createElement('th');
      th.innerText = this.headersConfig[key];
      headerRow.appendChild(th);
    });


    const tableBody = this.userTable.createTBody();

    // Iterar sobre los datos y crear las filas
    data.forEach(user => {
      const row = tableBody.insertRow();
      row.className = 'w3-hover-blue'; // Activar, resaltar al pasar el mouse

      // Crear las celdas de datos, filtrando y ordenando
      headerKeys.forEach(key => {
        const cell = row.insertCell();
        
        // Formato especial para el email
        if (key === 'email') {
          const emailTag = document.createElement('span');
          emailTag.className = 'w3-tag w3-round w3-light-grey'; // Estilo de "tag" de W3.CSS
          emailTag.innerText = user[key];
          cell.appendChild(emailTag);
        } else {
          cell.innerText = user[key];
        }
      });
    });
  }
  
  // Método para manejar la petición con la API Fetch
  onRequestButtonClick() {
    this.requestBtn.disabled = true;

    fetch('https://jsonplaceholder.typicode.com/users/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la red.');
        }
        return response.json(); // La respuesta es un array de objetos
      })
      .then(data => {
        this.createUserTable(data); // Llamar a la función que crea la tabla
      })
      .catch(error => {
        console.error('Hubo un problema con la operación de Fetch: ', error);
        this.userTable.innerText = 'Error al cargar los datos.';
      })
      .finally(() => {
        this.requestBtn.disabled = false;
      });
  }
  
  connectedCallback() {
    this.requestBtn.onclick = this.onRequestButtonClick.bind(this);
  }
  
  disconnectedCallback() {
    this.requestBtn.onclick = null;
  }
}

// Definir el Web Component
customElements.define('x-user-table', UserTableExample);