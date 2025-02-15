package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"

	pb "notification-server/internal/grpc"

	"google.golang.org/grpc"

	orderstatus "notification-server/internal/enum"

	_ "github.com/microsoft/go-mssqldb"
)

type server struct {
	pb.UnimplementedNotificationServiceServer
	db *sql.DB
}

func (s *server) GetOrderStatus(ctx context.Context, req *pb.OrderRequest) (*pb.OrderResponse, error) {
	orderID := req.GetOrderId()

	var rawStatus int
	err := s.db.QueryRow("SELECT OrderStatus FROM tb_pedidos WHERE id = @p1", sql.Named("p1", orderID)).Scan(&rawStatus)
	if err != nil {
		return nil, fmt.Errorf("erro ao buscar status do pedido: %v", err)
	}

	status, err := orderstatus.ParseStatus(rawStatus)
	if err != nil {
		return nil, fmt.Errorf("erro ao converter status: %v", err)
	}

	description := status.GetDescription()

	_, err = s.db.Exec("INSERT INTO tb_pedidosstatushistoric (Description, PedidoId, OrderStatus) VALUES (@p1, @p2, @p3)", sql.Named("p1", description), sql.Named("p2", orderID), sql.Named("p3", status))
	if err != nil {
		return nil, fmt.Errorf("erro ao salvar historico do pedido: %v", err)
	}

	return &pb.OrderResponse{Status: "Pedido com status " + description + " foi notificado."}, nil
}

func main() {
	connString := "server=tcp:pedidos-server.database.windows.net,1433;user id=miguel.farias;password=-3L4)jH42@=;database=db_pedidos;encrypt=true;trustservercertificate=false;connection timeout=30;"
	db, err := sql.Open("sqlserver", connString)
	if err != nil {
		log.Fatalf("Erro ao conectar ao banco de dados: %v", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatalf("Erro ao testar conexão com o banco de dados: %v", err)
	}

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
