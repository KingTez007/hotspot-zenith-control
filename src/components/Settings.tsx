
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings as SettingsIcon, 
  Wifi, 
  Shield, 
  Palette,
  Bell,
  CreditCard,
  Users,
  Upload,
  Save
} from "lucide-react";
import { toast } from "sonner";

export const Settings = () => {
  const [settings, setSettings] = useState({
    // Network Settings
    networkName: "HotSpot Pro WiFi",
    networkPassword: "hotspot123",
    bandwidthLimit: "100",
    sessionTimeout: "60",
    
    // Security Settings
    requireVoucher: true,
    allowGuestAccess: false,
    dataEncryption: true,
    
    // Branding
    businessName: "Café Central",
    welcomeMessage: "Welcome to our free WiFi! Please purchase a voucher to get started.",
    primaryColor: "#3B82F6",
    logoUrl: "",
    
    // Notifications
    emailAlerts: true,
    smsAlerts: false,
    lowBandwidthAlert: true,
    
    // Payment
    paymentProvider: "stripe",
    currency: "USD",
    taxRate: "10",
    
    // User Management
    maxDevicesPerUser: "3",
    allowSocialLogin: true,
    collectUserData: false
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success("Settings saved successfully!");
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload to storage
      const url = URL.createObjectURL(file);
      setSettings(prev => ({ ...prev, logoUrl: url }));
      toast.success("Logo uploaded successfully!");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your hotspot system and preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <span>Network Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="networkName">Network Name (SSID)</Label>
              <Input
                id="networkName"
                value={settings.networkName}
                onChange={(e) => setSettings(prev => ({ ...prev, networkName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="networkPassword">Network Password</Label>
              <Input
                id="networkPassword"
                type="password"
                value={settings.networkPassword}
                onChange={(e) => setSettings(prev => ({ ...prev, networkPassword: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="bandwidthLimit">Bandwidth Limit (Mbps)</Label>
              <Input
                id="bandwidthLimit"
                type="number"
                value={settings.bandwidthLimit}
                onChange={(e) => setSettings(prev => ({ ...prev, bandwidthLimit: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Voucher for Access</Label>
                <p className="text-sm text-gray-500">Users must have a valid voucher to connect</p>
              </div>
              <Switch
                checked={settings.requireVoucher}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireVoucher: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Guest Access</Label>
                <p className="text-sm text-gray-500">Permit limited access without vouchers</p>
              </div>
              <Switch
                checked={settings.allowGuestAccess}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowGuestAccess: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Data Encryption</Label>
                <p className="text-sm text-gray-500">Enable WPA3 encryption</p>
              </div>
              <Switch
                checked={settings.dataEncryption}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dataEncryption: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Branding & Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Branding & Customization</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={settings.businessName}
                onChange={(e) => setSettings(prev => ({ ...prev, businessName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Textarea
                id="welcomeMessage"
                value={settings.welcomeMessage}
                onChange={(e) => setSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-20 h-10"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="logo">Business Logo</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
              {settings.logoUrl && (
                <img src={settings.logoUrl} alt="Logo preview" className="mt-2 h-16 w-16 object-cover rounded" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Alerts</Label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <Switch
                checked={settings.emailAlerts}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailAlerts: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Alerts</Label>
                <p className="text-sm text-gray-500">Receive notifications via SMS</p>
              </div>
              <Switch
                checked={settings.smsAlerts}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsAlerts: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Low Bandwidth Alert</Label>
                <p className="text-sm text-gray-500">Alert when bandwidth usage is high</p>
              </div>
              <Switch
                checked={settings.lowBandwidthAlert}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, lowBandwidthAlert: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentProvider">Payment Provider</Label>
              <Select value={settings.paymentProvider} onValueChange={(value) => 
                setSettings(prev => ({ ...prev, paymentProvider: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => 
                setSettings(prev => ({ ...prev, currency: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings(prev => ({ ...prev, taxRate: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="maxDevices">Max Devices Per User</Label>
              <Input
                id="maxDevices"
                type="number"
                value={settings.maxDevicesPerUser}
                onChange={(e) => setSettings(prev => ({ ...prev, maxDevicesPerUser: e.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Social Login</Label>
                <p className="text-sm text-gray-500">Enable Google, Facebook login</p>
              </div>
              <Switch
                checked={settings.allowSocialLogin}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowSocialLogin: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Collect User Data</Label>
                <p className="text-sm text-gray-500">Collect email and demographics</p>
              </div>
              <Switch
                checked={settings.collectUserData}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, collectUserData: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
