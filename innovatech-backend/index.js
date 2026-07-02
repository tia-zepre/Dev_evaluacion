const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const productos = [
  { id:1, nombre:"Notebook Gamer Pro 16", categoria:"notebook",   precio:1299990, badge:"new",  icon:"💻" },
  { id:2, nombre:"PC Escritorio Core i7",  categoria:"pc",         precio:899990,  badge:"",     icon:"🖥️" },
  { id:3, nombre:"Placa madre Z790",        categoria:"componente", precio:349990,  badge:"sale", icon:"🔧" },
  { id:4, nombre:"RTX 4070 Ti 12GB",        categoria:"componente", precio:799990,  badge:"",     icon:"🎮" },
  { id:5, nombre:"Monitor 27\" 4K IPS",     categoria:"periferico", precio:449990,  badge:"",     icon:"🖥️" },
  { id:6, nombre:"Notebook Ultrabook 14",   categoria:"notebook",   precio:749990,  badge:"sale", icon:"💻" },
  { id:7, nombre:"Teclado Mecánico RGB",    categoria:"periferico", precio:89990,   badge:"",     icon:"⌨️" },
  { id:8, nombre:"RAM DDR5 32GB",           categoria:"componente", precio:129990,  badge:"new",  icon:"💾" },
];

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/productos', (req, res) => {
  const { categoria } = req.query;
  if (categoria) {
    const filtrados = productos.filter(p => p.categoria === categoria);
    return res.json(filtrados);
  }
  res.json(productos);
});

app.get('/api/productos/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

app.listen(PORT, () => {
  console.log(`Backend InnovatechChile corriendo en puerto ${PORT}`);
});
