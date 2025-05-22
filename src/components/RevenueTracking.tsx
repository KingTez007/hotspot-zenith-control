
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  CreditCard,
  PieChart,
  BarChart3
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from "recharts";

export const RevenueTracking = () => {
  // Mock data for charts
  const dailyRevenue = [
    { day: 'Mon', revenue: 245, vouchers: 49 },
    { day: 'Tue', revenue: 312, vouchers: 62 },
    { day: 'Wed', revenue: 189, vouchers: 38 },
    { day: 'Thu', revenue: 278, vouchers: 56 },
    { day: 'Fri', revenue: 445, vouchers: 89 },
    { day: 'Sat', revenue: 523, vouchers: 105 },
    { day: 'Sun', revenue: 398, vouchers: 80 }
  ];

  const voucherTypes = [
    { name: '1 Hour', value: 35, color: '#3B82F6' },
    { name: '3 Hours', value: 25, color: '#10B981' },
    { name: '1 Day', value: 20, color: '#8B5CF6' },
    { name: '1GB Data', value: 15, color: '#F59E0B' },
    { name: 'Premium', value: 5, color: '#EF4444' }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 8245 },
    { month: 'Feb', revenue: 9123 },
    { month: 'Mar', revenue: 10567 },
    { month: 'Apr', revenue: 11234 },
    { month: 'May', revenue: 12890 }
  ];

  const recentTransactions = [
    { id: '1', voucher: 'WIFI-3H-A1B2', amount: 12, time: '2 min ago', type: '3 Hours', payment: 'Cash' },
    { id: '2', voucher: 'WIFI-1H-C3D4', amount: 5, time: '5 min ago', type: '1 Hour', payment: 'Card' },
    { id: '3', voucher: 'WIFI-1GB-E5F6', amount: 8, time: '8 min ago', type: '1GB Data', payment: 'Digital' },
    { id: '4', voucher: 'WIFI-24H-G7H8', amount: 25, time: '12 min ago', type: 'Premium', payment: 'Cash' },
    { id: '5', voucher: 'WIFI-1H-I9J0', amount: 5, time: '15 min ago', type: '1 Hour', payment: 'Card' }
  ];

  const todayStats = {
    revenue: 2847,
    transactions: 156,
    averageTransaction: 18.25,
    growth: 12.5
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor sales, payments, and financial performance</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${todayStats.revenue}</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{todayStats.growth}% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayStats.transactions}</div>
            <p className="text-xs text-gray-600">vouchers sold today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${todayStats.averageTransaction}</div>
            <p className="text-xs text-gray-600">per voucher sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">$12,890</div>
            <p className="text-xs text-gray-600">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Daily Revenue (This Week)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Voucher Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Voucher Types Sold</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                <RechartsPieChart data={voucherTypes} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {voucherTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {voucherTypes.map((type) => (
                <div key={type.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                    <span className="text-sm">{type.name}</span>
                  </div>
                  <span className="text-sm font-medium">{type.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Monthly Revenue Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Recent Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-white px-2 py-1 rounded">{transaction.voucher}</code>
                      <Badge variant="outline">{transaction.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{transaction.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${transaction.amount}</p>
                    <p className="text-xs text-gray-500">{transaction.payment}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
