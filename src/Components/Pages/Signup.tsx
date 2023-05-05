import React, { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import {
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";
import app from "../../Config/fireBase";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [userData,setUserData]=useState({})
  const [isOtp,setIsOtp]=useState(false)
  const [otp,setOtp]=useState('')
  const auth = getAuth(app);
  const navigate = useNavigate()
  const signup = () => {
    verifyCaptcha();
    let phoneNumber=phone
    if(phone.substring(0,3)!== "+91") {
        phoneNumber=`+91${phone}`
    }
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        setIsOtp(true)
        const data = {
            name:userName,
            phone:phoneNumber
        }
        setUserData(data)

        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
      });
  };
  const verifyCaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
  };
  const verifyCode = () => {

    window.confirmationResult.confirm(otp).then((result:any) => {
        // User signed in successfully.
        axios.post('http://localhost:8001/register',userData).then((res)=>{
            console.log(res);
            
        navigate(`/profile/${res.data}`)
        })
        // ...
      }).catch((error:Error) => {
        // User couldn't sign in (bad verification code?)
        console.log(error);
        
        // ...
      });
  }

  return (
    <Box
      sx={{ width: 1, height: "100vh", backgroundColor: "rgb(111, 255, 111)" }}
    >
      <Container maxWidth={"md"}>
        <div className="box">
          <Box sx={{ pt: 13 }}>
            <Grid
              xs={12}
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "10vh" }}
            >
              {!isOtp ? <Box
                sx={{
                  width: 300,
                  height: 350,
                  backgroundColor: "white",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ ml: 14, mt: 2 }} variant="h5" gutterBottom>
                  Signup
                </Typography>
                <Box sx={{ pl: 6, pt: 5 }}>
                  <Grid>
                    <TextField
                      sx={{ mb: 2 }}
                      id="outlined-basic"
                      label="Name"
                      variant="outlined"
                      onChange={(e) => {
                        setUserName(e.target.value);
                      }}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Phone"
                      variant="outlined"
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                    />
                    <Button
                      sx={{ ml: 8, mt: 2 }}
                      variant="contained"
                      onClick={signup}
                    >
                      Go
                    </Button>
                    <Link to={"/"}>
                      <Typography
                        sx={{ ml: 2, mt: 2 }}
                        variant="subtitle2"
                        gutterBottom
                      >
                        Already have an account
                      </Typography>
                    </Link>
                    <Box id="recaptcha-container"></Box>
                  </Grid>
                </Box>
              </Box>
              :
              <Box
                sx={{
                  width: 300,
                  height: 350,
                  backgroundColor: "white",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <Typography sx={{ ml: 14, mt: 2 }} variant="h5" gutterBottom>
                  OTP
                </Typography>
                <Box sx={{ pl: 6, pt: 5 }}>
                  <Grid>
                    
                    <TextField
                      id="outlined-basic"
                      label="OTP"
                      variant="outlined"
                      onChange={(e) => {
                        setOtp(e.target.value);
                      }}
                    />
                    <Button
                      sx={{ ml: 7, mt: 2 }}
                      variant="contained"
                      onClick={verifyCode}
                    >
                      Verify
                    </Button>
                  </Grid>
                </Box>
              </Box>}
            </Grid>
          </Box>
        </div>
      </Container>
    </Box>
  );
};

export default Signup;
