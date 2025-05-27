
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
  Eye,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useVouchers } from "@/hooks/useVouchers";
import { useHotspotUsers } from "@/hooks/useHotspotUsers";
import { useTransactions } from "@/hooks/useTransactions";

interface WiFiProfile {
  id: string;
  name: string;
  duration?: number; // in minutes
  dataLimit?: number; // in MB
  price: number;
  type: 'time' | 'data' | 'unlimited';
}

export const ModeratorDashboard = () => {
  const [activeView, setActiveView] = useState<'generate' | 'sessions' | 'history'>('generate');
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { vouchers, generateVoucher, isLoading: vouchersLoading } = useVouchers();
  const { users, disconnectUser, isLoading: usersLoading } = useHotspotUsers();
  const { addTransaction } = useTransactions();

  const wifiProfiles: WiFiProfile[] = [
    { id: '1h', name: '1 Hour Access', duration: 60, price: 2, type: 'time' },
    { id: '3h', name: '3 Hours Access', duration: 180, price: 5, type: 'time' },
    { id: '1d', name: '1 Day Access', duration: 1440, price: 10, type: 'time' },
    { id: '500mb', name: '500MB Data', dataLimit: 500, price: 3, type: 'data' },
    { id: '1gb', name: '1GB Data', dataLimit: 1024, price: 5, type: 'data' },
    { id: '5gb', name: '5GB Data', dataLimit: 5120, price: 15, type: 'data' },
    { id: 'unlimited', name: 'Unlimited Access', price: 20, type: 'unlimited' }
  ];

  const handleGenerateVoucher = async () => {
    if (!selectedProfile) {
      toast.error("Please select a WiFi profile");
      return;
    }

    const profile = wifiProfiles.find(p => p.id === selectedProfile);
    if (!profile) return;

    setIsGenerating(true);
    try {
      const newVouchers = await generateVoucher(
        profile.type,
        profile.duration || profile.dataLimit || 0,
        profile.price,
        1,
        profile.name
      );

      if (newVouchers && newVouchers.length > 0) {
        // Record the transaction
        await addTransaction({
          voucher_code: newVouchers[0].code,
          package_type: profile.type,
          amount: profile.price,
          customer: null,
          payment_method: 'cash',
          coordinator_id: null
        });

        toast.success(`Voucher generated: ${newVouchers[0].code}`);
      }
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsGenerating(false);
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

  const formatDuration = (start: string) => {
    const diff = Date.now() - new Date(start).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const filteredUsers = users.filter(user =>
    user.voucher_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.ip_address.includes(searchTerm)
  );

  const recentVouchers = vouchers.slice(0, 10);

  if (vouchersLoading || usersLoading) {
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
          <span>Active Sessions ({users.length})</span>
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
                onClick={handleGenerateVoucher} 
                className="w-full" 
                disabled={!selectedProfile || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Generate Voucher & QR Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5" />
                <span>Recent Vouchers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentVouchers.map((voucher) => (
                  <div key={voucher.id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono text-sm font-semibold">{voucher.code}</p>
                        <p className="text-xs text-gray-600">{voucher.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(voucher.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(voucher.status)}>
                          {voucher.status}
                        </Badge>
                        <p className="text-sm font-semibold mt-1">${voucher.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentVouchers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <QrCode className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No vouchers generated yet</p>
                    <p className="text-sm">Generate your first voucher above</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Sessions Section */}
      {activeView === 'sessions' && (
        <div className="space-y-6">
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
          </div>

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
                      <th className="text-left p-3">Session Time</th>
                      <th className="text-left p-3">Data Usage</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            {getDeviceIcon(user.device_type)}
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.ip_address}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          {user.voucher_code ? (
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {user.voucher_code}
                            </code>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-3">{formatDuration(user.session_start)}</td>
                        <td className="p-3">{user.data_used}MB</td>
                        <td className="p-3">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => disconnectUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Ban className="h-3 w-3 mr-1" />
                            Disconnect
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No active sessions</p>
                    <p className="text-sm">Users will appear here when they connect</p>
                  </div>
                )}
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
              <span>Voucher History ({vouchers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Voucher Code</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Value</th>
                    <th className="text-left p-3">Price</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Generated</th>
                    <th className="text-left p-3">Used By</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((voucher) => (
                    <tr key={voucher.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {voucher.code}
                        </code>
                      </td>
                      <td className="p-3 capitalize">{voucher.package_type}</td>
                      <td className="p-3">
                        {voucher.value} {voucher.package_type === 'time' ? 'min' : 'MB'}
                      </td>
                      <td className="p-3 font-semibold">${voucher.price}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(voucher.status)}>
                          {voucher.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(voucher.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {voucher.used_by || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vouchers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No voucher history</p>
                  <p className="text-sm">Generate vouchers to see history</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
