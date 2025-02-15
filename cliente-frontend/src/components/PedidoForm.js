import React, { useState, useEffect } from "react";
import "./PedidoForm.css";

const PedidoForm = () => {
  const usuario = JSON.parse(sessionStorage.getItem("user"));
  const [order, setOrder] = useState({ name: "", description: "", value: "" });
  const [orders, setOrders] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState({
    id: usuario.id,
    name: usuario.name,
    email: usuario.email
  });
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://localhost:7199/api/order");
      if (response.ok) {
        const orders = await response.json();
        setOrders(orders);
        setUser({
          id: usuario.id, 
          name: usuario.name,
          email: usuario.email,
        });
      } else {
        console.error("Erro ao buscar pedidos");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newOrder = {
      name: order.name,
      description: order.description,
      price: order.value,
      userId: user.id, 
      orderStatus: "CREATED", // Status inicial do pedido
    };

    try {
      const response = await fetch("https://localhost:7199/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });

      if (response.ok) {
        const createdOrder = await response.json();
        setOrders([...orders, createdOrder]);
        setOrder({ name: "", description: "", value: "" });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
      } else {
        console.error("Erro ao criar pedido");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
    }
  };

  const handleDetails = async (order) => {
    try {
      const response = await fetch(`https://localhost:7199/api/order/${order.id}`);
      if (response.ok) {
        const orderDetails = await response.json();
        setSelectedOrder(orderDetails);
        setShowDetailsModal(true);
      } else {
        console.error("Erro ao buscar detalhes do pedido");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
    }
  };

  const handleEditOrder = (order) => {
    setEditedOrder(order);
    setShowEditOrderModal(true);
  };

  const saveOrderChanges = async () => {
    try {
      const response = await fetch(`https://localhost:7199/api/order/${editedOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedOrder),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
        setShowEditOrderModal(false);
        alert("Pedido atualizado com sucesso!");
      } else {
        console.error("Erro ao atualizar pedido");
      }
    } catch (error) {
      console.error("Erro ao conectar ao servidor:", error);
    }
  };

  const handleViewStatus = (order) => {
    setSelectedOrderStatus(order.statusHistory);
    setShowStatusModal(true);
  };

  const saveUserChanges = () => {
    setUser({ name: editedName, email: editedEmail });
    setShowEditUserModal(false);
    alert("Perfil atualizado com sucesso!");
  };

  const logout = () => {
    window.location.href = "/";
  };

  return (
    <div className="order-container">
      {/* Navbar */}
      <div className="navbar">
        <span>{user.name} ({user.email})</span>
        <button onClick={() => setShowEditUserModal(true)}>Editar Perfil</button>
        <button onClick={logout}>Sair</button>
      </div>

      {/* Modal de Edição de Perfil */}
      {showEditUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Perfil</h2>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Nome"
            />
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              placeholder="Email"
            />
            <button onClick={saveUserChanges}>Salvar</button>
            <button onClick={() => setShowEditUserModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Formulário de Pedido */}
      <div className="order-box">
        <h2>Fazer Pedido</h2>
        {submitted && <p>Pedido enviado com sucesso!</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nome do pedido"
            value={order.name}
            onChange={(e) => setOrder({ ...order, name: e.target.value })}
            required
          />
          <textarea
            name="description"
            placeholder="Descrição"
            value={order.description}
            onChange={(e) => setOrder({ ...order, description: e.target.value })}
            required
          />
          <input
            type="number"
            name="value"
            placeholder="Valor"
            value={order.value}
            onChange={(e) => setOrder({ ...order, value: e.target.value })}
            required
          />
          <button type="submit" className="order-button">
            Enviar Pedido
          </button>
        </form>
      </div>

      {/* Lista de Pedidos */}
      <div className="order-list">
        <h2>Pedidos Cadastrados</h2>
        {orders.length === 0 ? (
          <p>Nenhum pedido cadastrado.</p>
        ) : (
          <ul>
            {orders.map((item, index) => (
              <li key={index} className="order-item">
                <div className="order-info">
                  <strong>{item.name}</strong>
                </div>
                <div className="order-actions">
                  <button
                    className="details-button"
                    onClick={() => handleDetails(item)}
                  >
                    Detalhes
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEditOrder(item)}
                  >
                    Editar
                  </button>
                  <button
                    className="status-button"
                    onClick={() => handleViewStatus(item)}
                  >
                    Status
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal de Detalhes do Pedido */}
      {showDetailsModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Detalhes do Pedido</h2>
            <p><strong>Nome:</strong> {selectedOrder.name}</p>
            <p><strong>Descrição:</strong> {selectedOrder.description}</p>
            <p><strong>Valor:</strong> R$ {selectedOrder.value}</p>
            <p><strong>Status Atual:</strong> {selectedOrder.status}</p>
            <button
              className="order-button"
              onClick={() => setShowDetailsModal(false)}
              style={{ marginTop: "20px" }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Edição de Pedido */}
      {showEditOrderModal && editedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Pedido</h2>
            <input
              type="text"
              value={editedOrder.name}
              onChange={(e) => setEditedOrder({ ...editedOrder, name: e.target.value })}
              placeholder="Nome do pedido"
            />
            <textarea
              value={editedOrder.description}
              onChange={(e) => setEditedOrder({ ...editedOrder, description: e.target.value })}
              placeholder="Descrição"
            />
            <input
              type="number"
              value={editedOrder.value}
              onChange={(e) => setEditedOrder({ ...editedOrder, value: e.target.value })}
              placeholder="Valor"
            />
            <button onClick={saveOrderChanges}>Salvar</button>
            <button onClick={() => setShowEditOrderModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal de Status do Pedido */}
      {showStatusModal && selectedOrderStatus && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Histórico de Status</h2>
            <ul>
              {selectedOrderStatus.map((status, index) => (
                <li key={index}>
                  <strong>{status.status}</strong> - {status.timestamp}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowStatusModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidoForm;