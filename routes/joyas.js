const express = require('express');
const router = express.Router();
const pool = require('../database');

// Lista blanca de campos y direcciones permitidos
const VALID_FIELDS = ['id', 'nombre', 'categoria', 'metal', 'precio', 'stock'];
const VALID_DIRECTIONS = ['ASC', 'DESC'];

router.get('/', async (req, res) => {
  try {
    const { limits = 10, page = 1, order_by = 'id_ASC' } = req.query;
    const [field, direction] = order_by.split('_');

    // ===== REQUERIMIENTO 1B - VALIDACIÓN DE SEGURIDAD =====
    if (!VALID_FIELDS.includes(field) || !VALID_DIRECTIONS.includes(direction)) {
      return res.status(400).json({ 
        error: 'Parámetros de orden inválidos',
        fields_allowed: VALID_FIELDS,
        directions_allowed: VALID_DIRECTIONS
      });
    }
    // =====================================================

    const offset = (page - 1) * limits;
    const query = {
      text: `SELECT * FROM inventario ORDER BY ${field} ${direction} LIMIT $1 OFFSET $2`,
      values: [limits, offset]
    };

    const { rows } = await pool.query(query);

    // Estructura HATEOAS
    const results = rows.map((item) => ({
      ...item,
      links: [
        { rel: 'self', href: `/joyas/${item.id}` },
        { rel: 'filtros', href: `/joyas/filtros?categoria=${item.categoria}` },
      ],
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/filtros', async (req, res) => {
  try {
    const { precio_min, precio_max, categoria, metal } = req.query;
    let query = 'SELECT * FROM inventario WHERE 1=1';
    const params = [];

    if (precio_min) {
      params.push(precio_min);
      query += ` AND precio >= $${params.length}`;
    }
    if (precio_max) {
      params.push(precio_max);
      query += ` AND precio <= $${params.length}`;
    }
    if (categoria) {
      params.push(categoria);
      query += ` AND categoria = $${params.length}`;
    }
    if (metal) {
      params.push(metal);
      query += ` AND metal = $${params.length}`;
    }

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

