using System.Security.Cryptography;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Order.Data;

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
            Console.WriteLine($"Error fetching orders: {e.Message}");
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
}