package com.example;

import java.sql.Connection;
import java.sql.DriverManager;

public class TesteConexao {
    public static void main(String[] args) {
        // URL JDBC para SQL Server
        String url = "jdbc:sqlserver://pedidos-server.database.windows.net:1433;databaseName=db_pedidos;user=miguel.farias;password=-3L4)jH42@=;encrypt=true;trustServerCertificate=false;";

        try (Connection conn = DriverManager.getConnection(url)) {
            System.out.println("Conexão bem-sucedida!");
        } catch (Exception e) {
            System.err.println("Erro ao conectar ao banco de dados: " + e.getMessage());
            e.printStackTrace();
        }
    }
}