package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"

	pb "notification-server/internal/grpc"

	"google.golang.org/grpc"
)

type server struct {
	pb.UnimplementedNotificationServiceServer
	db *sql.DB
}

func (s *server) GetOrderStatus(ctx context.Context, req *pb.OrderRequest) (*pb.OrderResponse, error) {
	orderID := req.GetOrderId()

	// Consulta o status do pedido no banco de dados
	var status string
	err := s.db.QueryRow("SELECT status FROM pedidosStatusHistoric WHERE id = @p1", sql.Named("p1", orderID)).Scan(&status)
	if err != nil {
		return nil, fmt.Errorf("erro ao buscar status do pedido: %v", err)
	}

	// Salva o status na tabela de histórico
	_, err = s.db.Exec("INSERT INTO pedidosStatusHistoric (id, status) VALUES (@p1, @p2)", sql.Named("p1", orderID), sql.Named("p2", status))
	if err != nil {
		return nil, fmt.Errorf("erro ao salvar status do pedido: %v", err)
	}

	return &pb.OrderResponse{Status: status}, nil
}

func main() {
	// Configuração da conexão com o banco de dados
	connString := "server=tcp:pedidos-server.database.windows.net,1433;user id=miguel.farias;password=-3L4)jH42@=;database=db_pedidos;encrypt=true;trustservercertificate=false;connection timeout=30;"
	db, err := sql.Open("sqlserver", connString)
	if err != nil {
		log.Fatalf("Erro ao conectar ao banco de dados: %v", err)
	}
	defer db.Close()

	// Testa a conexão com o banco de dados
	err = db.Ping()
	if err != nil {
		log.Fatalf("Erro ao testar conexão com o banco de dados: %v", err)
	}

	// Inicia o servidor GRPC
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Falha ao escutar na porta 50051: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterNotificationServiceServer(s, &server{db: db})

	log.Println("Servidor de notificações iniciado na porta 50051...")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Falha ao servir: %v", err)
	}
}
