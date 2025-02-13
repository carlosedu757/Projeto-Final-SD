import React, { useState } from "react";
import { createPedido } from "../services/api";

const PedidoForm = ({ onPedidoCriado }) => {
    const [pedido, setPedido] = useState({
        descricao: "",
        valor: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPedido((prevPedido) => ({
            ...prevPedido,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!pedido.descricao.trim() || !pedido.valor.trim()) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        const novoPedido = {
            descricao: pedido.descricao,
            valor: parseFloat(pedido.valor),
        };

        try {
            await createPedido(novoPedido);
            alert("Pedido criado com sucesso!");
            setPedido({ descricao: "", valor: "" }); // Reseta os campos
            if (onPedidoCriado) onPedidoCriado(); // Atualiza a lista
        } catch (error) {
            alert("Erro ao criar pedido! Verifique o console.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="descricao"
                value={pedido.descricao}
                onChange={handleChange}
                placeholder="Descrição do Pedido"
            />
            <input
                type="number"
                name="valor"
                value={pedido.valor}
                onChange={handleChange}
                placeholder="Valor do Pedido"
                step="0.01"
            />
            <button type="submit">Criar Pedido</button>
        </form>
    );
};

export default PedidoForm;
