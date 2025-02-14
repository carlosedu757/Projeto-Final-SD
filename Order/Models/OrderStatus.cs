using System.ComponentModel;

namespace Order.Models;

public enum OrderStatus
{
    [Description("Criado")]
    CREATED = 0,
    [Description("Aguardando Pagamento")]
    WAITING_PAYMENT,
    [Description("Aprovado")]
    APROVED,
    [Description("Pagamento recusado")]
    DENIED
}