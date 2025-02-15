# Use uma imagem oficial do Go como base
FROM golang:1.20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo go.mod e go.sum
COPY go.mod go.sum ./

# Baixa as dependências
RUN go mod download

# Copia o restante do código
COPY . .

RUN protoc --go_out=. --go-grpc_out=. internal/grpc/notification.proto

# Compila o aplicativo
RUN CGO_ENABLED=0 GOOS=linux go build -o notification-server ./cmd/server/main.go

# Cria a imagem final
FROM alpine:latest

# Define o diretório de trabalho
WORKDIR /root/

# Copia o binário compilado
COPY --from=builder /app/notification-server .

# Expõe a porta do servidor GRPC
EXPOSE 50051

# Comando para executar o servidor
CMD ["./notification-server"]