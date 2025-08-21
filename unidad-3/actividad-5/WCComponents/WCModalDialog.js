// REUTILIZADO (no se necesitaron cambios, mismo archivo.)
class WCModalDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .modal-overlay {
          display: none;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.5);
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background-color: #fefefe;
          margin: auto;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
          max-width: 500px;
          border-radius: 8px;
          box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        .close-button {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }
        .close-button:hover,
        .close-button:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
        .modal-footer {
            padding-top: 15px;
            text-align: right;
        }
        .modal-footer button {
            padding: 10px 20px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-size: 16px;
            margin-left: 10px;
        }
        #acceptBtn {
            background-color: #007bff;
            color: white;
        }
        #cancelBtn {
            background-color: #6c757d;
            color: white;
        }
      </style>
      <div id="modalOverlay" class="modal-overlay">
        <div class="modal-content">
          <span id="closeBtn" class="close-button">&times;</span>
          <slot name="content"></slot>
          <div class="modal-footer">
            <button id="cancelBtn">Cancelar</button>
            <button id="acceptBtn">Aceptar</button>
          </div>
        </div>
      </div>
    `;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() {
    this.shadowRoot.getElementById('acceptBtn').addEventListener('click', this._onAccept.bind(this));
    this.shadowRoot.getElementById('cancelBtn').addEventListener('click', this._onCancel.bind(this));
    this.shadowRoot.getElementById('closeBtn').addEventListener('click', this._onCancel.bind(this));
  }
  open() {
    this.shadowRoot.getElementById('modalOverlay').style.display = 'flex';
  }
  close() {
    this.shadowRoot.getElementById('modalOverlay').style.display = 'none';
  }
  _onAccept() {
    this.dispatchEvent(new CustomEvent('accept', { bubbles: true, composed: true }));
    this.close();
  }
  _onCancel() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
    this.close();
  }
}
customElements.define('wc-modal-dialog', WCModalDialog);
