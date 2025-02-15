package orderstatus

import "fmt"

// OrderStatus representa os possíveis estados de um pedido.
type OrderStatus int

const (
    CREATED OrderStatus = iota
    WAITING_PAYMENT            
    APPROVED                   
    DENIED                     
)

// Mapa que associa cada status à sua descrição.
var statusDescriptions = map[OrderStatus]string{
    CREATED:         "Criado",
    WAITING_PAYMENT: "Aguardando Pagamento",
    APPROVED:        "Aprovado",
    DENIED:          "Pagamento Recusado",
}

// GetDescription retorna a descrição textual de um OrderStatus.
func (s OrderStatus) GetDescription() string {
    if description, exists := statusDescriptions[s]; exists {
        return description
    }
    return "Status Desconhecido"
}

// ParseStatus converte um valor inteiro para OrderStatus.
// Retorna um erro se o valor for inválido.
func ParseStatus(value int) (OrderStatus, error) {
    for status := range statusDescriptions {
        if int(status) == value {
            return status, nil
        }
    }
    return CREATED, fmt.Errorf("valor de status inválido: %d", value)
}