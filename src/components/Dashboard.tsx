
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Ticket, 
  DollarSign, 
  Activity, 
  ArrowRight,
  Wifi,
  Clock,
  TrendingUp,
  Loader2,
  RefreshCw
} from "lucide-react";
import type { ActiveView } from "@/pages/Index";
import { useVouchers } from "@/hooks/useVouchers";
import { useHotspotUsers } from "@/hooks/useHotspotUsers";
import { useTransactions } from "@/hooks/useTransactions";

interface DashboardProps {
  onNavigate: (view: ActiveView) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { vouchers, isLoading: vouchersLoading, refreshVouchers } = useVouchers();
  const { users, isLoading: usersLoading, refreshUsers } = useHotspotUsers();
  const { transactions, isLoading: transactionsLoading, refreshTransactions } = useTransactions();

  const isLoading = vouchersLoading || usersLoading || transactionsLoading;

  const activeUsers = users.filter(u => u.status === 'active').length;
  const activeVouchers = vouchers.filter(v => v.status === 'active').length;
  const todayRevenue = transactions
    .filter(t => new Date(t.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalDataUsage = users.reduce((sum, user) => sum + user.data_used, 0);

  const refreshAllData = async () => {
    await Promise.all([
      refreshVouchers(),
      refreshUsers(),
      refreshTransactions()
    ]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/80 mt-1">Welcome back! Here's your hotspot overview.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={refreshAllData}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
          <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-800">Live Data</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="hover:shadow-xl transition-all duration-200 cursor-pointer bg-white/90 backdrop-blur-sm border-0 hover:scale-105" 
          onClick={() => onNavigate('users')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeUsers}</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {users.length} total connected
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-xl transition-all duration-200 cursor-pointer bg-white/90 backdrop-blur-sm border-0 hover:scale-105" 
          onClick={() => onNavigate('vouchers')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vouchers</CardTitle>
            <div className="bg-green-100 p-2 rounded-lg">
              <Ticket className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeVouchers}</div>
            <p className="text-xs text-gray-600">{vouchers.filter(v => v.status === 'used').length} used today</p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-xl transition-all duration-200 cursor-pointer bg-white/90 backdrop-blur-sm border-0 hover:scale-105" 
          onClick={() => onNavigate('revenue')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <div className="bg-purple-100 p-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${todayRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-600">{transactions.length} total transactions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-200 bg-white/90 backdrop-blur-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Usage</CardTitle>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Activity className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalDataUsage}MB</div>
            <p className="text-xs text-gray-600">Total consumed</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5 text-indigo-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-between bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
              onClick={() => onNavigate('vouchers')}
            >
              Generate New Vouchers
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              className="w-full justify-between bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={() => onNavigate('users')}
            >
              Monitor Active Sessions
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              className="w-full justify-between bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={() => onNavigate('revenue')}
            >
              View Revenue Reports
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">User connected</p>
                    <p className="text-xs text-gray-500">Device: {user.name} - {user.ip_address}</p>
                  </div>
                </div>
              ))}
              
              {transactions.slice(0, 2).map((transaction) => (
                <div key={transaction.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
                    $
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment received</p>
                    <p className="text-xs text-gray-500">{transaction.voucher_code} - ${transaction.amount}</p>
                  </div>
                </div>
              ))}

              {users.length === 0 && transactions.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs">Generate vouchers or connect users to see activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
