
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { UserMonitoring } from "@/components/UserMonitoring";
import { VoucherManagement } from "@/components/VoucherManagement";
import { RevenueTracking } from "@/components/RevenueTracking";
import { Settings } from "@/components/Settings";
import { Analytics } from "@/components/Analytics";
import UserDashboard from "@/components/UserDashboard";
import { ModeratorDashboard } from "@/components/ModeratorDashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Shield, Users, BarChart3 } from "lucide-react";

export type ActiveView = 'dashboard' | 'users' | 'vouchers' | 'revenue' | 'analytics' | 'settings';

const Index = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [userMode, setUserMode] = useState<'admin' | 'moderator' | 'user'>('admin');
  
  const isAdmin = userMode === 'admin';
  const isCoordinator = userMode === 'admin' || userMode === 'moderator';

  const renderActiveView = () => {
    if (userMode === 'user') {
      return <UserDashboard />;
    }

    if (userMode === 'moderator') {
      return <ModeratorDashboard />;
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveView} />;
      case 'users':
        return <UserMonitoring />;
      case 'vouchers':
        return <VoucherManagement />;
      case 'revenue':
        return <RevenueTracking />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  const getRoleInfo = () => {
    switch (userMode) {
      case 'admin':
        return {
          name: "System Administrator",
          description: "Full system configuration, user & location management, marketing campaigns, advanced reporting",
          badge: "Administrator",
          color: "bg-red-500",
          icon: Shield,
          responsibilities: [
            "Configure system-wide settings & security",
            "Manage all user accounts & roles",
            "Oversee hotspot locations",
            "Create marketing campaigns",
            "Generate comprehensive reports"
          ]
        };
      case 'moderator':
        return {
          name: "Moderator / Operator",
          description: "User management, voucher/QR generation, session monitoring, billing tasks, customer support",
          badge: "Moderator",
          color: "bg-blue-500",
          icon: Users,
          responsibilities: [
            "Generate vouchers & QR codes",
            "Monitor active sessions",
            "Handle billing tasks",
            "Provide customer support",
            "Manage user sessions"
          ]
        };
      case 'user':
        return {
          name: "End User / Customer",
          description: "Connect using vouchers/QR codes, view personal session status, comply with usage policies",
          badge: "User",
          color: "bg-green-500",
          icon: Wifi,
          responsibilities: [
            "Connect to WiFi network",
            "Access internet within plan limits",
            "View session status",
            "Comply with usage policies"
          ]
        };
    }
  };

  const getNextMode = () => {
    if (userMode === 'admin') return 'moderator';
    if (userMode === 'moderator') return 'user';
    return 'admin';
  };

  const getModeLabel = () => {
    if (userMode === 'admin') return 'Switch to Moderator';
    if (userMode === 'moderator') return 'Switch to User';
    return 'Switch to Administrator';
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
        {(userMode === 'admin' || userMode === 'moderator') && (
          <Sidebar 
            activeView={activeView} 
            onViewChange={setActiveView} 
            isAdmin={isAdmin}
            isCoordinator={isCoordinator}
          />
        )}
        <div className="flex-1 flex flex-col">
          {/* Professional Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className={`${roleInfo.color} p-3 rounded-xl text-white`}>
                      <RoleIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h1 className="text-xl font-semibold text-gray-900">
                          {roleInfo.name}
                        </h1>
                        <Badge variant="outline" className={`${roleInfo.color} text-white border-0`}>
                          {roleInfo.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {roleInfo.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Role Demo Switcher */}
                  <div className="hidden md:flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-600">Demo Mode:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUserMode(getNextMode())}
                      className="text-xs"
                    >
                      {getModeLabel()}
                    </Button>
                  </div>
                  
                  {/* System Status */}
                  <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-800">System Online</span>
                  </div>
                </div>
              </div>

              {/* Mobile Role Switcher */}
              <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUserMode(getNextMode())}
                  className="w-full"
                >
                  {getModeLabel()}
                </Button>
              </div>
            </div>
          </header>

          {/* Role Information Panel (for admin/moderator only) */}
          {userMode !== 'user' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <div className="px-6 py-3">
                <Card className="border-blue-200 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Key Responsibilities:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {roleInfo.responsibilities.map((responsibility, index) => (
                        <div key={index} className="flex items-center text-xs text-blue-800">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {responsibility}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <main className="flex-1 overflow-auto bg-gray-50">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
