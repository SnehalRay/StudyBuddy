import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../store/userStore";
import api from "../api/axios";

export default function OAuth2RedirectHandler(){
    const navigate = useNavigate();
    const setUser = useUserStore((s)=>s.setUser)

    useEffect(()=>{
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const email = params.get('email');
        const name = params.get('name') || '';

        if (token && email) {
            setUser({email,token, name})
            localStorage.setItem('user',JSON.stringify({email,token, name}));
            toast.success("✅ Logged in successfully!", {
            position: "top-center",
            autoClose: 3000,
            });
            navigate('/');
            return
        } else {
        navigate('/authentication');
        }
    },[]);
    return null;
}