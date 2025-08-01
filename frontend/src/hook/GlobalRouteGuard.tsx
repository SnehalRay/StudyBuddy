// src/service/GlobalRouteGuard.tsx
import { useEffect } from "react";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import useUserStore from "../store/userStore";


// ----------------------------------------------------
// 🔒 GlobalRouteGuard
// 
// This component handles missing cookies
// ----------------------------------------------------




// Optional helper for reading cookies
const getCookie = (name: string): string | undefined => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
};

export default function GlobalRouteGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser); // To logout
  const user = useUserStore((state) => state.user);

  useEffect(() => {
  const path = location.pathname;

  // Log raw cookie string
  console.log("🍪 Current document.cookie:", document.cookie);

  const jwt = getCookie("jwt");
  const folderId = getCookie("folderSession");

  console.log("📦 Parsed Cookies → jwt:", jwt, "| folderSession:", folderId);

  const isWorkbook = !!matchPath("/workbook/:folderName", path);
  if (isWorkbook && !folderId) {
    console.warn("🚫 No folderSession cookie found. Redirecting to /");
    // navigate("/", { replace: true });
  }
}, [location]);


  return null;
}