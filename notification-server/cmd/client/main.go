package main

import (
	"context"
	"log"

	pb "notification-server/internal/grpc"

	"google.golang.org/grpc"
)

func main() {

	conn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Falha ao conectar ao servidor: %v", err)
	}
	defer conn.Close()

	client := pb.NewNotificationServiceClient(conn)

	orderID := int32(15)
	response, err := client.GetOrderStatus(context.Background(), &pb.OrderRequest{OrderId: orderID})
	if err != nil {
		log.Fatalf("Erro ao chamar GetOrderStatus: %v", err)
	}

	log.Printf("Status do pedido: %s", response.Status)
}
