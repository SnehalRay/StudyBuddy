import { useEffect, useRef } from "react";
import { useLocation, matchPath } from "react-router-dom";
import api from "../api/axios";

// THE POINT OF THIS FILE IS TO HANDLE THE EXITING OF THE FOLDER ACROSS THE WHOLE APP AS IT DEALS WITH COOKIES AND EVERYTHING


const exitFolder = async () => {
  try {
    await api.post("/folder/exitFolder");
  } catch (error) {
    console.error("Error exiting folder", error);
  }
};

export default function WorkbookSessionManager() {
  const location = useLocation();
  const prevLocation = useRef(location);
  const activated = useRef(false); // ⬅️ Track if active after delay

  useEffect(() => {
    const from = prevLocation.current.pathname;
    const to = location.pathname;

    const wasWorkbook = !!matchPath("/workbook/:folderName", from);
    const nowWorkbook = !!matchPath("/workbook/:folderName", to);


    // Only trigger after activation
    if (activated.current && wasWorkbook && !nowWorkbook) {
      exitFolder();
    console.log(wasWorkbook);
    console.log(nowWorkbook);
    console.log("From:", from, "To:", to, "wasWorkbook:", wasWorkbook, "nowWorkbook:", nowWorkbook, "activated:", activated.current);


    }
    prevLocation.current = location;
  }, [location]);

  // Handle browser/tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      navigator.sendBeacon && navigator.sendBeacon("/folder/exitFolder");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    exitFolder();
    
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return null;
}
