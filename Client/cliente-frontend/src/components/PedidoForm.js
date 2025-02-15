import React, { useState } from "react";
import "./PedidoForm.css";

const PedidoForm = () => {
  const [order, setOrder] = useState({ name: "", description: "", value: "" });
  const [orders, setOrders] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false); // Modal de edição de usuário
  const [username, setUsername] = useState("Usuário");
  const [userEmail, setUserEmail] = useState("usuario@exemplo.com"); // Estado para o email
  const [userPassword, setUserPassword] = useState(""); // Estado para a senha
  const [editedUsername, setEditedUsername] = useState(username); // Estado para o nome editável
  const [editedEmail, setEditedEmail] = useState(userEmail); // Estado para o email editável
  const [editedPassword, setEditedPassword] = useState(""); // Estado para a senha editável

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      ...order,
      status: "Pendente",
      statusHistory: [
        { 
          status: "Pendente", 
          timestamp: new Date().toLocaleString() 
        }
      ]
    };
    setOrders([...orders, newOrder]);
    setOrder({ name: "", description: "", value: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const handleCancel = (index) => {
    const updatedOrders = [...orders];
    const newStatus = {
      status: "Cancelado",
      timestamp: new Date().toLocaleString()
    };
    
    updatedOrders[index] = {
      ...updatedOrders[index],
      status: "Cancelado",
      statusHistory: [...updatedOrders[index].statusHistory, newStatus]
    };
    
    setOrders(updatedOrders);
  };

  const handleDelete = (index) => {
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
  };

  const handleDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const logout = () => {
    window.location.href = "/";
  };

  const deleteUser = () => {
    alert("Usuário deletado!");
    window.location.href = "/";
  };

  // Função para abrir o modal de edição de usuário
  const openEditUserModal = () => {
    setEditedUsername(username); // Preenche o campo com o nome atual
    setEditedEmail(userEmail); // Preenche o campo com o email atual
    setEditedPassword(""); // Limpa o campo de senha
    setShowEditUserModal(true);
  };

  // Função para salvar as alterações do usuário
  const saveUserChanges = () => {
    setUsername(editedUsername); // Atualiza o nome do usuário
    setUserEmail(editedEmail); // Atualiza o email do usuário
    setUserPassword(editedPassword); // Atualiza a senha do usuário
    setShowEditUserModal(false); // Fecha o modal de edição
    alert("Alterações salvas com sucesso!");
  };

  return (
    <div className="order-container">
      {/* Navbar */}
      <div className="navbar">
        <span>{username}</span>
        <button onClick={() => setShowUserModal(true)}>Perfil</button>
        <button onClick={logout}>Sair</button>
      </div>

      {/* Modal de Perfil do Usuário */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Perfil do Usuário</h2>
            <button onClick={openEditUserModal}>Editar Usuário</button>
            <button onClick={deleteUser}>Deletar Usuário</button>
            <button className="close-button" onClick={() => setShowUserModal(false)}>×</button>
          </div>
        </div>
      )}

      {/* Modal de Edição de Usuário */}
      {showEditUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Usuário</h2>
            <input
              type="text"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              placeholder="Nome do usuário"
              style={{ width: "100%", padding: "10px", margin: "10px 0", fontSize: "16px" }}
            />
            <input
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              placeholder="Email do usuário"
              style={{ width: "100%", padding: "10px", margin: "10px 0", fontSize: "16px" }}
            />
            <input
              type="password"
              value={editedPassword}
              onChange={(e) => setEditedPassword(e.target.value)}
              placeholder="Nova senha"
              style={{ width: "100%", padding: "10px", margin: "10px 0", fontSize: "16px" }}
            />
            <button onClick={saveUserChanges}>OK</button>
            <button className="close-button" onClick={() => setShowEditUserModal(false)}>×</button>
          </div>
        </div>
      )}

      {/* Modal de Detalhes do Pedido */}
      {showDetailsModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Detalhes do Pedido</h2>
            <p><strong>Nome:</strong> {selectedOrder.name}</p>
            <p><strong>Descrição:</strong> {selectedOrder.description}</p>
            <p><strong>Valor:</strong> R$ {selectedOrder.value}</p>
            <p><strong>Status Atual:</strong> {selectedOrder.status}</p>
            
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ marginBottom: '10px' }}>Histórico de Status</h3>
              {selectedOrder.statusHistory.map((entry, index) => (
                <div key={index} style={{ 
                  marginBottom: '8px',
                  padding: '8px',
                  borderBottom: '1px solid #eee'
                }}>
                  <strong>{entry.status}</strong>
                  <div style={{ color: '#666', fontSize: '0.9em' }}>
                    {entry.timestamp}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="order-button"
              onClick={closeModal}
              style={{ marginTop: "20px" }}
            >
              Fechar
            </button>
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
                    className="cancel-button"
                    onClick={() => handleCancel(index)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(index)}
                  >
                    Apagar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PedidoForm;