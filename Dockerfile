FROM alpine:latest

# Instalar certificados SSL y herramientas
RUN apk --no-cache add ca-certificates unzip

# Descargar PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v0.22.9/pocketbase_0.22.9_linux_amd64.zip /tmp/pb.zip

# Descomprimir e instalar
RUN unzip /tmp/pb.zip -d /usr/local/bin/ && \
    chmod +x /usr/local/bin/pocketbase

# Crear directorio para datos
RUN mkdir -p /app/pb_data

WORKDIR /app

# Exponer puerto
EXPOSE 8080

# Comando para ejecutar PocketBase
CMD ["/usr/local/bin/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/app/pb_data"]