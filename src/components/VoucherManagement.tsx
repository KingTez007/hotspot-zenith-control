
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Ticket, 
  Plus, 
  Download, 
  Copy,
  Clock,
  Wifi,
  DollarSign,
  QrCode,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface Voucher {
  id: string;
  code: string;
  type: 'time' | 'data';
  value: number;
  price: number;
  status: 'active' | 'used' | 'expired';
  createdAt: Date;
  usedAt?: Date;
  description: string;
}

export const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([
    {
      id: '1',
      code: 'WIFI-1H-001',
      type: 'time',
      value: 60,
      price: 5,
      status: 'active',
      createdAt: new Date(),
      description: '1 Hour Access'
    },
    {
      id: '2',
      code: 'WIFI-3H-002',
      type: 'time',
      value: 180,
      price: 12,
      status: 'used',
      createdAt: new Date(),
      usedAt: new Date(),
      description: '3 Hours Access'
    },
    {
      id: '3',
      code: 'WIFI-1GB-003',
      type: 'data',
      value: 1024,
      price: 8,
      status: 'active',
      createdAt: new Date(),
      description: '1GB Data Package'
    }
  ]);

  const [newVoucher, setNewVoucher] = useState({
    type: 'time' as 'time' | 'data',
    value: '',
    price: '',
    quantity: '1',
    description: ''
  });

  const generateVoucherCode = (type: string, value: string) => {
    const prefix = type === 'time' ? 'TIME' : 'DATA';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${value}-${random}`;
  };

  const handleGenerateVouchers = () => {
    const quantity = parseInt(newVoucher.quantity);
    const value = parseInt(newVoucher.value);
    const price = parseFloat(newVoucher.price);

    if (!value || !price || quantity < 1) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newVouchers: Voucher[] = [];
    for (let i = 0; i < quantity; i++) {
      newVouchers.push({
        id: Date.now().toString() + i,
        code: generateVoucherCode(newVoucher.type, newVoucher.value),
        type: newVoucher.type,
        value,
        price,
        status: 'active',
        createdAt: new Date(),
        description: newVoucher.description || `${value} ${newVoucher.type === 'time' ? 'minutes' : 'MB'} access`
      });
    }

    setVouchers(prev => [...newVouchers, ...prev]);
    toast.success(`Generated ${quantity} voucher(s) successfully!`);
    
    // Reset form
    setNewVoucher({
      type: 'time',
      value: '',
      price: '',
      quantity: '1',
      description: ''
    });
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Voucher code copied to clipboard!");
  };

  const exportVouchers = () => {
    const activeVouchers = vouchers.filter(v => v.status === 'active');
    const csvContent = [
      'Code,Type,Value,Price,Description,Created',
      ...activeVouchers.map(v => 
        `${v.code},${v.type},${v.value},${v.price},"${v.description}",${v.createdAt.toLocaleDateString()}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vouchers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Vouchers exported successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeVouchers = vouchers.filter(v => v.status === 'active').length;
  const usedVouchers = vouchers.filter(v => v.status === 'used').length;
  const totalRevenue = vouchers.filter(v => v.status === 'used').reduce((sum, v) => sum + v.price, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voucher Management</h1>
          <p className="text-gray-600 mt-1">Generate, track, and manage WiFi access vouchers</p>
        </div>
        <Button onClick={exportVouchers}>
          <Download className="h-4 w-4 mr-2" />
          Export Vouchers
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vouchers</CardTitle>
            <Ticket className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeVouchers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used Today</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{usedVouchers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${totalRevenue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Generated</CardTitle>
            <QrCode className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{vouchers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Generate New Vouchers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Generate New Vouchers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={newVoucher.type} onValueChange={(value: 'time' | 'data') => 
                setNewVoucher(prev => ({ ...prev, type: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Time-based</SelectItem>
                  <SelectItem value="data">Data-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="value">
                {newVoucher.type === 'time' ? 'Minutes' : 'MB'}
              </Label>
              <Input
                id="value"
                type="number"
                value={newVoucher.value}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, value: e.target.value }))}
                placeholder={newVoucher.type === 'time' ? '60' : '1024'}
              />
            </div>

            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newVoucher.price}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, price: e.target.value }))}
                placeholder="5.00"
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={newVoucher.quantity}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newVoucher.description}
                onChange={(e) => setNewVoucher(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleGenerateVouchers} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vouchers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ticket className="h-5 w-5" />
            <span>Generated Vouchers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Code</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Value</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Created</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map((voucher) => (
                  <tr key={voucher.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {voucher.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyVoucherCode(voucher.code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {voucher.type === 'time' ? <Clock className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
                        <span className="capitalize">{voucher.type}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      {voucher.value} {voucher.type === 'time' ? 'min' : 'MB'}
                    </td>
                    <td className="p-3 font-semibold">${voucher.price}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(voucher.status)}>
                        {voucher.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {voucher.createdAt.toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Button variant="outline" size="sm">
                        <QrCode className="h-3 w-3 mr-1" />
                        QR Code
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
