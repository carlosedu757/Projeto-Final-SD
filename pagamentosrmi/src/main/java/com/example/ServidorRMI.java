package com.example;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class ServidorRMI {
    public static void main(String[] args) {
        try {
            // Cria uma instância do objeto remoto
            Pedido pedido = new PedidoImpl();

            // Cria o registro RMI na porta 1099
            Registry registry = LocateRegistry.createRegistry(1099);

            // Registra o objeto remoto no registro
            registry.rebind("PedidoService", pedido);

            System.out.println("Servidor RMI iniciado e pronto para receber requisições.");
        } catch (Exception e) {
            System.err.println("Erro no servidor RMI: " + e.getMessage());
            e.printStackTrace();
        }
    }
}