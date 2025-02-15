import axios from "axios";

// Defina a URL base do servidor de pedidos
const API_URL = "http://localhost:5235/api"; // Ajuste para o endereço correto da sua API
// Função para buscar os pedidos
export const getPedidos = async () => {
  try {
    const response = await axios.get(`${API_URL}/pedidos`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return [];
  }
};


export const createPedido = async (novoPedido) => {
    try {
        const response = await axios.post(`${API_URL}/pedidos`, novoPedido);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        throw error; // Relança o erro para ser tratado no formulário
    }
};