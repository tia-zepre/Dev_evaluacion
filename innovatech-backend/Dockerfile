# ---- Etapa 1: build (instala dependencias) ----
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY index.js .

# ---- Etapa 2: runtime (imagen final minimalista) ----
FROM node:18-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Usuario no-root por buenas prácticas de seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.js ./index.js
COPY --from=builder /app/package.json ./package.json

USER appuser

EXPOSE 3000

CMD ["node", "index.js"]
