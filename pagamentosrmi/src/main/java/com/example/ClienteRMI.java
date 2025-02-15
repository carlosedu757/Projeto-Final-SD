package com.example;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class ClienteRMI {
    public static void main(String[] args) {
        try {
            // Conectar ao registro RMI no localhost e porta 1099
            Registry registry = LocateRegistry.getRegistry("localhost", 1099);
            
            // Obter a referência ao objeto remoto
            Pedido pedido = (Pedido) registry.lookup("PedidoService");
            
            // Chamar o método remoto
            String resultado = pedido.atualizarStatus(2);
            System.out.println(resultado);
        } catch (Exception e) {
            System.err.println("Erro no cliente RMI: " + e.getMessage());
            e.printStackTrace();
        }
    }
}