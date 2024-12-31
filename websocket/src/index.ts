import { WebSocket, WebSocketServer } from "ws";

const websocket = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: String;
}

const allSocket: User[] = [];

websocket.on("connection", (socket) => {

    socket.on("error", (e) => {
        console.log(e.message);
    })

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message as unknown as string);

        if (parsedMessage.type === "join") {
            allSocket.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }

        if (parsedMessage.type === "chat") {
            const currentRoom = allSocket.find(x => x.socket == socket)?.room;

            allSocket.forEach(a => {
                if (a.room == currentRoom) {
                    a.socket.send(parsedMessage.payload.message);
                }
            })
        }


    });

})

