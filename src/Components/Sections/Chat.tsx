import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Socket } from "socket.io-client";
import { socketio } from "../../service/socket";
import { useParams } from "react-router-dom";
import { useSelector} from 'react-redux'
import axios from "axios";
import * as randomstring from 'randomstring';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  interface Store {
    notification?:{
      user?:{
        data?:{
          id:string
          status:boolean
        }
      }
    }
    }
    
  const data=useParams()
  const currUser = useSelector((store:Store) => store?.user?.value) 
  const [socket, setSocket] = useState<Socket>();
  const [recUser, setRecUserId] = useState("");
  const [sender,setSender]=useState('')
  const [input,setInput]=useState('')
  const [allMessage,setAllMessage]=useState([])
  const [emit,setEmit]=useState('')
  const [notificationUser,setNotificationUser]=useState('')
  useEffect(() => {
    setSocket(socketio);
    setEmit(randomstring.generate())
  }, []);
  useEffect(()=>{
    
    if(typeof data.id !== 'undefined'){
      let decode = JSON.parse(data.id)
      setSender(decode.sender)
      setRecUserId(decode.receiver)
      setEmit(randomstring.generate())
    }
  },[socket,data,recUser,sender])

  socket?.on("getMessages", (data: any) => {
    setEmit(randomstring.generate())
    if(data.user !== recUser){
      axios
      .get(`http://localhost:8001/get-profile/${data.user}`)
      .then((user) => {
        // console.log(user);
        setNotificationUser(user.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
      console.log("not this user");
      
    }
  });
 
  useEffect(()=>{
    axios.post('http://localhost:8000/get-chat',{user1:sender,user2:recUser})
    .then((chat)=>{
      setAllMessage(chat.data.data)
    })
  },[emit])
  useEffect(()=>{
    if(notificationUser){
      toast(`New message from ${notificationUser}`, { type: 'success' });
    }
  },[notificationUser])
  console.log(emit);
  
   
  function sendMessage(e: any) {
    e.preventDefault();
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
    statechange()
   
  }
  const statechange = () =>{
     setEmit(randomstring.generate())
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
              e.preventDefault()
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
      <ToastContainer/>
    </div>
  );
}

export default Chat;
