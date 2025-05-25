
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  DollarSign, 
  BarChart3, 
  Settings,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Shield,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { ActiveView } from "@/pages/Index";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  isAdmin?: boolean;
  isCoordinator?: boolean;
}

export const Sidebar = ({ 
  activeView, 
  onViewChange, 
  isAdmin = false,
  isCoordinator = false
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Define navigation items with role-based access
  const navigationItems = [
    { 
      id: 'dashboard' as ActiveView, 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Overview & Analytics',
      access: true,
      adminOnly: false
    },
    { 
      id: 'users' as ActiveView, 
      label: 'User Monitoring', 
      icon: Users,
      description: 'Real-time Sessions',
      access: isAdmin || isCoordinator,
      adminOnly: false
    },
    { 
      id: 'vouchers' as ActiveView, 
      label: 'Voucher Management', 
      icon: Ticket,
      description: 'Generate & Track',
      access: isAdmin || isCoordinator,
      adminOnly: false
    },
    { 
      id: 'revenue' as ActiveView, 
      label: 'Revenue Tracking', 
      icon: DollarSign,
      description: 'Financial Reports',
      access: isAdmin,
      adminOnly: true
    },
    { 
      id: 'analytics' as ActiveView, 
      label: 'Analytics', 
      icon: BarChart3,
      description: 'Advanced Reports',
      access: isAdmin,
      adminOnly: true
    },
    { 
      id: 'settings' as ActiveView, 
      label: 'Settings', 
      icon: Settings,
      description: 'System Configuration',
      access: true,
      adminOnly: false
    },
  ];

  // Filter navigation items based on role access
  const availableNavigationItems = navigationItems.filter(item => item.access);

  const shouldCollapse = isCollapsed && !isMobile;

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 shadow-lg flex flex-col transition-all duration-300",
      shouldCollapse ? "w-16" : isMobile ? "w-72" : "w-72",
      "h-screen"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        {!shouldCollapse && (
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl">
              <Wifi className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">HotSpot Pro</h1>
              <p className="text-sm text-gray-500">WiFi Management System</p>
            </div>
          </div>
        )}
        
        {!shouldCollapse && (
          <div className="flex items-center space-x-2">
            {isAdmin ? (
              <Badge className="bg-red-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Administrator
              </Badge>
            ) : (
              <Badge className="bg-blue-500 text-white">
                <Shield className="h-3 w-3 mr-1" />
                Moderator
              </Badge>
            )}
          </div>
        )}
        
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn("p-2 mt-3", shouldCollapse && "w-full")}
          >
            {shouldCollapse ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {availableNavigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3",
                shouldCollapse ? "px-3" : "px-4",
                isActive && "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md",
                !isActive && "hover:bg-gray-50 text-gray-700"
              )}
              onClick={() => onViewChange(item.id)}
            >
              <div className="flex items-center w-full">
                <Icon className={cn("h-5 w-5 flex-shrink-0", !shouldCollapse && "mr-3")} />
                {!shouldCollapse && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-blue-100" : "text-gray-500"
                    )}>
                      {item.description}
                    </div>
                  </div>
                )}
                {!shouldCollapse && item.adminOnly && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs ml-2",
                      isActive ? "border-blue-200 text-blue-100" : "border-red-200 text-red-600"
                    )}
                  >
                    Admin
                  </Badge>
                )}
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className={cn(
          "bg-green-50 border border-green-200 rounded-xl p-3",
          shouldCollapse && "p-2"
        )}>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
            {!shouldCollapse && (
              <div>
                <p className="text-sm font-medium text-green-800">System Status</p>
                <p className="text-xs text-green-600">All services operational</p>
              </div>
            )}
          </div>
        </div>
        
        {!shouldCollapse && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400">Version 2.1.0</p>
          </div>
        )}
      </div>
    </div>
  );
};
