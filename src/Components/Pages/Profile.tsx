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
import Badge from '@mui/material/Badge';
interface user {
  name: String;
}
interface allUsers {
  name: string;
  _id: string;
}
interface notif {
  count:number
  id:string
}
function Profile() {
  const dispatch = useDispatch()
  const [userData, setUserData] = useState({} as user);
  const [allUsers, setAllUsers] = useState([] as allUsers[]);
  const [usersStatus, setUsersStatus] = useState(false);
  const [socket, setSocket] = useState<Socket>();
  const [notification,setNotification]=useState({} as notif)
  const navigate = useNavigate()
  const userId = useParams();
  
//   console.log("userid>>>>>>>", userId);
  useEffect(() => {
    axios
      .get(`http://localhost:8001/get-profile/${userId.id}`)
      .then((user) => {
        // console.log(user);
        setUserData(user.data);
      })
      .catch((err) => {
        console.log(err);
      });
      socketInit(userId.id)
    axios.get(`http://localhost:8001/get-all-users/${userId.id}`).then((response) => {
      if (response.data.length !== 0) {
        setAllUsers(response.data);
        setUsersStatus(true); 
    
      }
    });
    setSocket(socketio)
  }, [userId.id]);
  useEffect(()=>{
    let msg=0
    socket?.on("getMessages", (data: any) => { 
      msg++
      setNotification({count:msg,id:data.user})
    
  });
  },[socket])
  const redirectToChat = (id:string,name:string) => {
    let sender=userId.id
    let receiver=id
    dispatch(insert(name))
    let data=JSON.stringify({sender,receiver})
        navigate(`/chat/${data}`)
  }
  console.log(notification);
  
  return (
    <Box>
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
                    secondaryAction={notification.id === user._id ?
                     <Badge badgeContent={notification.count} color="success" >

                      <IconButton edge="end" onClick={()=>redirectToChat(user._id,user.name)} aria-label="comments">
                        <Comment />
                        
                      </IconButton>
                     </Badge>
                     :
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
