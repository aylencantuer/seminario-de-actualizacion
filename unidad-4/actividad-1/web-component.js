export class XMLHttpRequestExample extends HTMLElement {
  constructor() {
    super();
    
    this.requestBtn = document.createElement('button');
    this.clearBtn = document.createElement('button');
    this.outputTextArea = document.createElement('textarea');

    this.requestBtn.innerText = 'Efectuar petición';
    this.clearBtn.innerText = 'Limpiar';
    
    this.appendChild(this.requestBtn);
    this.appendChild(this.clearBtn);
    this.appendChild(this.outputTextArea);
  }
  
  onClearButtonClick(event) {
    this.outputTextArea.value = '';
  }
  
  onRequestButtonClick(event) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function(event) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.outputTextArea.value = xhr.responseText;
      } else {
        console.error(xhr.statusText);
      }
      
      // Simulación de delay para la UI
      setTimeout(function() { this.requestBtn.disabled = false; }.bind(this), 2000);
    }.bind(this);

    xhr.onerror = function(event) {
      console.error(xhr.statusText);
      this.requestBtn.disabled = false;
    }.bind(this);
    
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/1');
    xhr.send();      
    this.requestBtn.disabled = true;
  }
  
  connectedCallback() {
    this.requestBtn.onclick = this.onRequestButtonClick.bind(this);
    this.clearBtn.onclick = this.onClearButtonClick.bind(this);
  }
  
  disconnectedCallback() {
    this.requestBtn.onclick = null;
    this.clearBtn.onclick = null;
  }
}

customElements.define('x-request', XMLHttpRequestExample);