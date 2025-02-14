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
            RegisterLog.Register("GetOrders", e.Message);
            
            return StatusCode(500);
        }
    }
    
    [HttpGet("{customerId:int}")]
    public async Task<ActionResult<List<Order>>> GetOrdersByCustomer([FromRoute] int customerId)
    {
        try
        {
            var orders = await OrderDb.GetOrdersByCustomerId(customerId);

            return Ok(orders.ToList());
        }
        catch (Exception e)
        {
            RegisterLog.Register("GetOrders", e.Message);
            
            return StatusCode(500);
        }
    }
}