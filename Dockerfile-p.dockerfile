# Stage 1: Build
FROM node:16-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
# Stage 2: Final image
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app .
RUN npm run build
CMD ["npm", "start"]