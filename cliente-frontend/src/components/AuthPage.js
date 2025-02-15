import React, { useState } from "react";
import "./AuthPage.css";
import PedidoForm from "./PedidoForm";

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isRegister) {
      // Fazendo login
      try {
        const response = await fetch("http://localhost:5152/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
  
        if (response.ok) {
          const user = await response.json();
          console.log("Login bem-sucedido:", user);
  
          // Armazena os dados no sessionStorage
          sessionStorage.setItem("user", JSON.stringify(user));
  
          setIsLoggedIn(true);
        } else {
          const errorData = await response.json();
          alert(errorData.errorMessage || "Erro ao fazer login");
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        alert("Erro ao conectar ao servidor");
      }
    } else {
      // Registrando usuário (implemente isso se necessário)
      alert("Registro concluído! Agora faça login.");
      setIsRegister(false);
      setFormData({ name: "", email: "", password: "" });
    }
  };
  
  if (isLoggedIn) {
    return <PedidoForm />;
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