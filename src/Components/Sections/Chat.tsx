import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Socket } from "socket.io-client";
import { socketio } from "../../service/socket";
import { useParams } from "react-router-dom";
import {useSelector} from 'react-redux'
import axios from "axios";
function Chat() {
  
  interface Store {
    user?: {
      value: string;
    },
    chat?:{
      data:Array<object>
    }
    // other properties of store...
  }
  const data=useParams()
  const currUser = useSelector((store:Store) => store?.user?.value) 
  const [socket, setSocket] = useState<Socket>();
  const [recUser, setRecUserId] = useState("");
  const [sender,setSender]=useState('')
  const [input,setInput]=useState('')
  const [allMessage,setAllMessage]=useState([])
  const [emit,setEmit]=useState(false)
  useEffect(() => {
    setSocket(socketio);
    setEmit(!emit)

  }, []);
  useEffect(()=>{
    
    if(typeof data.id !== 'undefined'){
      let decode = JSON.parse(data.id)
      setSender(decode.sender)
      setRecUserId(decode.receiver)
      setEmit(!emit)
    }
  },[socket,data,recUser,sender])

  socket?.on("getMessages", (data: any) => {
    console.log("one message>>",data); 
    setEmit(!emit)
  });

  useEffect(()=>{

    axios.post('http://localhost:8000/get-chat',{user1:sender,user2:recUser}).then((chat)=>{
      setAllMessage(chat.data.data)
   
      })
  },[emit,recUser,sender])


  
   
  function sendMessage(e: any) {
    console.log("send called",socket);
    e.preventDefault();
    console.log("called");
    const messageData = {
      user: sender,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
      message: input, 
    }; 
    socket?.emit("send", { sender: sender, receiver:recUser, data:messageData });
    setInput('')
    setEmit(!emit)

   
  }

  return (
    <div>
      <section className="msger">
        <header className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt"></i> {currUser}
          </div>
          <div className="msger-header-options">
            <span>
              <i className="fas fa-cog"></i>
            </span>
          </div>
        </header>

        <main id="msger-chats" className="msger-chat">
            {allMessage && allMessage.map((data:any) => {
          return <div className={data.user === sender ? "msgright" : "msgleft"}>
                <div className="msg-bubble">
                  <div className="msg-text" ><h4>{data.message}</h4></div>
                  <div className="msg-info">
                    <div className="msg-info-time">{data.time}</div>
                  </div>
                </div>
          </div>
            })} 
        </main>

        <form className="msger-inputarea">
          <input
            value={input}
            type="text"
            className="msger-input"
            onChange={(e) => {
              setInput(e.target.value)
            }}
            placeholder="Enter your message..."
          />
          <button
            type="submit" 
            className="msger-send-btn"
            onClick={(e) => {
              sendMessage(e);
            }}
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}

export default Chat;
