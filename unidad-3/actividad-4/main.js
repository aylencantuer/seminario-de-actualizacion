import './WCComponents/WCModalDialog.js';

// Esperamos a que todo el contenido del DOM esté cargado para empezar a trabajar
window.addEventListener('DOMContentLoaded', () => {

    // Obtenemos referencias al botón y a nuestro componente modal
    const openModalButton = document.getElementById('openModalBtn');
    const modal = document.getElementById('myModal');

    // 1. Lógica para ABRIR el modal
    openModalButton.addEventListener('click', () => {
        modal.open();
    });

    // 2. Lógica para REACCIONAR a los eventos del modal
    modal.addEventListener('accept', () => {
        console.log('El usuario hizo clic en ACEPTAR.');
        alert('Acción Aceptada!');
    });

    modal.addEventListener('cancel', () => {
        console.log('El usuario hizo clic en CANCELAR o cerró el diálogo.');
        alert('Acción Cancelada.');
    });

});
