# Etapa de construção
FROM golang:1.23-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Instala o Protocol Buffers Compiler (protoc) e ferramentas Go
RUN apk add --no-cache protobuf protobuf-dev git && \
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest && \
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Adiciona os binários dos plugins ao PATH
ENV PATH="/go/bin:${PATH}"

# Copia os arquivos go.mod e go.sum
COPY go.mod go.sum ./

# Baixa as dependências
RUN go mod download

# Copia o restante do código
COPY . .

# Cria o diretório de saída para os arquivos gerados
RUN mkdir -p internal/grpc

# Gera os arquivos .pb.go (se necessário)
RUN protoc --go_out=./internal/grpc --go-grpc_out=./internal/grpc internal/grpc/notification.proto

# Compila o aplicativo
RUN CGO_ENABLED=0 GOOS=linux go build -o notification-server ./cmd/server/main.go

# Etapa final
FROM alpine:latest

# Define o diretório de trabalho
WORKDIR /root/

# Copia o binário compilado
COPY --from=builder /app/notification-server .

# Expõe a porta do servidor GRPC
EXPOSE 50051

# Comando para executar o servidor
CMD ["./notification-server"]