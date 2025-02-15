using System.ComponentModel.DataAnnotations.Schema;

namespace Order.Models;

[Table("tb_pedidos")]
public class Order : BaseEntity
{
    public string Description { get; set; }
    public decimal Price { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.CREATED;
    public DateTime Date { get; set; } = DateTime.Now;
    public int UserId { get; set; }
}