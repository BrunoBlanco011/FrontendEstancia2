# Build: compila el SPA con Vite. VITE_API_URL se recibe como build arg porque
# Vite "hornea" las variables VITE_* en el bundle en tiempo de build, no de runtime.
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Runtime: sirve los estaticos generados con nginx. Este contenedor no se
# publica al exterior directamente; el nginx "gateway" del backend lo proxea.
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
