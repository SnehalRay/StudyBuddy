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
import { Link } from "react-router-dom";


const LoginCard = ({ onToggle }: { onToggle: () => void }) => {

    const theme = useTheme();

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
                    />

                    <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    />

                    <Button fullWidth
                      variant={'contained'}
                      color={'primary'}
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