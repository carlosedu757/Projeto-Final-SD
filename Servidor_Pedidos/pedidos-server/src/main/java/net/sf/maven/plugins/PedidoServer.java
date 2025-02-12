package net.sf.maven.plugins;

import java.rmi.Naming;
import java.rmi.registry.LocateRegistry;

public class PedidoServer {
    public static void main(String[] args) {
        try {
            PedidoService service = new PedidoService();

            LocateRegistry.createRegistry(1099);
            Naming.rebind("rmi://localhost/PedidoService", service);

            System.out.println("Servidor de Pedidos iniciado!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
