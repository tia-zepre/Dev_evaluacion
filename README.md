# InnovatechChile — EP3 DevOps

Tienda de tecnología estilo PC Factory. Proyecto para evaluación parcial N°3.

## Estructura

```
proyecto-innovatech/
├── innovatech-frontend/   → HTML + nginx
│   ├── index.html
│   ├── Dockerfile
│   └── nginx.conf
├── innovatech-backend/    → Node.js + Express
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml     → para prueba local
```

## Probar localmente

```bash
docker-compose up --build
```

- Frontend: http://localhost
- Backend:  http://localhost:3000/api/productos

## Endpoints del backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /health | Health check para ECS |
| GET | /api/productos | Lista todos los productos |
| GET | /api/productos?categoria=notebook | Filtra por categoría |
| GET | /api/productos/:id | Obtiene un producto por ID |

## Build y push a ECR

```bash
# Backend
docker build -t innovatech-backend ./innovatech-backend
docker tag innovatech-backend:latest <TU_ECR_URL>/innovatech-backend:latest
docker push <TU_ECR_URL>/innovatech-backend:latest

# Frontend
docker build -t innovatech-frontend ./innovatech-frontend
docker tag innovatech-frontend:latest <TU_ECR_URL>/innovatech-frontend:latest
docker push <TU_ECR_URL>/innovatech-frontend:latest
```
