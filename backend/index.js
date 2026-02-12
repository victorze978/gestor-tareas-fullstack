// index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Importante para Angular
app.use(express.json()); // Para recibir JSON del frontend

// Configuración de la base de datos
// NOTA: En un proyecto real, esto iría en un archivo separado (ej: db.js)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conectado a MySQL exitosamente');
});

// Ruta de prueba (Endpoint)
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});

// Iniciar servidor
const PORT = 3000;

// Ruta para CREAR una nueva tarea
app.post('/tasks', (req, res) => {
    const { title, description } = req.body; // Se reciben los datos del frontend
    
    const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
    
    db.query(query, [title, description], (err, result) => {
        if (err) {
            console.error('Error al insertar:', err);
            res.status(500).send('Error en el servidor');
        } else {
            res.json({ id: result.insertId, message: 'Tarea creada con éxito' });
        }
    });
});

// ELIMINAR una tarea
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Tarea eliminada' });
    });
});

// ACTUALIZAR una tarea (Editar texto o cambiar estado de completado)
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, is_completed } = req.body;
    const query = 'UPDATE tasks SET title = ?, description = ?, is_completed = ? WHERE id = ?';
    db.query(query, [title, description, is_completed, id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json({ message: 'Tarea actualizada' });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});