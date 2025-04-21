const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/', async (req, res) => {
  try {
    const { limits = 10, page = 1, order_by = 'id_ASC' } = req.query;
    const [field, direction] = order_by.split('_');
    const offset = (page - 1) * limits;

    const query = `
      SELECT * FROM inventario 
      ORDER BY ${field} ${direction}
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(query, [limits, offset]);

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