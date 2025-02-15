namespace Order.Models;

public class CreateOrder
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int UserId { get; set; }
}
