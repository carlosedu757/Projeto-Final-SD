import tkinter as tk
import SocketClient

class ClienteApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Cliente de Pedidos")

        self.id_label = tk.Label(root, text="ID:")
        self.id_label.pack()
        self.id_entry = tk.Entry(root)
        self.id_entry.pack()

        self.descricao_label = tk.Label(root, text="Descrição:")
        self.descricao_label.pack()
        self.descricao_entry = tk.Entry(root)
        self.descricao_entry.pack()

        self.valor_label = tk.Label(root, text="Valor:")
        self.valor_label.pack()
        self.valor_entry = tk.Entry(root)
        self.valor_entry.pack()

        self.criar_pedido_button = tk.Button(root, text="Criar Pedido", command=self.criar_pedido)
        self.criar_pedido_button.pack()

    def criar_pedido(self):
        id = self.id_entry.get()
        descricao = self.descricao_entry.get()
        valor = self.valor_entry.get()
        pedido = f"ID={id}, Descrição={descricao}, Valor={valor}"

        client = SocketClient.SocketClient()
        client.connect()
        response = client.send_request(pedido)
        print(f"Resposta do servidor: {response}")
        client.close()

if __name__ == "__main__":
    root = tk.Tk()
    app = ClienteApp(root)
    root.mainloop()