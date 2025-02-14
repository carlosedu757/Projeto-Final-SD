package com.exemplo;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface Pedido extends Remote {
    String atualizarStatus(int id, String novoStatus) throws RemoteException;
}