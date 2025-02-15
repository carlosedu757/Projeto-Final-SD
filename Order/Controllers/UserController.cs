using Microsoft.AspNetCore.Mvc;
using Order.Data;

using Order.Models;

namespace Order.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserDb UserDb;
    public UserController(UserDb userDb)
    {
        UserDb = userDb;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsersAsync()
    {
        var users = await UserDb.GetUsersAsync();
        
        return Ok(users);
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserResponse>> GetUserById([FromRoute] int id)
    {
        var user = await UserDb.GetUserById(id);
        
        return Ok(new UserResponse
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
        });
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        var result = await UserDb.CreateUserAsync(user);
        
        return Created("api/User", result);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<User>> UpdateUser([FromRoute] int id, [FromBody] EditUser editUser)
    {
        try
        {
            User user = await UserDb.UpdateUserById(id, editUser);

            return Ok(user);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            
            return StatusCode(500);
        }
    }
}