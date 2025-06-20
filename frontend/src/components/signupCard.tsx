import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    TextField,
    Typography
} from "@mui/material"
import { Google as GoogleIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import api from "../api/axios";
import { useState } from "react";
import { toast } from "react-toastify";
import useUserStore from '../store/userStore';


type SignUpResponse = {
  message: string;
  email: string;
  token: string;
  name: string;
};


const SignupCard = ({ onToggle }: { onToggle: () => void }) => {


    const theme = useTheme();

    const setUser = useUserStore((state) => state.setUser);

    //here we will define the states
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [nameInput, setNameInpput] = useState('');
    const [confirmPassInput, setConfirmPassInput] = useState('');

    const handleSignUp = async () => {
        try{

            if (passwordInput!=confirmPassInput){
                const message = "Signup failed. Passwords do not match.";

                toast.error(`❌ ${message}`, {
                position: "top-center",
                autoClose: 4000,
                });

                return
            }

            const response = await api.post<SignUpResponse>("/signup", {
                email: emailInput,
                password: passwordInput,
                username: nameInput
            });
            console.log("SignedUp success:",response.data);

            toast.success("✅ SignedUp successfully!", {
            position: "top-center",
            autoClose: 3000,
            });

            const { email, token, name } = response.data;
            setUser({ email, token, name });
            localStorage.setItem("user", JSON.stringify({ email, token, name }));



        } catch (error: any) {
            const apiError = error.response?.data?.error;
            const fallback = "Signup failed. Please try again.";
            const message = typeof apiError === 'string' ? apiError : fallback;

            console.error("signup failed:", message);

            toast.error(`❌ ${message}`, {
                position: "top-center",
                autoClose: 4000,
            });
            }
    

    }

    const handleoAuthLogin= () => {
            //redirect to the springboot website
            window.location.href = `${api.defaults.baseURL}/oauth2/authorization/google`;
        }


    return(
        <Card
        sx={{
            maxWidth: 400,
            mx: "auto",
            mt: 10,
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            boxShadow: 3,
        }}
        >
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    Welcome Back
                </Typography>

                <Stack spacing={"15px"}>

                    <TextField
                    fullWidth
                    label="Name"
                    type="text"
                    variant="outlined"
                    value={nameInput}
                    onChange={(e)=>setNameInpput(e.target.value)}
                    />


                    <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={emailInput}
                    onChange={(e)=>setEmailInput(e.target.value)}
                    />



                    <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={passwordInput}
                    onChange={(e)=>setPasswordInput(e.target.value)}
                    />

                    <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    value={confirmPassInput}
                    onChange={(e)=>setConfirmPassInput(e.target.value)}
                    />

                    <Button fullWidth
                      variant={'contained'}
                      color={'primary'}
                      onClick={handleSignUp}
                      sx={{
                        py: 1,
                        ...( {
                          backgroundImage:
                            'linear-gradient(270deg, #7b1fa2, #2196f3, #7b1fa2)',
                          backgroundSize: '200% 100%',
                          animation: 'shine 4s ease infinite',
                          '@keyframes shine': {
                            '0%': { backgroundPosition: '0% 50%' },
                            '50%': { backgroundPosition: '100% 50%' },
                            '100%': { backgroundPosition: '0% 50%' },
                          },
                        }),
                      }}>
                        Sign Up
                    </Button>

                    <Divider>or</Divider>

                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<GoogleIcon />}
                        color="inherit"
                        onClick={handleoAuthLogin}
                    >
                        Sign Up with Google
                    </Button>



                </Stack>

                <Box mt={3} textAlign="center">
                <Typography variant="body2">
                    Already have an account?{" "}
                    <span
                    style={{ cursor: "pointer", color: theme.palette.primary.main }}
                    onClick={onToggle}
                    >
                    Log in
                    </span>
                </Typography>
                </Box>


            </CardContent>

        </Card>
    );


}

export default SignupCard;