
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Users, 
  Clock,
  Wifi,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  MapPin
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

export const Analytics = () => {
  // Mock analytics data
  const hourlyUsage = [
    { hour: '00:00', users: 12, bandwidth: 45 },
    { hour: '02:00', users: 8, bandwidth: 30 },
    { hour: '04:00', users: 5, bandwidth: 20 },
    { hour: '06:00', users: 15, bandwidth: 55 },
    { hour: '08:00', users: 45, bandwidth: 120 },
    { hour: '10:00', users: 78, bandwidth: 180 },
    { hour: '12:00', users: 95, bandwidth: 220 },
    { hour: '14:00', users: 87, bandwidth: 200 },
    { hour: '16:00', users: 92, bandwidth: 210 },
    { hour: '18:00', users: 110, bandwidth: 250 },
    { hour: '20:00', users: 98, bandwidth: 230 },
    { hour: '22:00', users: 65, bandwidth: 150 }
  ];

  const deviceStats = [
    { device: 'Mobile', count: 156, percentage: 62 },
    { device: 'Laptop', count: 67, percentage: 27 },
    { device: 'Tablet', count: 28, percentage: 11 }
  ];

  const topServices = [
    { service: 'Social Media', usage: 45, bandwidth: '1.2TB' },
    { service: 'Video Streaming', usage: 32, bandwidth: '2.8TB' },
    { service: 'Web Browsing', usage: 18, bandwidth: '0.6TB' },
    { service: 'Gaming', usage: 5, bandwidth: '0.4TB' }
  ];

  const locationHeatmap = [
    { location: 'Table Area', users: 45, revenue: 340 },
    { location: 'Bar Section', users: 32, revenue: 280 },
    { location: 'Outdoor Patio', users: 28, revenue: 220 },
    { location: 'Private Booths', users: 15, revenue: 450 },
    { location: 'Lobby', users: 12, revenue: 150 }
  ];

  const weeklyTrends = [
    { day: 'Mon', users: 234, sessions: 156, revenue: 1240 },
    { day: 'Tue', users: 267, sessions: 189, revenue: 1450 },
    { day: 'Wed', users: 198, sessions: 134, revenue: 980 },
    { day: 'Thu', users: 289, sessions: 201, revenue: 1680 },
    { day: 'Fri', users: 445, sessions: 312, revenue: 2340 },
    { day: 'Sat', users: 523, sessions: 378, revenue: 2890 },
    { day: 'Sun', users: 398, sessions: 287, revenue: 2100 }
  ];

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'laptop': return <Monitor className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Wifi className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Deep insights into usage patterns and customer behavior</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border">
          <Activity className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">Real-time Analytics</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">523</div>
            <p className="text-xs text-gray-600">Yesterday at 6 PM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">47m</div>
            <p className="text-xs text-gray-600">+8m from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth Peak</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">250 MB/s</div>
            <p className="text-xs text-gray-600">Daily maximum</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">68%</div>
            <p className="text-xs text-gray-600">Customer retention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Usage Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>24-Hour Usage Pattern</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="h-5 w-5" />
              <span>Weekly Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#10B981" />
                <Bar dataKey="sessions" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Device Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceStats.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(device.device)}
                    <div>
                      <p className="font-medium">{device.device}</p>
                      <p className="text-sm text-gray-500">{device.count} devices</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{device.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationHeatmap.map((location, index) => (
                <div key={location.location} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-red-500' : 
                      index === 1 ? 'bg-orange-500' : 
                      index === 2 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{location.location}</p>
                      <p className="text-sm text-gray-500">{location.users} active users</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${location.revenue}</p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Popular Services & Bandwidth Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topServices.map((service, index) => (
              <div key={service.service} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{service.service}</h3>
                  <Badge variant={index === 0 ? 'default' : 'secondary'}>
                    #{index + 1}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span>{service.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${service.usage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Bandwidth</span>
                    <span className="font-medium">{service.bandwidth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
