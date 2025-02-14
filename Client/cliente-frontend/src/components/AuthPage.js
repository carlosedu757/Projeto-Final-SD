import React, { useState } from "react";
import "./AuthPage.css";
import PerdidoForm from "./PedidoForm";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isRegister ? "Registrando usuário" : "Fazendo login", formData);
    setIsLoggedIn(true);
  };

  if (isLoggedIn) {
    return (
      <PerdidoForm/>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegister ? "Registro" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-button">
            {isRegister ? "Registrar" : "Entrar"}
          </button>
        </form>
        <p onClick={() => setIsRegister(!isRegister)} className="auth-toggle">
          {isRegister ? "Já tem uma conta? Faça login" : "Não tem conta? Registre-se"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
