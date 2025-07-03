import Link from "next/link";
import { Button } from "../ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, useSidebar } from "../ui/sidebar";

interface SidebarActionsProps {
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export default function SidebarActions({
  onRefresh,
  isRefreshing,
}: SidebarActionsProps) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <div className="flex gap-2">
          <Button
            className="flex-1 group-data-[collapsible=icon]:p-0"
            variant="default"
            size="sm"
            onClick={() => setOpenMobile(false)}
            asChild
          >
            <Link href="/">
              <Plus className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">
                New Chat
              </span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="group-data-[collapsible=icon]:hidden"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
