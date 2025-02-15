using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Order.Data;

namespace Order.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly UserDb UserDb;
    
    public LoginController(UserDb userDb)
    {
        UserDb = userDb;
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        try
        {
            var user = await UserDb.GetUserByEmailAsync(loginRequest.Email);
            
            if (user == null) return BadRequest();

            var password = loginRequest.Password;

            var isPasswordMatch = BCrypt.Net.BCrypt.Verify(password, user.Password);

            if (isPasswordMatch)
            {
                return Ok(user);
            }

            return BadRequest(new
            {
                ErrorMessage = "Invalid username or password"
            });
        }
        catch (Exception e)
        {
            return BadRequest(new
            {
                ErrorMessage = "Invalid username or password"
            });
        }
    }
    
}