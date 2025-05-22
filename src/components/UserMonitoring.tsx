
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Smartphone, 
  Laptop, 
  Tablet,
  Clock,
  Activity,
  Wifi,
  Ban,
  RefreshCw
} from "lucide-react";

interface ActiveUser {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'laptop' | 'tablet';
  ipAddress: string;
  macAddress: string;
  sessionStart: Date;
  dataUsed: number;
  status: 'active' | 'idle';
  voucher?: string;
  location?: string;
}

export const UserMonitoring = () => {
  const [users, setUsers] = useState<ActiveUser[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time data
  useEffect(() => {
    const generateMockUsers = (): ActiveUser[] => {
      const deviceTypes: Array<'mobile' | 'laptop' | 'tablet'> = ['mobile', 'laptop', 'tablet'];
      const deviceNames = [
        'iPhone 14 Pro', 'Samsung Galaxy S23', 'MacBook Pro', 'Dell Laptop',
        'iPad Air', 'Google Pixel 7', 'Surface Pro', 'OnePlus 11'
      ];
      
      return Array.from({ length: Math.floor(Math.random() * 20) + 10 }, (_, i) => ({
        id: `user-${i + 1}`,
        deviceName: deviceNames[Math.floor(Math.random() * deviceNames.length)],
        deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        macAddress: `AA:BB:CC:DD:EE:${(Math.floor(Math.random() * 256)).toString(16).padStart(2, '0').toUpperCase()}`,
        sessionStart: new Date(Date.now() - Math.random() * 3600000),
        dataUsed: Math.floor(Math.random() * 500),
        status: Math.random() > 0.3 ? 'active' : 'idle',
        voucher: Math.random() > 0.5 ? `V${Math.floor(Math.random() * 10000)}` : undefined,
        location: Math.random() > 0.7 ? `Table ${Math.floor(Math.random() * 20) + 1}` : undefined
      }));
    };

    setUsers(generateMockUsers());
    
    const interval = setInterval(() => {
      setUsers(generateMockUsers());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'laptop': return <Laptop className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Wifi className="h-4 w-4" />;
    }
  };

  const formatDuration = (start: Date) => {
    const diff = Date.now() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalDataUsage = users.reduce((sum, user) => sum + user.dataUsed, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring of connected devices and sessions</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Connected</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Usage</CardTitle>
            <Wifi className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalDataUsage}MB</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">47m</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Connected Devices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Device</th>
                  <th className="text-left p-3">IP Address</th>
                  <th className="text-left p-3">Session Time</th>
                  <th className="text-left p-3">Data Used</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Voucher</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        {getDeviceIcon(user.deviceType)}
                        <div>
                          <p className="font-medium">{user.deviceName}</p>
                          <p className="text-sm text-gray-500">{user.macAddress}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-sm">{user.ipAddress}</td>
                    <td className="p-3">{formatDuration(user.sessionStart)}</td>
                    <td className="p-3">{user.dataUsed}MB</td>
                    <td className="p-3">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {user.voucher ? (
                        <Badge variant="outline">{user.voucher}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Ban className="h-3 w-3 mr-1" />
                        Disconnect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
