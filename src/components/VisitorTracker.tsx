import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { useRealtimePresence } from "@/hooks/useRealtimePresence";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";

export function VisitorTracker() {
  useVisitorTracking();
  useRealtimePresence();
  useInteractionTracking();
  return null;
}
