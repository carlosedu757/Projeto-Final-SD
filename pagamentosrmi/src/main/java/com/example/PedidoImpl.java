package com.exemplo;

import java.rmi.server.UnicastRemoteObject;
import java.rmi.RemoteException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class PedidoImpl extends UnicastRemoteObject implements Pedido {

    private static final String URL = "jdbc:mysql:pedidos-server.database.windows.net";
    private static final String USER = "miguel.farias"; 
    private static final String PASSWORD = "-3L4)jH42@="; 

    protected PedidoImpl() throws RemoteException {
        super();
    }

    public String atualizarStatus(int id, String novoStatus) throws RemoteException {
        String mensagem = "Erro ao atualizar o status.";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD)) {
            String sql = "UPDATE tb_pedidos SET status = ? WHERE id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, novoStatus);
                stmt.setInt(2, id);
                int linhasAfetadas = stmt.executeUpdate();
                if (linhasAfetadas > 0) {
                    mensagem = "Status atualizado com sucesso!";
                } else {
                    mensagem = "Nenhum pedido encontrado com o ID fornecido.";
                }
            }
        } catch (SQLException e) {
            mensagem = "Erro no banco de dados: " + e.getMessage();
        }
        return mensagem;
    }
}