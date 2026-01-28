import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const getSessionId = (): string => {
  const key = "gx_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
};

// Debounce function to limit event frequency
function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

export function useInteractionTracking() {
  const location = useLocation();
  const maxScrollRef = useRef(0);
  const lastScrollSentRef = useRef(0);

  const trackEvent = useCallback(async (eventData: {
    event_type: string;
    element_tag?: string;
    element_text?: string;
    element_id?: string;
    element_class?: string;
    x_position?: number;
    y_position?: number;
    scroll_depth?: number;
  }) => {
    try {
      const sessionId = getSessionId();
      
      await supabase.from("visitor_events").insert({
        session_id: sessionId,
        page_path: location.pathname,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        ...eventData,
      });
    } catch (error) {
      // Silently fail
      console.error("Failed to track event:", error);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Reset scroll tracking on page change
    maxScrollRef.current = 0;
    lastScrollSentRef.current = 0;

    // Track clicks on interactive elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveElements = ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"];
      
      // Find the closest interactive element
      const interactive = target.closest("button, a, input, select, textarea, [role='button'], [data-track]");
      
      if (interactive || interactiveElements.includes(target.tagName)) {
        const element = (interactive || target) as HTMLElement;
        const rect = element.getBoundingClientRect();
        
        trackEvent({
          event_type: "click",
          element_tag: element.tagName.toLowerCase(),
          element_text: element.textContent?.slice(0, 100) || undefined,
          element_id: element.id || undefined,
          element_class: element.className?.toString()?.slice(0, 200) || undefined,
          x_position: Math.round(rect.left + rect.width / 2),
          y_position: Math.round(rect.top + rect.height / 2),
        });
      }
    };

    // Track scroll depth (debounced)
    const handleScroll = debounce(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      
      // Only track if we've scrolled deeper
      if (scrollPercent > maxScrollRef.current) {
        maxScrollRef.current = scrollPercent;
        
        // Send at 25%, 50%, 75%, 100% thresholds
        const thresholds = [25, 50, 75, 100];
        const currentThreshold = thresholds.find(t => scrollPercent >= t && lastScrollSentRef.current < t);
        
        if (currentThreshold) {
          lastScrollSentRef.current = currentThreshold;
          trackEvent({
            event_type: "scroll",
            scroll_depth: currentThreshold,
          });
        }
      }
    }, 500);

    // Track form submissions
    const handleSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      trackEvent({
        event_type: "form_submit",
        element_tag: "form",
        element_id: form.id || undefined,
        element_class: form.className || undefined,
      });
    };

    document.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("submit", handleSubmit as EventListener, { passive: true });

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("submit", handleSubmit as EventListener);
    };
  }, [location.pathname, trackEvent]);
}
