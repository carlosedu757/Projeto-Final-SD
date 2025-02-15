using System.Data;
using Microsoft.Data.SqlClient;
using Dapper;
using Order.Logs;

namespace Order.Data;

using Models;

public class UserDb
{
    private readonly string ConnectionString;
    private SqlTransaction transaction;

    public UserDb(IConfiguration configuration)
    {
        ConnectionString = configuration
            .GetConnectionString("Azure") ?? throw new Exception("Conection String is invalid");
    }
    
    public async Task<IEnumerable<User>> GetUsersAsync()
    {
        const string sql = "SELECT * FROM tb_usuario";

        try
        {
            await using var connection = new SqlConnection(ConnectionString);
            
            var users = await connection.QueryAsync<User>(sql);
            
            return users;
        }
        catch (Exception e)
        {
            Console.WriteLine($"Error fetching orders: {e.Message}");
            throw;
        }
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        const string sql = "SELECT * FROM tb_usuario u WHERE u.Email = @Email";

        try
        {
            await using var connection = new SqlConnection(ConnectionString);
            
            var user = await connection.QuerySingleAsync<User>(sql, new { Email = email });
            
            if (user is null)
            {
                throw new Exception($"User with email {email} does not exist");
            }

            return user;
        }
        catch (Exception e)
        {
            RegisterLog.RegisterError("GetUserByEmailAsync", "Email not found", e.Message);
            throw;
        }
    }

    public async Task<User> InsertUserAsync(User user)
    {
        var sql = @"INSERT INTO tb_usuario(Name, Email, PasswordHash) 
                        VALUES(@Name, @Email, @PasswordHash)";
        try
        {
            using var connection = new SqlConnection(ConnectionString);

            var result = await connection.ExecuteScalarAsync<User>(sql, new
            {
                user.Name,
                user.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password)
            }) ?? null;

            if (result != null)
            {
                user.Id = result.Id;
            }

            return user;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<User> CreateUserAsync(User user)
    {
        var sql = "INSERT INTO tb_usuario(name, email, passwordhash) VALUES (@name, @email, @PasswordHash)";
        
        try
        {
            await using var connection = new SqlConnection(ConnectionString);
            
            transaction = connection.BeginTransaction();
            
            var result = await connection.ExecuteScalarAsync<User>(sql, new
            {
                user.Name,
                user.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.Password)
            });

            if (result is null)
            {
                throw new Exception($"User {user.Email} cannot be created");
            }

            return result;
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            RegisterLog.RegisterError("CreateUserAsync", "User could not be created", e.Message);
            throw;
        }
    }

    public async Task<User> UpdateUserById(int id, EditUser editUser)
    {
        var sql = "UPDATE tb_usuario SET Name = @Name, Email = @Email, Password = @Password WHERE Id = @id";
        
        try
        {
            await using var connection = new SqlConnection(ConnectionString);
            
            connection.Open();
            
            transaction = connection.BeginTransaction();
            
            var rows = await connection.ExecuteAsync(sql, new
            {
                id,
                editUser.Name,
                editUser.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(editUser.Password)
            }, transaction, commandTimeout: 30,CommandType.Text);

            if (rows > 1)
            {
                await transaction.RollbackAsync();
                
                throw new Exception("User could not be updated");
            }
            
            await transaction.CommitAsync();
            
            return new User
            {
                Name = editUser.Name,
                Email = editUser.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(editUser.Password)
            };
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            
            RegisterLog.RegisterError("UpdateUserByEmail", 
                "Quantidade de linhas alteradas maior que 1", 
                e.Message);
            
            throw;
        }
    }
}