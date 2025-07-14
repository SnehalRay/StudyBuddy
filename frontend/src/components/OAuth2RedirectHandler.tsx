import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUserStore from "../store/userStore";
import api from "../api/axios";

export default function OAuth2RedirectHandler(){
    const navigate = useNavigate();
    const setUser = useUserStore((s)=>s.setUser)

    useEffect(() => {
  async function handleOAuthRedirect() {
    try {
      const res = await api.get("/verifyToken"); // this will send the jwt from cookie

      const message = res.data; // e.g., "Token is valid. Logged in as: John"
      const nameMatch = message.match(/Logged in as:\s(.+)/);
      const name = nameMatch ? nameMatch[1] : "User";

      const email = "extracted@example.com"; // Optional: fetch from /me endpoint if needed

      const user = { name, email }; // you can improve this later
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("✅ Logged in successfully!", {
        position: "top-center",
        autoClose: 3000,
      });

      navigate("/");
    } catch (err) {
      console.error("OAuth redirect failed:", err);
      navigate("/authentication");
    }
  }

  handleOAuthRedirect();
}, []);

}