
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

export type ActiveView = 'dashboard' | 'users' | 'vouchers' | 'revenue' | 'analytics' | 'settings';

const Index = () => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [userMode, setUserMode] = useState<'admin' | 'user' | 'moderator'>('admin');
  
  // Mock admin access for testing
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

  const getUserDisplayInfo = () => {
    if (userMode === 'admin') {
      return {
        name: "Test User",
        role: "Administrator (Test Mode)"
      };
    } else if (userMode === 'moderator') {
      return {
        name: "Moderator User",
        role: "Moderator/Operator Mode"
      };
    } else {
      return {
        name: "Guest User",
        role: "User Mode"
      };
    }
  };

  const getNextMode = () => {
    if (userMode === 'admin') return 'moderator';
    if (userMode === 'moderator') return 'user';
    return 'admin';
  };

  const getModeLabel = () => {
    if (userMode === 'admin') return 'Moderator';
    if (userMode === 'moderator') return 'User';
    return 'Admin';
  };

  const userInfo = getUserDisplayInfo();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
        {(userMode === 'admin' || userMode === 'moderator') && (
          <Sidebar 
            activeView={activeView} 
            onViewChange={setActiveView} 
            isAdmin={isAdmin}
            isCoordinator={isCoordinator}
          />
        )}
        <div className="flex-1 flex flex-col">
          {/* Header with user info and mode toggle */}
          <header className="bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center shadow-sm">
            <div>
              <h2 className="text-xl font-semibold">
                Welcome, {userInfo.name}
              </h2>
              <p className="text-sm text-gray-600">
                Role: {userInfo.role}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUserMode(getNextMode())}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Switch to {getModeLabel()} Mode
              </button>
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
