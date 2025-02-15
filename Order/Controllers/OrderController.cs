using Microsoft.AspNetCore.Mvc;
using Order.Data;
using Order.Logs;

namespace Order.Controllers;

using Models;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    public OrderDb OrderDb { get; set; }

    public OrderController(OrderDb orderDb)
    {
        OrderDb = orderDb;
    }

    [HttpGet]
    public async Task<ActionResult<List<Order>>> GetOrders()
    {
        try
        {
            var orders = await OrderDb.GetOrders();

            return Ok(orders);
        }
        catch (Exception e)
        {
            RegisterLog.RegisterError("GetOrders", "", e.Message);
            
            return StatusCode(500);
        }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetOrderByIdAsync([FromRoute] int id)
    {
        var order = await OrderDb.GetOrderByIdAsync(id);
        
        return Ok(order);
    }
    
    [HttpGet("customer/{customerId:int}")]
    public async Task<ActionResult<List<Order>>> GetOrdersByCustomer([FromRoute] int customerId)
    {
        try
        {
            var orders = await OrderDb.GetOrdersByCustomerId(customerId);

            return Ok(orders.ToList());
        }
        catch (Exception e)
        {
            RegisterLog.RegisterError("GetOrders", "", e.Message);
            
            return StatusCode(500);
        }
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrderAsync([FromBody] CreateOrder order)
    {
        try
        {
            var newOrder = new Order
            {
                Name = order.Name,
                Description = order.Description,
                Price = order.Price,
                UserId = order.UserId
            };
            
             newOrder = await OrderDb.CreateOrderAsync(newOrder);
            
            return Created($"api/order/GetOrderByIdAsync/{newOrder.Id}", newOrder);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}