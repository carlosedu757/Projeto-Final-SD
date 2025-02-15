package com.example;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface Pedido extends Remote {
    String atualizarStatus(int id) throws RemoteException;
}