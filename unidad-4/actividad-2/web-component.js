// web-component.js
export class FetchAPIExample extends HTMLElement {
  constructor() {
    super();

    // Creación de los elementos del DOM
    this.requestBtn = document.createElement('button');
    this.clearBtn = document.createElement('button');
    this.outputTextArea = document.createElement('textarea');

    // Asignación de texto
    this.requestBtn.innerText = 'Efectuar petición';
    this.clearBtn.innerText = 'Limpiar';

    // Añadir los elementos al componente
    this.appendChild(this.requestBtn);
    this.appendChild(this.clearBtn);
    this.appendChild(this.outputTextArea);
  }

  onClearButtonClick(event) {
    this.outputTextArea.value = '';
  }

  // Método para manejar la petición con la API Fetch
  onRequestButtonClick(event) {
    // Deshabilitar el botón para evitar múltiples peticiones
    this.requestBtn.disabled = true;

    // Realizar la petición
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => {
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error('Error en la respuesta de la red: ' + response.statusText);
        }
        return response.json(); // Convertir la respuesta a JSON
      })
      .then(data => {
        // Insertar los datos en el textarea después de la conversión
        this.outputTextArea.value = JSON.stringify(data, null, 2); // Usar `JSON.stringify` con indentación para mejor legibilidad
      })
      .catch(error => {
        console.error('Hubo un problema con la operación de Fetch: ', error);
        this.outputTextArea.value = 'Error: ' + error.message;
      })
      .finally(() => {
        this.requestBtn.disabled = false;
      });//Con fetch, la funcionalidad de deshabilitar el botón está directamente ligada al ciclo de vida de la petición HTTP, lo cual es lo ideal.
  }

  //Se llama cuando el componente es conectado al DOM
  connectedCallback() {
    //Event listeners
    this.requestBtn.onclick = this.onRequestButtonClick.bind(this);
    this.clearBtn.onclick = this.onClearButtonClick.bind(this);
  }

  disconnectedCallback() {
    // Limpiar los event listeners para evitar fugas de memoria
    this.requestBtn.onclick = null;
    this.clearBtn.onclick = null;
  }
}

// Definir el Web Component
customElements.define('x-request', FetchAPIExample);


