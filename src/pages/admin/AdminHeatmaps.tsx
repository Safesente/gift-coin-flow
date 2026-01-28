import { useState } from "react";
import { 
  MousePointer2, 
  ScrollText, 
  FileText,
  Users,
  TrendingUp,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useHeatmapAnalytics } from "@/hooks/useHeatmapAnalytics";
import { Loader2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

export default function AdminHeatmaps() {
  const [days, setDays] = useState(7);
  const { data, isLoading } = useHeatmapAnalytics(days);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Heatmaps & Actions</h1>
            <p className="text-muted-foreground">Track user interactions and behavior patterns.</p>
          </div>
          <Select value={days.toString()} onValueChange={(v) => setDays(Number(v))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24 hours</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last {days} days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scroll Events</CardTitle>
              <ScrollText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalScrolls.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Depth tracking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Form Submissions</CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.totalFormSubmits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Completed forms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.uniqueSessions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">With interactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Click Hotspots & Scroll Depth */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer2 className="h-5 w-5" />
                Click Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.clickHotspots.length ? (
                <div className="space-y-3">
                  {data.clickHotspots.slice(0, 8).map((hotspot, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{hotspot.elementText}</p>
                        <p className="text-xs text-muted-foreground truncate">{hotspot.element}</p>
                      </div>
                      <Badge variant="secondary">{hotspot.count} clicks</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No click data yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="h-5 w-5" />
                Scroll Depth Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.scrollDepthData.some(d => d.count > 0) ? (
                <div className="space-y-4">
                  {data.scrollDepthData.map((depth, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{depth.depth} scrolled</span>
                        <span className="text-muted-foreground">{depth.count} sessions</span>
                      </div>
                      <Progress value={depth.percentage} className="h-2" />
                    </div>
                  ))}
                  <div className="pt-4">
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={data.scrollDepthData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          dataKey="count"
                          nameKey="depth"
                          label={({ depth }) => depth}
                        >
                          {data.scrollDepthData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No scroll data yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Page Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Actions by Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.pageActions.length ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.pageActions} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis 
                      type="category" 
                      dataKey="page" 
                      tick={{ fontSize: 11 }}
                      width={100}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="clicks" name="Clicks" fill="hsl(var(--primary))" stackId="a" />
                    <Bar dataKey="scrolls" name="Scrolls" fill="hsl(var(--chart-2))" stackId="a" />
                    <Bar dataKey="formSubmits" name="Forms" fill="hsl(var(--chart-3))" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No page action data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead className="hidden md:table-cell">Element</TableHead>
                    <TableHead className="hidden lg:table-cell">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.recentEvents.slice(0, 20).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {format(new Date(event.created_at), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{event.page_path}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            event.event_type === "click" ? "default" : 
                            event.event_type === "scroll" ? "secondary" : 
                            "outline"
                          }
                        >
                          {event.event_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {event.element_tag || "-"}
                        {event.scroll_depth && ` (${event.scroll_depth}%)`}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground truncate max-w-[200px]">
                        {event.element_text || event.element_id || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
