// src/components/LoginCard.tsx
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

type LoginResponse = {
  message: string;
  email: string;
  token: string;
};


const LoginCard = ({ onToggle }: { onToggle: () => void }) => {

    const theme = useTheme();

    const setUser = useUserStore((state) => state.setUser);

    //here we will define the states
    const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

    const handleLogin = async () => {
        try{
            const response = await api.post<LoginResponse>("/login", {
                email: emailInput,
                password: passwordInput,
            });
            console.log("Login success:",response.data);

            toast.success("✅ Logged in successfully!", {
            position: "top-center",
            autoClose: 3000,
            });

            const { email, token } = response.data;

            setUser({ email, token });
            localStorage.setItem("user", JSON.stringify({ email, token }));

            

        } catch (error: any) {
            const message = error.response?.data?.message || "Login failed. Please try again.";
            console.error("login failed:", message);

            toast.error(`❌ ${message}`, {
            position: "top-center",
            autoClose: 4000,
            });
        }
        };


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

                <Stack spacing="15px">
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

                    <Button fullWidth
                      variant={'contained'}
                      color={'primary'}
                      onClick={handleLogin}
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
                        Login
                    </Button>

                    <Divider>or</Divider>

                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<GoogleIcon />}
                        color="inherit"
                    >
                        Log in with Google
                    </Button>



                </Stack>

                <Box mt={3} textAlign="center">
                <Typography variant="body2">
                    Don’t have an account?{" "}
                    <span
                    style={{ cursor: "pointer", color: theme.palette.primary.main }}
                    onClick={onToggle}
                    >
                    Let’s create one
                    </span>
                </Typography>
                </Box>


            </CardContent>

        </Card>
    );





};

export default LoginCard;