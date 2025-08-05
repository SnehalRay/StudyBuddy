import { useEffect, useRef } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { api } from "../api/axios";


// ----------------------------------------------------
// 🔒 WorkbookSessionManager
// This component tracks when the user ENTERS and EXITS
// the /workbook/:folderName route.
// When exiting, it calls the backend API to cleanup
// the session (e.g., delete cookies, unlock folder, etc).
//
// It also handles tab/browser close using sendBeacon.
// This component is invisible and should be mounted globally.
// ----------------------------------------------------


const exitFolder = async () => {
  try {
    console.log("📡 Calling API: /folder/exitFolder");
    await api.post("/folder/exitFolder");
    console.log("✅ exitFolder() called successfully");
  } catch (error) {
    console.error("❌ Error exiting folder", error);
  }
};

export default function WorkbookSessionManager() {
  const location = useLocation();
  const prevLocation = useRef(location);
  const activated = useRef(false); // ensures we don’t run on initial mount
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // manage debounce timer


    // -----------------------------------------
  // 📍 Detect Route Changes
  // Checks if the user navigated away from /workbook/:folderName
  // If yes, and we're not on first load, trigger exitFolder().
  // Adds a small delay (150ms) to let routing/rendering stabilize.
  // -----------------------------------------
  useEffect(() => {
    // Clear any previously scheduled execution
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const from = prevLocation.current.pathname;
      const to = location.pathname;

      const wasWorkbook = !!matchPath("/workbook/:folderName", from);
      const nowWorkbook = !!matchPath("/workbook/:folderName", to);

      console.log("📍 Route changed FROM:", from, "TO:", to);
      console.log("🧠 wasWorkbook:", wasWorkbook, "nowWorkbook:", nowWorkbook);

      if (activated.current && wasWorkbook && !nowWorkbook) {
        console.log("🔔 Detected exit from workbook. Triggering exitFolder()");
        exitFolder();
      }

      prevLocation.current = location;
      activated.current = true;
    }, 150); // Adjust delay here (ms)

    return () => {
      // Clean up timer if effect is re-triggered early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [location]);


    // -----------------------------------------
  // 🧳 Handle Tab Close / Refresh
  // When the user closes or reloads the tab,
  // use sendBeacon to tell the backend to exit the folder.
  // This runs only once (on component mount).
  // -----------------------------------------
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("🧹 Tab is closing or refreshing → sendBeacon exitFolder()");
      navigator.sendBeacon?.("/folder/exitFolder");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return null;
}
