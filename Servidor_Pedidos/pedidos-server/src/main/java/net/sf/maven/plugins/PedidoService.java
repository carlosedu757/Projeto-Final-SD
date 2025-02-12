package net.sf.maven.plugins;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.HashMap;
import java.util.Map;

public class PedidoService extends UnicastRemoteObject implements IPedidoService {
    private static final long serialVersionUID = 1L;
    private Map<String, String> pedidos = new HashMap<>();

    public PedidoService() throws RemoteException {
        super();
    }

    @Override
    public String criarPedido(String id, String descricao, double valor) throws RemoteException {
        pedidos.put(id, "Criado");
        return "Pedido criado com sucesso!";
    }

    @Override
    public String consultarStatus(String id) throws RemoteException {
        return pedidos.getOrDefault(id, "Pedido não encontrado!");
    }

    @Override
    public void atualizarStatus(String id, String status) throws RemoteException {
        if (pedidos.containsKey(id)) {
            pedidos.put(id, status);
        } else {
            System.out.println("Pedido não encontrado!");
        }
    }
}
