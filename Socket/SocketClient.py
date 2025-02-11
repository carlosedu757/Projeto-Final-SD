import socket

class SocketClient:
    def __init__(self, host='localhost', port=12345):
        self.host = host
        self.port = port
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def connect(self):
        self.socket.connect((self.host, self.port))

    def send_request(self, data):
        self.socket.sendall(data.encode())
        response = self.socket.recv(1024).decode()
        return response

    def close(self):
        self.socket.close()