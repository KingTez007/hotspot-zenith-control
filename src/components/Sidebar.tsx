
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  DollarSign, 
  BarChart3, 
  Settings,
  Wifi,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { ActiveView } from "@/pages/Index";

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

const navigationItems = [
  { id: 'dashboard' as ActiveView, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users' as ActiveView, label: 'User Monitoring', icon: Users },
  { id: 'vouchers' as ActiveView, label: 'Voucher Management', icon: Ticket },
  { id: 'revenue' as ActiveView, label: 'Revenue Tracking', icon: DollarSign },
  { id: 'analytics' as ActiveView, label: 'Analytics', icon: BarChart3 },
  { id: 'settings' as ActiveView, label: 'Settings', icon: Settings },
];

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-white/95 backdrop-blur-sm shadow-xl flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Wifi className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">HotSpot Pro</h1>
              <p className="text-sm text-gray-500">WiFi Management</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed ? "px-2" : "px-4",
                activeView === item.id && "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && item.label}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={cn(
          "bg-green-50 border border-green-200 rounded-lg p-3",
          isCollapsed && "p-2"
        )}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium text-green-800">System Online</p>
                <p className="text-xs text-green-600">All services running</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
