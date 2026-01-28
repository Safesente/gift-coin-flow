import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface VisitorRow {
  id: string;
  session_id: string;
  page_path: string;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  created_at: string;
}

interface DailyVisit {
  date: string;
  visits: number;
  unique_visitors: number;
}

interface PageVisit {
  page: string;
  visits: number;
}

interface ReferrerVisit {
  referrer: string;
  visits: number;
}

export function useVisitorAnalytics(days: number = 30) {
  return useQuery({
    queryKey: ["visitor-analytics", days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from("visitors")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      const visitors = data as VisitorRow[];

      // Calculate total stats
      const totalVisits = visitors.length;
      const uniqueSessions = new Set(visitors.map((v) => v.session_id)).size;

      // Calculate daily visits
      const dailyMap = new Map<string, { visits: number; sessions: Set<string> }>();
      visitors.forEach((v) => {
        const date = new Date(v.created_at).toISOString().split("T")[0];
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { visits: 0, sessions: new Set() });
        }
        const entry = dailyMap.get(date)!;
        entry.visits++;
        entry.sessions.add(v.session_id);
      });

      const dailyVisits: DailyVisit[] = Array.from(dailyMap.entries())
        .map(([date, data]) => ({
          date,
          visits: data.visits,
          unique_visitors: data.sessions.size,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Calculate top pages
      const pageMap = new Map<string, number>();
      visitors.forEach((v) => {
        pageMap.set(v.page_path, (pageMap.get(v.page_path) || 0) + 1);
      });

      const topPages: PageVisit[] = Array.from(pageMap.entries())
        .map(([page, visits]) => ({ page, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10);

      // Calculate top referrers
      const refMap = new Map<string, number>();
      visitors.forEach((v) => {
        const ref = v.referrer || "Direct";
        refMap.set(ref, (refMap.get(ref) || 0) + 1);
      });

      const topReferrers: ReferrerVisit[] = Array.from(refMap.entries())
        .map(([referrer, visits]) => ({ referrer, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10);

      // Today's stats
      const today = new Date().toISOString().split("T")[0];
      const todayData = dailyMap.get(today);
      const todayVisits = todayData?.visits || 0;
      const todayUnique = todayData?.sessions.size || 0;

      return {
        totalVisits,
        uniqueSessions,
        todayVisits,
        todayUnique,
        dailyVisits,
        topPages,
        topReferrers,
        recentVisitors: visitors.slice(0, 50),
      };
    },
  });
}
