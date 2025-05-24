
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { UserMonitoring } from "@/components/UserMonitoring";
import { VoucherManagement } from "@/components/VoucherManagement";
import { RevenueTracking } from "@/components/RevenueTracking";
import { Settings } from "@/components/Settings";
import { Analytics } from "@/components/Analytics";
import { SidebarProvider } from "@/components/ui/sidebar";

export type ActiveView = 'dashboard' | 'users' | 'vouchers' | 'revenue' | 'analytics' | 'settings';

const Index = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  
  // Mock admin access for testing
  const isAdmin = true;
  const isCoordinator = true;

  const renderActiveView = () => {
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
          {/* Header with user info */}
          <header className="bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center shadow-sm">
            <div>
              <h2 className="text-xl font-semibold">
                Welcome, Test User
              </h2>
              <p className="text-sm text-gray-600">
                Role: Administrator (Test Mode)
              </p>
            </div>
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
