
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { UserMonitoring } from "@/components/UserMonitoring";
import { VoucherManagement } from "@/components/VoucherManagement";
import { RevenueTracking } from "@/components/RevenueTracking";
import { Settings } from "@/components/Settings";
import { Analytics } from "@/components/Analytics";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";

export type ActiveView = 'dashboard' | 'users' | 'vouchers' | 'revenue' | 'analytics' | 'settings';

const Index = () => {
  const { user, profile, isAdmin, isCoordinator } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
    }
  };

  const renderActiveView = () => {
    // Only admins can access certain views
    if (activeView === 'revenue' || activeView === 'analytics') {
      if (!isAdmin) {
        return <Dashboard onNavigate={setActiveView} />;
      }
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          isAdmin={isAdmin}
          isCoordinator={isCoordinator}
        />
        <div className="flex-1 flex flex-col">
          {/* Header with user info and logout */}
          <header className="bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center shadow-sm">
            <div>
              <h2 className="text-xl font-semibold">
                Welcome, {profile?.full_name || user?.email}
              </h2>
              <p className="text-sm text-gray-600">
                Role: {profile?.role === 'admin' ? 'Administrator' : 
                      profile?.role === 'coordinator' ? 'Coordinator' : 'User'}
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </header>
          
          <main className="flex-1 overflow-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
