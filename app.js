// Importa Express y otras dependencias
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Crea una instancia de Express
const app = express();

// Configura el puerto en el que se ejecutará el servidor

const PORT = process.env.PORT || 8080;


// Configura body-parser para analizar las solicitudes HTTP
//Lo que hace es que analiza el cuerpo de la solicitud y extrae los datos útiles, como los datos enviados en un formulario HTML o los datos JSON enviados en una solicitud AJAX, y los convierte en un objeto JavaScript que podemos utilizar fácilmente en nuestro servidor Express.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configura la conexión a la base de datos MySQL
const db = mysql.createConnection({
  'host': 'localhost',
  'user': 'root',
  'password': '',
  'database': 'mydb' ,
  'port': '3000'

});

// Conexión a la base de datos
db.connect(err => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
  });
  
  // Ruta para obtener todos los contactos
  app.get('/contactos', (req, res) => {
    connection.query('SELECT * FROM contactos', (err, results) => {
      if (err) {
        console.error('Error al obtener los contactos:', err);
        res.status(500).send('Error al obtener los contactos');
        return;
      }
      res.json(results);
    });
  });
  
  // Ruta para obtener un contacto por su ID
  app.get('/contactos/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM contactos WHERE id = ?', id, (err, results) => {
      if (err) {
        console.error('Error al obtener el contacto:', err);
        res.status(500).send('Error al obtener el contacto');
        return;
      }
      if (results.length === 0) {
        res.status(404).send('Contacto no encontrado');
        return;
      }
      res.json(results[0]);
    });
  });
  
  // Ruta para agregar un nuevo contacto
  app.post('/contactos', (req, res) => {
    const nuevoContacto = req.body;
    connection.query('INSERT INTO contactos SET ?', nuevoContacto, (err, results) => {
      if (err) {
        console.error('Error al agregar el contacto:', err);
        res.status(500).send('Error al agregar el contacto');
        return;
      }
      res.status(201).send('Contacto agregado exitosamente');
    });
  });
  
  // Ruta para actualizar un contacto existente
  app.put('/contactos/:id', (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;
    connection.query('UPDATE contactos SET ? WHERE id = ?', [datosActualizados, id], (err, results) => {
      if (err) {
        console.error('Error al actualizar el contacto:', err);
        res.status(500).send('Error al actualizar el contacto');
        return;
      }
      res.status(200).send('Contacto actualizado exitosamente');
    });
  });
  
  // Ruta para eliminar un contacto
  app.delete('/contactos/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM contactos WHERE id = ?', id, (err, results) => {
      if (err) {
        console.error('Error al eliminar el contacto:', err);
        res.status(500).send('Error al eliminar el contacto');
        return;
      }
      res.status(200).send('Contacto eliminado exitosamente');
    });
  });
  
// Inicia el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});