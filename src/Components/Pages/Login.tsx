import React, { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";
import app from "../../Config/fireBase";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const auth = getAuth(app);
  const [phone, setPhone] = useState("");
  const [isOtp, setIsOtp] = useState(false);
  const [userData, setUserData] = useState({});
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const login = () => {
    // verifyCaptcha();
    let phoneNumber = phone;
    if (phone.substring(0, 3) !== "+91") {
      phoneNumber = `+91${phone}`;
    }
    axios
      .post("http://localhost:8001/get-user-by-phone", { phone: phoneNumber })
      .then((res) => {
        if (res.status === 200) {
          verifyCaptcha();
          const appVerifier = window.recaptchaVerifier;
          signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
              window.confirmationResult = confirmationResult;
              setIsOtp(true);
              setUserData(res.data._id);

              // ...
            })
            .catch((error) => {
              // Error; SMS not sent
              // ...
            });
        } else {
          alert("user not found");
        }
      })
      .catch(() => {
        console.log("catch worked");

        alert("network  error");
      });
  };
  const verifyCaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );
  };
  const verifyCode = () => {
    window.confirmationResult
      .confirm(otp)
      .then((result: any) => {
        // User signed in successfully.
        // ...
        navigate(`/profile/${userData}`)
      })
      .catch((error: Error) => {
        // User couldn't sign in (bad verification code?)
        console.log(error);

        // ...
      });
  };
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
              {!isOtp ? (
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
                    Login
                  </Typography>
                  <Box sx={{ pl: 6, pt: 5 }}>
                    <Grid>
                      <TextField
                        sx={{ mb: 2 }}
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
                        onClick={login}
                      >
                        Go
                      </Button>
                      <Link to={"/signup"}>
                        <Typography
                          sx={{ ml: 9, mt: 2 }}
                          variant="subtitle2"
                          gutterBottom
                        >
                          Signup
                        </Typography>
                      </Link>
                      <Box id="recaptcha-container"></Box>
                    </Grid>
                  </Box>
                </Box>
              ) : (
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
                </Box>
              )}
            </Grid>
          </Box>
        </div>
      </Container>
    </Box>
  );
};

export default Login;
