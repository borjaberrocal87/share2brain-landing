# Share2Brain Landing - Docker

## Requisitos

- Docker Desktop o Docker Engine
- Docker Compose v2

## Inicio Rápido

### 1. Construir y ejecutar

```bash
# Construir la imagen y levantar el contenedor
docker compose up -d --build
```

### 2. Verificar

```bash
# Ver el estado de los contenedores
docker compose ps

# Ver logs
docker compose logs -f
```

### 3. Acceder

Abrir en el navegador:
- http://localhost:8080

## Comandos Útiles

```bash
# Detener el contenedor
docker compose down

# Reconstruir (si hay cambios)
docker compose up -d --build

# Ver logs en tiempo real
docker compose logs -f landing

# Entrar al contenedor
docker exec -it share2brain-landing sh

# Limpiar imágenes no usadas
docker image prune
```

## Variables de Entorno

El contenedor no requiere variables de entorno ya que es un sitio estático.

## Persistencia

Los datos se sirven directamente desde el contenedor. No hay persistencia de datos ya que es un sitio estático.

## Producción

Para producción, se recomienda:

1. Usar un dominio personalizado
2. Configurar HTTPS (Let's Encrypt via Caddy)
3. Usar un CDN global
4. Configurar monitoreo

## Arquitectura

```
┌─────────────────────────────────┐
│  Nginx (Alpine)                 │
│  ├── Archivos estáticos         │
│  ├── Gzip compression           │
│  ├── Security headers           │
│  └── Cache configuration        │
└─────────────────────────────────┘
```

## Solución de Problemas

### El contenedor no inicia

```bash
# Ver logs detallados
docker compose logs landing

# Verificar si el puerto está en uso
lsof -i :8080
```

### Error de build

```bash
# Limpiar cache de Docker
docker system prune -a

# Reconstruir desde cero
docker compose build --no-cache
```

### No se accede desde fuera

```bash
# Verificar que el contenedor está corriendo
docker compose ps

# Verificar el puerto
netstat -an | grep 8080
```
