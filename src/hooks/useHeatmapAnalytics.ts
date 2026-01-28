import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EventRow {
  id: string;
  session_id: string;
  page_path: string;
  event_type: string;
  element_tag: string | null;
  element_text: string | null;
  element_id: string | null;
  element_class: string | null;
  x_position: number | null;
  y_position: number | null;
  viewport_width: number | null;
  viewport_height: number | null;
  scroll_depth: number | null;
  created_at: string;
}

interface ClickHotspot {
  element: string;
  count: number;
  elementText: string;
}

interface PageAction {
  page: string;
  clicks: number;
  scrolls: number;
  formSubmits: number;
}

interface ScrollDepthData {
  depth: string;
  count: number;
  percentage: number;
}

export function useHeatmapAnalytics(days: number = 7) {
  return useQuery({
    queryKey: ["heatmap-analytics", days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from("visitor_events")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;

      const events = data as EventRow[];

      // Calculate click hotspots (most clicked elements)
      const clickMap = new Map<string, { count: number; text: string }>();
      events
        .filter((e) => e.event_type === "click")
        .forEach((e) => {
          const key = e.element_id || e.element_text?.slice(0, 30) || e.element_tag || "unknown";
          const existing = clickMap.get(key);
          if (existing) {
            existing.count++;
          } else {
            clickMap.set(key, {
              count: 1,
              text: e.element_text?.slice(0, 50) || e.element_tag || "Unknown",
            });
          }
        });

      const clickHotspots: ClickHotspot[] = Array.from(clickMap.entries())
        .map(([element, data]) => ({
          element,
          count: data.count,
          elementText: data.text,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

      // Calculate page actions
      const pageActionMap = new Map<string, { clicks: number; scrolls: number; formSubmits: number }>();
      events.forEach((e) => {
        if (!pageActionMap.has(e.page_path)) {
          pageActionMap.set(e.page_path, { clicks: 0, scrolls: 0, formSubmits: 0 });
        }
        const page = pageActionMap.get(e.page_path)!;
        if (e.event_type === "click") page.clicks++;
        if (e.event_type === "scroll") page.scrolls++;
        if (e.event_type === "form_submit") page.formSubmits++;
      });

      const pageActions: PageAction[] = Array.from(pageActionMap.entries())
        .map(([page, data]) => ({ page, ...data }))
        .sort((a, b) => b.clicks + b.scrolls - (a.clicks + a.scrolls))
        .slice(0, 10);

      // Calculate scroll depth distribution
      const scrollEvents = events.filter((e) => e.event_type === "scroll" && e.scroll_depth);
      const totalScrollEvents = scrollEvents.length;
      const scrollDepths = [25, 50, 75, 100];
      const scrollDepthData: ScrollDepthData[] = scrollDepths.map((depth) => {
        const count = scrollEvents.filter((e) => e.scroll_depth === depth).length;
        return {
          depth: `${depth}%`,
          count,
          percentage: totalScrollEvents > 0 ? Math.round((count / totalScrollEvents) * 100) : 0,
        };
      });

      // Calculate total stats
      const totalClicks = events.filter((e) => e.event_type === "click").length;
      const totalScrolls = events.filter((e) => e.event_type === "scroll").length;
      const totalFormSubmits = events.filter((e) => e.event_type === "form_submit").length;
      const uniqueSessions = new Set(events.map((e) => e.session_id)).size;

      // Recent events
      const recentEvents = events.slice(0, 50);

      return {
        totalClicks,
        totalScrolls,
        totalFormSubmits,
        uniqueSessions,
        clickHotspots,
        pageActions,
        scrollDepthData,
        recentEvents,
      };
    },
  });
}
