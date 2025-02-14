import React, { useState } from "react";
import './PedidoForm.css'
const PerdidoForm = () => {
  const [order, setOrder] = useState({ name: "", description: "", value: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Pedido enviado:", order);
    setSubmitted(true);
  };

  return (
    <div className="order-container">
      <div className="order-box">
        <h2>Fazer Pedido</h2>
        {submitted ? (
          <p>Pedido enviado com sucesso!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nome do pedido"
              value={order.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Descrição"
              value={order.description}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="value"
              placeholder="Valor"
              value={order.value}
              onChange={handleChange}
              required
            />
            <button type="submit" className="order-button">Enviar Pedido</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PerdidoForm;
