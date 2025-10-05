Dividir UserTableExample (que estaba haciendo todo) en tres clases bien definidas, siguiendo el principio de "Una capa == una clase == un archivo .js".

Análisis SOLID y comentarios sobre refactorización en siguiendo la arquitectura MVC.

Análisis de Principios SOLID en Actividad 5:
La clase UserTableExample de la Actividad 5 violaba los siguientes principios de diseño:

1. Principio de Responsabilidad Única (SRP) - Violado

La clase UserTableExample era responsable de:

    Presentación (View): Crear la estructura HTML (<table>, <button>, <wc-modal-dialog>), aplicar estilos W3.CSS y renderizar filas/celdas.

    Lógica de Control (Controller): Manejar eventos de clic del botón y las filas (onRequestButtonClick, handleRowClick).

    Lógica de Negocio/Datos (Model): Ejecutar las dos peticiones fetch (/users/ y /users/X), manejar la respuesta JSON y gestionar los errores de red.

        Efecto de la Violación: Cualquier cambio en la URL del endpoint (Modelo), en el diseño de la tabla (Vista), o en la respuesta de un evento (Controlador), obliga a modificar esta única clase.

2. Principio Abierto/Cerrado (OCP) - Violado
El método createUserTable está cerrado a la extensión y abierto a la modificación. Si quisiéramos mostrar, por ejemplo, los datos de los usuarios en una lista en lugar de una tabla, tendríamos que modificar la clase UserTableExample existente, lo cual viola el OCP.

3. Principio de Inversión de Dependencias (DIP) - Violado
El módulo de alto nivel (UserTableExample - el Web Component) dependía directamente de detalles de bajo nivel (la implementación del fetch y las URLs específicas de jsonplaceholder.typicode.com). Esto hace que el código no sea flexible a cambios en la fuente de datos.


Refactorización a Arquitectura MVC:
Para resolver estos problemas, dividiremos la aplicación en tres entidades con responsabilidades únicas:

1. Model.js: Contiene solo la lógica de acceso a datos (Fetch API).
 Model.js (Responsabilidad: Datos)
    User Data Model

2. view.js: Contiene solo la lógica de la Interfaz de Usuario (DOM, W3.CSS, eventos GUI).
 Controller.js (Responsabilidad: Lógica de Aplicación)
    User Table Controller


3. Controller.js: Actúa como intermediario, manejando la lógica de la aplicación y coordinando la View y el Model.
 view.js (Responsabilidad: Interfaz de Usuario/Web Component)
  User Table View


--------------------------------------------------------

Con esta refactorización, hemos pasado todas las responsabilidades del Web Component a las capas MVC correctas:

. view.js: Solo se preocupa por la presentación y los eventos del DOM.
. Model.js: Solo se preocupa por la obtención de datos (fetch).
. Controller.js: Se encarga de la lógica de aplicación (filtrar, mapear, coordinar) y media entre la View y el Model, cumpliendo ahora con los principios SOLID .

