import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { useRealtimePresence } from "@/hooks/useRealtimePresence";

export function VisitorTracker() {
  useVisitorTracking();
  useRealtimePresence();
  return null;
}
