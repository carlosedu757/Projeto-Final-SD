namespace Models;

public class OrderStatusHistory
{
    public int Id { get; set; }
    public string Description { get; set; }
    public int PedidoId { get; set; } // ID do pedido ao qual o status pertence
    public int OrderStatus { get; set; } // Valor numérico do status (enum)
    public DateTime Date { get; set; } // Data em que o status foi registrado
}