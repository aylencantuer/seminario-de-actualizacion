import './WCComponents/WCModalDialog.js';
import './WCComponents/WCContactForm.js';

window.addEventListener('DOMContentLoaded', () => {

    // Obtenemos referencias al botón y al modal
    const openModalButton = document.getElementById('openModalBtn');
    const modal = document.getElementById('contactModal');

    // Lógica para:

    //Abrir
    openModalButton.addEventListener('click', () => {
        modal.open();
    });

    //manejar ACEPTACIÓN del modal
    modal.addEventListener('accept', () => {
        // Simulamos el envío del formulario con el mensaje exacto solicitado
        window.alert('Su consulta fue recibida, a la brevedad lo contactaremos.');
        console.log('El usuario envió el formulario.');
    });

    //manejar la CANCELACIÓN
    modal.addEventListener('cancel', () => {
        console.log('El usuario canceló el formulario de contacto.');
    });

});
