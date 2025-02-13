namespace ClienteAPI.Models
{
    public class Pedido
    {
        public int Id { get; set; }
        public string? Descricao { get; set; } // Adiciona '?' para permitir valores nulos
        public double Valor { get; set; }
        public string Status { get; set; } = "Pendente";
    }
}
