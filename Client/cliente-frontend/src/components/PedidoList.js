import React, { useEffect, useState } from "react";
import { getPedidos } from "../services/api";
import PedidoForm from "./PedidoForm";

const PedidoList = () => {
    const [pedidos, setPedidos] = useState([]);

    const fetchPedidos = async () => {
        try {
            const data = await getPedidos();
            setPedidos(data);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, []);

    return (
        <div>
            <h2>Lista de Pedidos</h2>
            <PedidoForm onPedidoCriado={fetchPedidos} />
            <ul>
                {pedidos.map((pedido) => (
                    <li key={pedido.id}>
                        {pedido.descricao} - R$ {pedido.valor.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PedidoList;
