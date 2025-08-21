// NUEVO COMPONENTE PARA ESTA ACTIVIDAD
class WCContactForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <!-- Los estilos se incluyen dentro del Shadow DOM para encapsulación -->
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/5/w3.css">

            <style>
                /* Ocultamos el botón 'Send' original del formulario,
                   porque la acción de envío la manejará el modal que lo contiene. */
                .w3-button.w3-section {
                    display: none;
                }
            </style>

            <!-- Código del form de la pag -->
            <form class="w3-container w3-card-4 w3-light-grey w3-text-blue w3-margin">
                <h2 class="w3-center">Contact Us</h2>
                
                <div class="w3-row w3-section">
                    <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-user"></i></div>
                    <div class="w3-rest">
                        <input class="w3-input w3-border" name="first" type="text" placeholder="First Name">
                    </div>
                </div>

                <div class="w3-row w3-section">
                    <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-user"></i></div>
                    <div class="w3-rest">
                        <input class="w3-input w3-border" name="last" type="text" placeholder="Last Name">
                    </div>
                </div>

                <div class="w3-row w3-section">
                    <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-envelope-o"></i></div>
                    <div class="w3-rest">
                        <input class="w3-input w3-border" name="email" type="text" placeholder="Email">
                    </div>
                </div>

                <div class="w3-row w3-section">
                    <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-phone"></i></div>
                    <div class="w3-rest">
                        <input class="w3-input w3-border" name="phone" type="text" placeholder="Phone">
                    </div>
                </div>

                <div class="w3-row w3-section">
                    <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-pencil"></i></div>
                    <div class="w3-rest">
                        <input class="w3-input w3-border" name="message" type="text" placeholder="Message">
                    </div>
                </div>

                <p class="w3-center">
                    <button class="w3-button w3-section w3-blue w3-ripple"> Send </button>
                </p>
            </form>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

// Definimos
customElements.define('wc-contact-form', WCContactForm);

