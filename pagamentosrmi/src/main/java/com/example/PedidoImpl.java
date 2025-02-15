package com.example;

import java.rmi.server.UnicastRemoteObject;
import java.rmi.RemoteException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class PedidoImpl extends UnicastRemoteObject implements Pedido {

    private static final String URL = "jdbc:sqlserver://pedidos-server.database.windows.net:1433;databaseName=db_pedidos;user=miguel.farias;password=-3L4)jH42@=;encrypt=true;trustServerCertificate=false;"; 

    protected PedidoImpl() throws RemoteException {
        super();
    }

    public String atualizarStatus(int id) throws RemoteException {
        String mensagem = "Erro ao atualizar o status.";
        try (Connection conn = DriverManager.getConnection(URL)) {
            String sql = "UPDATE tb_pedidos SET OrderStatus = ? WHERE id = ?";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setInt(1, 2);
                stmt.setInt(2, id);
                int linhasAfetadas = stmt.executeUpdate();
                if (linhasAfetadas > 0) {
                    mensagem = "Pagamento realizado com sucesso!";
                } else {
                    mensagem = linhasAfetadas + "Nenhum pedido encontrado com o ID fornecido.";
                }
            }
        } catch (SQLException e) {
            mensagem = "Erro no banco de dados: " + e.getMessage();
        }
        return mensagem;
    }
}