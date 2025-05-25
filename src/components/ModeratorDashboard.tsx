
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wifi, 
  QrCode, 
  Users, 
  Clock, 
  Database,
  Power,
  Plus,
  Search,
  Timer,
  Ban,
  RefreshCw,
  History,
  Smartphone,
  Monitor,
  Tablet,
  Download,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface WiFiProfile {
  id: string;
  name: string;
  duration?: number; // in minutes
  dataLimit?: number; // in MB
  price: number;
  type: 'time' | 'data' | 'unlimited';
}

interface ActiveUser {
  id: string;
  voucherCode: string;
  deviceName: string;
  deviceType: 'mobile' | 'laptop' | 'tablet';
  macAddress: string;
  ipAddress: string;
  connectionTime: Date;
  dataUsed: number;
  dataLimit?: number;
  timeLimit?: number;
  timeUsed: number;
  status: 'active' | 'warning' | 'expired';
  signalStrength: number;
}

interface GeneratedVoucher {
  id: string;
  code: string;
  profile: WiFiProfile;
  qrCode: string;
  generatedAt: Date;
  usedAt?: Date;
  usedBy?: string;
  status: 'unused' | 'used' | 'expired';
}

export const ModeratorDashboard = () => {
  const [activeView, setActiveView] = useState<'generate' | 'sessions' | 'history'>('generate');
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [generatedVoucher, setGeneratedVoucher] = useState<GeneratedVoucher | null>(null);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [voucherHistory, setVoucherHistory] = useState<GeneratedVoucher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const wifiProfiles: WiFiProfile[] = [
    { id: '1h', name: '1 Hour Access', duration: 60, price: 2, type: 'time' },
    { id: '3h', name: '3 Hours Access', duration: 180, price: 5, type: 'time' },
    { id: '1d', name: '1 Day Access', duration: 1440, price: 10, type: 'time' },
    { id: '500mb', name: '500MB Data', dataLimit: 500, price: 3, type: 'data' },
    { id: '1gb', name: '1GB Data', dataLimit: 1024, price: 5, type: 'data' },
    { id: '5gb', name: '5GB Data', dataLimit: 5120, price: 15, type: 'data' },
    { id: 'unlimited', name: 'Unlimited Access', price: 20, type: 'unlimited' }
  ];

  // Mock data for active users
  useEffect(() => {
    const mockUsers: ActiveUser[] = [
      {
        id: '1',
        voucherCode: 'WIFI-1H-001',
        deviceName: 'iPhone 14 Pro',
        deviceType: 'mobile',
        macAddress: 'AA:BB:CC:DD:EE:01',
        ipAddress: '192.168.1.101',
        connectionTime: new Date(Date.now() - 1800000), // 30 min ago
        dataUsed: 245,
        timeLimit: 60,
        timeUsed: 30,
        status: 'active',
        signalStrength: 85
      },
      {
        id: '2',
        voucherCode: 'WIFI-3H-002',
        deviceName: 'MacBook Pro',
        deviceType: 'laptop',
        macAddress: 'AA:BB:CC:DD:EE:02',
        ipAddress: '192.168.1.102',
        connectionTime: new Date(Date.now() - 3600000), // 1 hour ago
        dataUsed: 512,
        timeLimit: 180,
        timeUsed: 60,
        status: 'active',
        signalStrength: 92
      },
      {
        id: '3',
        voucherCode: 'WIFI-500MB-003',
        deviceName: 'Samsung Galaxy S23',
        deviceType: 'mobile',
        macAddress: 'AA:BB:CC:DD:EE:03',
        ipAddress: '192.168.1.103',
        connectionTime: new Date(Date.now() - 900000), // 15 min ago
        dataUsed: 450,
        dataLimit: 500,
        timeUsed: 15,
        status: 'warning',
        signalStrength: 78
      }
    ];
    setActiveUsers(mockUsers);
  }, []);

  const generateVoucher = () => {
    if (!selectedProfile) {
      toast.error("Please select a WiFi profile");
      return;
    }

    const profile = wifiProfiles.find(p => p.id === selectedProfile);
    if (!profile) return;

    const voucherCode = `WIFI-${profile.id.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const qrCodeData = `WIFI:T:WPA;S:Free-WiFi-Hotspot;P:${voucherCode};;`;
    
    const newVoucher: GeneratedVoucher = {
      id: Date.now().toString(),
      code: voucherCode,
      profile,
      qrCode: qrCodeData,
      generatedAt: new Date(),
      status: 'unused'
    };

    setGeneratedVoucher(newVoucher);
    setVoucherHistory(prev => [newVoucher, ...prev]);
    toast.success(`Voucher generated: ${voucherCode}`);
  };

  const disconnectUser = (userId: string) => {
    const user = activeUsers.find(u => u.id === userId);
    if (user) {
      setActiveUsers(prev => prev.filter(u => u.id !== userId));
      toast.success(`Disconnected ${user.deviceName}`);
    }
  };

  const extendSession = (userId: string) => {
    const user = activeUsers.find(u => u.id === userId);
    if (user) {
      // Mock extending session
      toast.success(`Extended session for ${user.deviceName}`);
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'laptop': return <Monitor className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Wifi className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeRemaining = (timeLimit?: number, timeUsed?: number) => {
    if (!timeLimit) return 'Unlimited';
    const remaining = timeLimit - (timeUsed || 0);
    if (remaining <= 0) return 'Expired';
    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDataRemaining = (dataLimit?: number, dataUsed?: number) => {
    if (!dataLimit) return 'Unlimited';
    const remaining = dataLimit - (dataUsed || 0);
    if (remaining <= 0) return 'Exhausted';
    return `${remaining}MB`;
  };

  const getDataProgress = (dataLimit?: number, dataUsed?: number) => {
    if (!dataLimit) return 0;
    return Math.min((dataUsed || 0) / dataLimit * 100, 100);
  };

  const getTimeProgress = (timeLimit?: number, timeUsed?: number) => {
    if (!timeLimit) return 0;
    return Math.min((timeUsed || 0) / timeLimit * 100, 100);
  };

  const filteredUsers = activeUsers.filter(user =>
    user.voucherCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.ipAddress.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Moderator Dashboard</h1>
          <p className="text-gray-600 mt-1">Generate vouchers and monitor WiFi sessions</p>
        </div>
        <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-800">System Online</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeView === 'generate' ? 'default' : 'ghost'}
          onClick={() => setActiveView('generate')}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Generate Voucher</span>
        </Button>
        <Button
          variant={activeView === 'sessions' ? 'default' : 'ghost'}
          onClick={() => setActiveView('sessions')}
          className="flex items-center space-x-2"
        >
          <Users className="h-4 w-4" />
          <span>Active Sessions ({activeUsers.length})</span>
        </Button>
        <Button
          variant={activeView === 'history' ? 'default' : 'ghost'}
          onClick={() => setActiveView('history')}
          className="flex items-center space-x-2"
        >
          <History className="h-4 w-4" />
          <span>Voucher History</span>
        </Button>
      </div>

      {/* Generate Voucher Section */}
      {activeView === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voucher Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wifi className="h-5 w-5" />
                <span>WiFi Profile Selection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profile">Select WiFi Profile</Label>
                <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a profile for the customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {wifiProfiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{profile.name}</span>
                          <Badge variant="outline">${profile.price}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProfile && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Selected Profile Details</h4>
                  {(() => {
                    const profile = wifiProfiles.find(p => p.id === selectedProfile);
                    return profile ? (
                      <div className="mt-2 text-sm text-blue-800">
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Price:</strong> ${profile.price}</p>
                        {profile.duration && <p><strong>Duration:</strong> {profile.duration} minutes</p>}
                        {profile.dataLimit && <p><strong>Data Limit:</strong> {profile.dataLimit}MB</p>}
                        {profile.type === 'unlimited' && <p><strong>Type:</strong> Unlimited Access</p>}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              <Button 
                onClick={generateVoucher} 
                className="w-full" 
                disabled={!selectedProfile}
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Voucher & QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Generated Voucher Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5" />
                <span>Generated Voucher</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedVoucher ? (
                <div className="text-center space-y-4">
                  <div className="bg-gray-100 p-6 rounded-lg">
                    <div className="w-48 h-48 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center border-2 border-gray-300">
                      <QrCode className="h-24 w-24 text-gray-400" />
                      <div className="absolute text-xs text-gray-500 mt-20">QR Code</div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Scan with mobile device</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Voucher Code:</p>
                    <div className="bg-gray-900 text-white p-3 rounded-lg font-mono text-lg">
                      {generatedVoucher.code}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg text-sm">
                    <p className="text-green-800 font-semibold">Instructions for Customer:</p>
                    <ul className="text-green-700 mt-2 space-y-1">
                      <li>📱 <strong>Mobile:</strong> Scan QR code to connect instantly</li>
                      <li>💻 <strong>Laptop/PC:</strong> Enter voucher code on WiFi login page</li>
                      <li>🔗 <strong>Network:</strong> Connect to "Free-WiFi-Hotspot"</li>
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Print Voucher
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Generate a voucher to display QR code</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Sessions Section */}
      {activeView === 'sessions' && (
        <div className="space-y-6">
          {/* Search and Controls */}
          <div className="flex justify-between items-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by voucher code, device, or IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Active Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Active Sessions ({filteredUsers.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Device</th>
                      <th className="text-left p-3">Voucher Code</th>
                      <th className="text-left p-3">Time Remaining</th>
                      <th className="text-left p-3">Data Usage</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Signal</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            {getDeviceIcon(user.deviceType)}
                            <div>
                              <p className="font-medium">{user.deviceName}</p>
                              <p className="text-sm text-gray-500">{user.ipAddress}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {user.voucherCode}
                          </code>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Timer className="h-3 w-3" />
                              <span className="text-sm">{formatTimeRemaining(user.timeLimit, user.timeUsed)}</span>
                            </div>
                            {user.timeLimit && (
                              <Progress value={getTimeProgress(user.timeLimit, user.timeUsed)} className="h-1" />
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Database className="h-3 w-3" />
                              <span className="text-sm">{user.dataUsed}MB / {formatDataRemaining(user.dataLimit, user.dataUsed)}</span>
                            </div>
                            {user.dataLimit && (
                              <Progress value={getDataProgress(user.dataLimit, user.dataUsed)} className="h-1" />
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${user.signalStrength > 80 ? 'bg-green-500' : user.signalStrength > 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm">{user.signalStrength}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => extendSession(user.id)}>
                              <Clock className="h-3 w-3 mr-1" />
                              Extend
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => disconnectUser(user.id)} className="text-red-600 hover:text-red-700">
                              <Ban className="h-3 w-3 mr-1" />
                              Disconnect
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Voucher History Section */}
      {activeView === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Voucher History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Voucher Code</th>
                    <th className="text-left p-3">Profile</th>
                    <th className="text-left p-3">Generated</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Used By</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {voucherHistory.map((voucher) => (
                    <tr key={voucher.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {voucher.code}
                        </code>
                      </td>
                      <td className="p-3">{voucher.profile.name}</td>
                      <td className="p-3 text-sm text-gray-600">
                        {voucher.generatedAt.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(voucher.status)}>
                          {voucher.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {voucher.usedBy || '-'}
                      </td>
                      <td className="p-3">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
