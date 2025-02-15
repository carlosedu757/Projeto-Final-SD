package com.example;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class ServidorRMI {
    public static void main(String[] args) {
        try {
            System.setProperty("java.rmi.server.hostname", "localhost");

            Pedido pedido = new PedidoImpl();

            Registry registry = LocateRegistry.createRegistry(1099);

            registry.rebind("PedidoService", pedido);

            System.out.println("Servidor RMI iniciado e pronto para receber requisições.");
        } catch (Exception e) {
            System.err.println("Erro no servidor RMI: " + e.getMessage());
            e.printStackTrace();
        }
    }
}