const express = require('express');
const pool = require('./database');
const { reportQuery } = require('./middlewares');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(reportQuery); // Middleware para reportes

// Importar rutas
const joyasRouter = require('./routes/joyas');
app.use('/joyas', joyasRouter);

// Al final de index.js (antes de app.listen)
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


