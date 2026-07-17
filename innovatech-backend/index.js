const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- Configuración de conexión a la BBDD (desde variables de entorno) ---
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
};

let pool;

// Datos semilla: se usan solo si la tabla está vacía (primer arranque)
const productosSeed = [
  { nombre: "Notebook Gamer Pro 16", categoria: "notebook", precio: 1299990, badge: "new", icon: "💻" },
  { nombre: "PC Escritorio Core i7", categoria: "pc", precio: 899990, badge: "", icon: "🖥️" },
  { nombre: "Placa madre Z790", categoria: "componente", precio: 349990, badge: "sale", icon: "🔧" },
  { nombre: "RTX 4070 Ti 12GB", categoria: "componente", precio: 799990, badge: "", icon: "🎮" },
  { nombre: "Monitor 27\" 4K IPS", categoria: "periferico", precio: 449990, badge: "", icon: "🖥️" },
  { nombre: "Notebook Ultrabook 14", categoria: "notebook", precio: 749990, badge: "sale", icon: "💻" },
  { nombre: "Teclado Mecánico RGB", categoria: "periferico", precio: 89990, badge: "", icon: "⌨️" },
  { nombre: "RAM DDR5 32GB", categoria: "componente", precio: 129990, badge: "new", icon: "💾" },
];

async function initDb() {
  pool = mysql.createPool(dbConfig);

  // Reintentos: la BBDD (contenedor local o RDS) puede tardar unos segundos en estar lista
  let retries = 10;
  while (retries > 0) {
    try {
      const conn = await pool.getConnection();
      conn.release();
      break;
    } catch (err) {
      retries--;
      console.log(`No se pudo conectar a la BBDD, reintentando... (${retries} intentos restantes)`);
      await new Promise((r) => setTimeout(r, 5000));
      if (retries === 0) throw err;
    }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      categoria VARCHAR(100) NOT NULL,
      precio INT NOT NULL,
      badge VARCHAR(50) DEFAULT '',
      icon VARCHAR(10) DEFAULT ''
    )
  `);

  const [rows] = await pool.query('SELECT COUNT(*) as total FROM productos');
  if (rows[0].total === 0) {
    console.log('Tabla productos vacía, insertando datos iniciales...');
    for (const p of productosSeed) {
      await pool.query(
        'INSERT INTO productos (nombre, categoria, precio, badge, icon) VALUES (?, ?, ?, ?, ?)',
        [p.nombre, p.categoria, p.precio, p.badge, p.icon]
      );
    }
  }

  console.log('Conexión a BBDD establecida y tabla productos lista.');
}

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected', timestamp: new Date().toISOString() });
  }
});

app.get('/api/productos', async (req, res) => {
  try {
    const { categoria } = req.query;
    let rows;
    if (categoria) {
      [rows] = await pool.query('SELECT * FROM productos WHERE categoria = ?', [categoria]);
    } else {
      [rows] = await pool.query('SELECT * FROM productos');
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

app.get('/api/productos/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al consultar producto' });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend InnovatechChile corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo inicializar la BBDD, la aplicación no arrancará:', err.message);
    process.exit(1);
  });
