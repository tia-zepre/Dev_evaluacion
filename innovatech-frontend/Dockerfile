# ---- Etapa 1: build (prepara los archivos estáticos) ----
FROM alpine:3.19 AS builder

WORKDIR /site

COPY index.html .

# ---- Etapa 2: runtime (nginx minimalista) ----
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /site/index.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
