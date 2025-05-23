
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
  TrendingUp
} from "lucide-react";
import type { ActiveView } from "@/pages/Index";

interface DashboardProps {
  onNavigate: (view: ActiveView) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/80 mt-1">Welcome back! Here's your hotspot overview.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-800">Live Data</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-xl transition-shadow cursor-pointer bg-white/90 backdrop-blur-sm border-0" onClick={() => onNavigate('users')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">247</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer bg-white/90 backdrop-blur-sm border-0" onClick={() => onNavigate('vouchers')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vouchers</CardTitle>
            <div className="bg-green-100 p-2 rounded-lg">
              <Ticket className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,234</div>
            <p className="text-xs text-gray-600">856 used today</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer bg-white/90 backdrop-blur-sm border-0" onClick={() => onNavigate('revenue')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <div className="bg-purple-100 p-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">$2,847</div>
            <p className="text-xs text-gray-600">Target: $3,000</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow bg-white/90 backdrop-blur-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth Usage</CardTitle>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Activity className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">78%</div>
            <p className="text-xs text-gray-600">2.4TB / 3.1TB</p>
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
              View Active Sessions
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              className="w-full justify-between bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={() => onNavigate('revenue')}
            >
              Export Revenue Report
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
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-medium">JD</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user connected</p>
                  <p className="text-xs text-gray-500">Device: iPhone 14 Pro - 2 min ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-medium">MS</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Voucher redeemed</p>
                  <p className="text-xs text-gray-500">1-hour pass - $5.00 - 5 min ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">TJ</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-gray-500">Premium voucher - $15.00 - 8 min ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
