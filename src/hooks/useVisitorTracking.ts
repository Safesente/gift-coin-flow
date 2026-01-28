import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const getOrCreateSessionId = (): string => {
  const key = "gx_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
};

export function useVisitorTracking() {
  const location = useLocation();

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const sessionId = getOrCreateSessionId();
        
        await supabase.from("visitors").insert({
          session_id: sessionId,
          page_path: location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.error("Failed to track visit:", error);
      }
    };

    trackVisit();
  }, [location.pathname]);
}
