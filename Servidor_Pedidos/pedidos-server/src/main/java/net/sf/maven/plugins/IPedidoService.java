package net.sf.maven.plugins;
import java.rmi.Remote;
import java.rmi.RemoteException;

public interface IPedidoService extends Remote {
    String criarPedido(String id, String descricao, double valor) throws RemoteException;
    String consultarStatus(String id) throws RemoteException;
    void atualizarStatus(String id, String status) throws RemoteException;
}