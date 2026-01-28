import { Users, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActiveUsersCount } from "@/hooks/useRealtimePresence";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ActiveUsersWidget() {
  const { count, users } = useActiveUsersCount();

  // Group users by page
  const pageGroups = users.reduce((acc, user) => {
    acc[user.page] = (acc[user.page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
        <div className="flex items-center gap-1">
          <Circle className="h-2 w-2 fill-green-500 text-green-500 animate-pulse" />
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">
              <div className="text-2xl font-bold text-green-600">{count}</div>
              <p className="text-xs text-muted-foreground">
                {count === 1 ? "visitor online" : "visitors online"}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[200px]">
            {count === 0 ? (
              <p>No visitors currently online</p>
            ) : (
              <div className="space-y-1">
                <p className="font-medium">Active pages:</p>
                {Object.entries(pageGroups).map(([page, pageCount]) => (
                  <div key={page} className="flex justify-between text-xs">
                    <span className="truncate max-w-[120px]">{page}</span>
                    <span className="ml-2 font-medium">{pageCount}</span>
                  </div>
                ))}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </CardContent>
    </Card>
  );
}
