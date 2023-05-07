import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Container, Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { deepOrange, green } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {Comment} from '@mui/icons-material';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { socketInit } from "../../service/socket";
import {insert} from "../../utils/userSlice";
import {useDispatch} from 'react-redux'
import { socketio } from "../../service/socket";
import { Socket } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface user {
  name: String;
}
interface allUsers {
  name: string;
  _id: string;
  noti?:boolean
}


function Profile() {
  const dispatch = useDispatch()
  const [userData, setUserData] = useState({} as user);
  const [allUsers, setAllUsers] = useState([] as allUsers[]);
  const [usersStatus, setUsersStatus] = useState(false);
  const [socket, setSocket] = useState<Socket>();
  const [notificationUser,setNotificationUser]=useState('')
  const navigate = useNavigate()
  const userId = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:8001/get-profile/${userId.id}`)
      .then((user) => {
        setUserData(user.data);
      })
      .catch((err) => {
        console.log(err);
      });
      socketInit(userId.id)
    axios.get(`http://localhost:8001/get-all-users/${userId.id}`).then((response) => {
      if (response.data.length !== 0) {
        let alluser=[...response.data]
        alluser.map((user)=>{
          user.noti = false
        })
        setAllUsers(alluser);
        setUsersStatus(true); 
      }
    });
    setSocket(socketio)
  }, [userId.id]);

    socket?.on("getMessages", (data: any) => { 
      axios
      .get(`http://localhost:8001/get-profile/${data.user}`)
      .then((user) => {
        setNotificationUser(user.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
      
      
      
    });
    useEffect(()=>{
      if(notificationUser){
        toast(`New message from ${notificationUser}`, { type: 'success' });
      }
    },[notificationUser])
  const redirectToChat = (id:string,name:string) => {
    let sender=userId.id
    let receiver=id 
    dispatch(insert(name)) 
    let data=JSON.stringify({sender,receiver})
        navigate(`/chat/${data}`)
  }
 

  return (
    <Box>
      <ToastContainer />
      <Box sx={{ width: 1, height: "50vh", bgcolor: green[400] }}>
        <Container>
          <Grid xs={12} container alignItems="center" justifyContent="center">
            <Box>
              <Box sx={{ pt: "100%" }}>
                <Avatar
                  sx={{
                    bgcolor: deepOrange[400],
                    width: "150px",
                    height: "150px",
                  }}
                >
                  {userData.name}
                </Avatar>
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ width: 1, height: "50vh", bgcolor: green[100] }}>
        {usersStatus && (
          <Container>
            <Typography sx={{textAlign:"center",mb:5}} variant="h6">People</Typography>
            {allUsers.map((user) => {
              return (
                <Grid
                  xs={12}
                  container
                  alignItems="center"
                  justifyContent="center"
                >
                  <ListItem
                  sx={{width:'70%',mb:2}}
                    // key={value}
                    secondaryAction={
                      
                     
                     <IconButton edge="end" onClick={()=>redirectToChat(user._id,user.name)} aria-label="comments">
                     <Comment />
                     
                   </IconButton>
                     

                    }
                    disablePadding
                  >
                    <ListItemButton
                      role={undefined}
                    //   onClick={handleToggle(value)}
                      dense
                    >
                      <ListItemIcon></ListItemIcon>
                      <ListItemText
                        id={user._id}
                        primary={user.name}
                      />
                    </ListItemButton>
                  </ListItem>
                </Grid>
              );
            })}
          </Container>
        )}
      </Box>

    </Box>
  );
}


export default Profile;
