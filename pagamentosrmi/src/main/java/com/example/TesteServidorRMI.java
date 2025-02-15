package com.example;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class TesteServidorRMI {
    public static void main(String[] args) {
        try {
            // Endereço e porta do servidor RMI
            String host = "localhost"; // Use "localhost" ou o IP do container Docker
            int port = 1099;

            // Conectar ao registro RMI
            System.out.println("Conectando ao servidor RMI em " + host + ":" + port + "...");
            Registry registry = LocateRegistry.getRegistry(host, port);

            // Listar os serviços registrados no RMI
            System.out.println("Listando serviços registrados...");
            String[] services = registry.list();
            if (services.length == 0) {
                System.out.println("Nenhum serviço RMI registrado.");
            } else {
                for (String service : services) {
                    System.out.println("Serviço registrado: " + service);
                }
            }

            // Tentar obter o serviço "PedidoService"
            System.out.println("Tentando acessar o serviço 'PedidoService'...");
            Pedido pedido = (Pedido) registry.lookup("PedidoService");

            // Chamar um método do serviço para testar a comunicação
            System.out.println("Chamando método 'atualizarStatus'...");
            String resultado = pedido.atualizarStatus(2);
            System.out.println("Resposta do servidor: " + resultado);

            System.out.println("Teste concluído com sucesso!");
        } catch (Exception e) {
            System.err.println("Erro ao testar o servidor RMI: " + e.getMessage());
            e.printStackTrace();
        }
    }
}