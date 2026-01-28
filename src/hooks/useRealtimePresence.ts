import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface PresenceState {
  page: string;
  online_at: string;
  session_id: string;
}

const getOrCreateSessionId = (): string => {
  const key = "gx_session_id";
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
};

export function useRealtimePresence() {
  const location = useLocation();

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    let channel: RealtimeChannel;

    const setupPresence = async () => {
      channel = supabase.channel("online-users", {
        config: {
          presence: {
            key: sessionId,
          },
        },
      });

      channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            page: location.pathname,
            online_at: new Date().toISOString(),
            session_id: sessionId,
          } as PresenceState);
        }
      });
    };

    setupPresence();

    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [location.pathname]);
}

export function useActiveUsersCount() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState<PresenceState[]>([]);

  useEffect(() => {
    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: "admin-listener",
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresenceState>();
        const allUsers: PresenceState[] = [];
        
        Object.values(state).forEach((presences) => {
          presences.forEach((presence) => {
            if (presence.session_id !== "admin-listener") {
              allUsers.push(presence);
            }
          });
        });

        // Dedupe by session_id
        const uniqueUsers = Array.from(
          new Map(allUsers.map((u) => [u.session_id, u])).values()
        );

        setUsers(uniqueUsers);
        setCount(uniqueUsers.length);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { count, users };
}
