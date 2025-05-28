
import { useState } from "react";
import { Navigate } from "react-router-dom";
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
import { Wifi, Shield, Users, BarChart3, Menu, Crown, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";

export type ActiveView = 'dashboard' | 'users' | 'vouchers' | 'revenue' | 'analytics' | 'settings';

const Index = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, isLoading, isAdmin, isCoordinator, isUser } = useAuth();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out");
    } catch (error: any) {
      toast.error("Failed to sign out");
    }
  };

  const renderActiveView = () => {
    if (isUser) {
      return <UserDashboard />;
    }

    if (isCoordinator) {
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
    if (isAdmin) {
      return {
        name: "System Administrator",
        description: "Full system configuration, user & location management, marketing campaigns, advanced reporting",
        badge: "Administrator",
        color: "bg-red-500",
        icon: Crown,
        responsibilities: [
          "Configure system-wide settings & security",
          "Manage all user accounts & roles",
          "Oversee hotspot locations",
          "Create marketing campaigns",
          "Generate comprehensive reports"
        ]
      };
    } else if (isCoordinator) {
      return {
        name: "Moderator / Operator",
        description: "User management, voucher/QR generation, session monitoring, billing tasks, customer support",
        badge: "Moderator",
        color: "bg-blue-500",
        icon: Shield,
        responsibilities: [
          "Generate vouchers & QR codes",
          "Monitor active sessions",
          "Handle billing tasks",
          "Provide customer support",
          "Manage user sessions"
        ]
      };
    } else {
      return {
        name: "End User / Customer",
        description: "Connect using vouchers/QR codes, view personal session status, comply with usage policies",
        badge: "User",
        color: "bg-green-500",
        icon: User,
        responsibilities: [
          "Connect to WiFi network",
          "Access internet within plan limits",
          "View session status",
          "Comply with usage policies"
        ]
      };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        {(isAdmin || isCoordinator) && (
          <div className={`${isMobile ? 'fixed' : 'relative'} z-50 ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'} transition-transform duration-300 ease-in-out`}>
            <Sidebar 
              activeView={activeView} 
              onViewChange={(view) => {
                setActiveView(view);
                if (isMobile) setSidebarOpen(false);
              }}
              isAdmin={isAdmin}
              isCoordinator={isCoordinator}
            />
          </div>
        )}
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Professional Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 lg:px-6 py-3 lg:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1">
                  {/* Mobile Menu Button */}
                  {isMobile && (isAdmin || isCoordinator) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="lg:hidden p-2"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  )}
                  
                  <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
                    <div className={`${roleInfo.color} p-2 lg:p-3 rounded-xl text-white flex-shrink-0`}>
                      <RoleIcon className="h-4 w-4 lg:h-6 lg:w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">
                          {isMobile ? roleInfo.badge : roleInfo.name}
                        </h1>
                        <Badge variant="outline" className={`${roleInfo.color} text-white border-0 hidden sm:inline-flex`}>
                          {roleInfo.badge}
                        </Badge>
                      </div>
                      {!isMobile && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {roleInfo.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
                  {/* User Info */}
                  <div className="hidden sm:flex items-center space-x-2 bg-gray-50 px-2 lg:px-3 py-1 lg:py-2 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs lg:text-sm font-medium text-gray-800">
                      {profile?.full_name || user.email}
                    </span>
                  </div>
                  
                  {/* Sign Out Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="bg-white hover:bg-gray-50 border-gray-200"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Role Information Panel (for admin/coordinator only) */}
          {!isUser && !isMobile && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <div className="px-6 py-3">
                <Card className="border-blue-200 bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Key Responsibilities:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {roleInfo.responsibilities.map((responsibility, index) => (
                        <div key={index} className="flex items-center text-xs text-blue-800">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
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
