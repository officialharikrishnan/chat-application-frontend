import io, { Socket } from "socket.io-client";

let socketio:any=null

export const socketInit = (userId:string | undefined) => {
    socketio = io("http://localhost:8000")
    socketio.on("connect",()=>{
        console.log("connected",socketio.id);
    })
    socketio.emit("addUser",userId)
}
export {
    socketio
}