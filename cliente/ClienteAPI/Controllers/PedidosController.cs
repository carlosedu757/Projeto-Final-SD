using Microsoft.AspNetCore.Mvc;
using ClienteAPI.Models;
using System.Collections.Generic;
using System.Linq;

namespace ClienteAPI.Controllers
{
    [ApiController]
    [Route("api/pedidos")]
    public class PedidosController : ControllerBase
    {
        private static List<Pedido> pedidos = new List<Pedido>();
        private static int nextId = 1;

        // Criar um novo pedido
        [HttpPost]
        public IActionResult CriarPedido([FromBody] Pedido pedido)
        {
            pedido.Id = nextId++;
            pedidos.Add(pedido);
            return CreatedAtAction(nameof(ConsultarPedido), new { id = pedido.Id }, pedido);
        }

        // Consultar todos os pedidos
        [HttpGet]
        public IActionResult ListarPedidos()
        {
            return Ok(pedidos);
        }

        // Consultar um pedido específico
        [HttpGet("{id}")]
        public IActionResult ConsultarPedido(int id)
        {
            var pedido = pedidos.FirstOrDefault(p => p.Id == id);
            if (pedido == null)
            {
                return NotFound();
            }
            return Ok(pedido);
        }
    }
}
