using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Order.Models;

public class User : BaseEntity
{
    public string Email { get; set; }
    public string Password { get; set; }
}