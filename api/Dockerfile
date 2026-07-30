# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências para compilação e tipagem
COPY package.json package-lock.json ./
RUN npm ci

# Copiar restante dos arquivos e compilar
COPY . .
RUN npm run build

# Stage 2: Tester
FROM builder AS tester
RUN npm run test:run

# Stage 3: Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Instalar apenas dependências de produção
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copiar build gerado do stage anterior
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
