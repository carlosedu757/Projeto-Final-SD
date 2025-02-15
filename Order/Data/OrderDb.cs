using System.Data;
using System.Security.Cryptography;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Order.Logs;

namespace Order.Data;

using global::Models;
using Models;

public class OrderDb
{
    private readonly string ConnectionString;

    public OrderDb(IConfiguration configuration)
    {
        ConnectionString = configuration.GetConnectionString("Azure");
    }
    
    public async Task<List<Order>> GetOrders()
    {
        const string sql = "SELECT * FROM tb_pedidos";

        try
        {
            await using var connection = new SqlConnection(ConnectionString);
            
            var orders = await connection.QueryAsync<Order>(sql);
            
            return orders.ToList();
        }
        catch (Exception e)
        {
            RegisterLog.RegisterError("GetOrders", "", e.Message);
            
            throw;
        }
    }

    public async Task<Order> GetOrderByIdAsync(int id)
    {
        var sql = "SELECT * FROM tb_pedidos WHERE Id = @id";

        try
        {
            using var connection = new SqlConnection(ConnectionString);
            
            var result = await connection.QuerySingleAsync<Order>(sql, new { Id = id });

            if (result is null)
            {
                throw new Exception($"No order with id {id} found");
            }
            
            return result;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<IEnumerable<Order>> GetOrdersByCustomerId(int customerId)
    {
        const string sql = "SELECT * FROM tb_pedidos p WHERE p.UserId = @UserId ORDER BY p.Date DESC ";

        try
        {
            await using var connection = new SqlConnection(ConnectionString);
            
            var orders = await connection.QueryAsync<Order>(sql, new { UserId = customerId });
            
            return orders;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<Order> CreateOrderAsync(Order order)
    {
        var sql = "INSERT INTO tb_pedidos(Name, Description, Price, UserId, OrderStatus) VALUES(@name, @description, @price, @userId, @orderStatus)";

        try
        {
            using var connection = new SqlConnection(ConnectionString);
            
            var orderId = await connection.ExecuteScalarAsync<int>(sql, new
            {
                Name = order.Name,
                Description = order.Description,
                Price = order.Price,
                UserId = order.UserId,
                OrderStatus = order.Status
            });
            
            order.Id = orderId;
            
            return order;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<List<OrderStatusHistory>> GetOrderStatusHistoryAsync(int orderId)
    {
        const string sql = @"
        SELECT 
            Id,
            Description,
            PedidoId,
            OrderStatus,
            Date AS Timestamp
        FROM 
            tb_pedidosstatushistoric
        WHERE 
            PedidoId = @PedidoId
        ORDER BY 
            Date ASC"; // Ordena pelo tempo para mostrar a sequência correta

        try
        {
            await using var connection = new SqlConnection(ConnectionString);

            var statusHistory = await connection.QueryAsync<OrderStatusHistory>(sql, new { PedidoId = orderId });

            return statusHistory.ToList();
        }
        catch (Exception e)
        {
            RegisterLog.RegisterError("GetOrderStatusHistoryAsync", $"Erro ao buscar histórico de status para o pedido com ID {orderId}", e.Message);
            throw;
        }
    }
}