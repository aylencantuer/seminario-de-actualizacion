// web-component.js
export class DataTableExample extends HTMLElement {
  constructor() {
    super();
    
    this.requestBtn = document.createElement('button');
    this.requestBtn.innerText = 'Efectuar solicitud';
    
    this.dataTable = document.createElement('table');

    this.appendChild(this.requestBtn);
    this.appendChild(this.dataTable);
  }

  createTable(data) {
    this.dataTable.innerHTML = '';
    
    if (data.length === 0) {
      this.dataTable.innerText = 'No hay datos para mostrar.';
      return;
    }

    // Crear la fila de encabezado de la tabla (<thead>) con HTMLTableElement.
    const tableHead = this.dataTable.createTHead();
    const headerRow = tableHead.insertRow();
    
    // Obtener las claves de los objetos para usarlas como encabezados
    const headers = Object.keys(data[0]);

    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.innerText = headerText.toUpperCase();
      headerRow.appendChild(th);
    });

    const tableBody = this.dataTable.createTBody();

    // Iterar sobre los datos y crear las filas y celdas
    data.forEach(item => {
      const row = tableBody.insertRow();
      headers.forEach(header => {
        const cell = row.insertCell();
        cell.innerText = item[header];
      });
    });
  }
  
  // Método para manejar la petición con la API Fetch
  onRequestButtonClick() {
    this.requestBtn.disabled = true;

    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la red.');
        }
        return response.json(); // La respuesta es un array de objetos
      })
      .then(data => {
        this.createTable(data); // Llamar a la función que crea la tabla
      })
      .catch(error => {
        console.error('Hubo un problema con la operación de Fetch: ', error);
        this.dataTable.innerText = 'Error al cargar los datos.';
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
customElements.define('x-data-table', DataTableExample);