# InnovatechChile — EP3 DevOps

Tienda de tecnología estilo PC Factory. Proyecto para evaluación parcial N°3.

---

## 📂 Estructura del Proyecto

```text
proyecto-innovatech/
├── innovatech-frontend/     → HTML + nginx
│   ├── index.html
│   ├── Dockerfile
│   └── nginx.conf
├── innovatech-backend/      → Node.js + Express
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── k8s/                     → Manifiestos de Kubernetes (EKS)
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── backend-hpa.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── frontend-hpa.yaml
├── .github/workflows/
│   └── deploy.yml           → Pipeline CI/CD (build + push a ECR + deploy a EKS)
└── docker-compose.yml       → Para prueba local
## 🚀 Probar Localmente
bashdocker-compose up --build

# Accesos directos:
Frontend: http://localhost
Backend:  http://localhost:3000/api/productos

## 🧠 Endpoints del Backend
Método	Ruta	Descripción
GET	/health	Health check para EKS (readiness/liveness probes)
GET	/api/productos	Lista todos los productos
GET	/api/productos?categoria=notebook	Filtra los productos por categoría
GET	/api/productos/:id	Obtiene un producto específico por ID

## 📦 Build y Push a Amazon ECR
Backend
docker build -t innovatech-backend ./innovatech-backend
docker tag innovatech-backend:latest <TU_ECR_URL>/innovatech-backend:latest
docker push <TU_ECR_URL>/innovatech-backend:latest

# Frontend
docker build -t innovatech-frontend ./innovatech-frontend
docker tag innovatech-frontend:latest <TU_ECR_URL>/innovatech-frontend:latest
docker push <TU_ECR_URL>/innovatech-frontend:latest

## ☸️ Despliegue en EKS
El frontend se comunica con el backend a través de un proxy interno en nginx (/api/ → Service innovatech-backend), por lo que no depende de IPs públicas ni requiere configuración de CORS.

⚠️ Nota: Reemplazar <ACCOUNT_ID> en k8s/backend-deployment.yaml y k8s/frontend-deployment.yaml antes del primer apply.

# Aplicar todos los manifiestos en el clúster
kubectl apply -f k8s/

# Verificar la URL pública asignada al frontend
kubectl get svc innovatech-frontend

## 🔄 CI/CD (GitHub Actions)
El pipeline (.github/workflows/deploy.yml) se ejecuta manualmente (workflow_dispatch) o automáticamente al hacer un push a la rama main. Construye y sube las imágenes a ECR, y actualiza los Deployments en el clúster EKS innovatech-eks.

El pipeline (.github/workflows/deploy.yml) se ejecuta manualmente (workflow_dispatch) o al hacer push a main. Construye y sube las imágenes a ECR, y actualiza los Deployments en el clúster EKS innovatech-eks.

Requiere estos GitHub Secrets (credenciales del AWS Academy Lab, expiran cada 2-4h):

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN


## 📈 Autoscaling (HPA)
Cada Deployment (frontend y backend) tiene un HPA (k8s/*-hpa.yaml) asignado que escala de manera automática por uso de CPU (cuando supera el 50% de target).

💡 Requisito: Requiere tener el componente metrics-server activo y corriendo en el clúster.
Autoscaling


