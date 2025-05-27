
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
  RefreshCw,
  Loader2,
  AlertTriangle,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { useVouchers } from "@/hooks/useVouchers";
import { useTransactions } from "@/hooks/useTransactions";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { validateVoucherData } from "@/utils/validation";
import { useFormValidation } from "@/hooks/useFormValidation";

export const VoucherManagement = () => {
  const { vouchers, isLoading, generateVoucher, refreshVouchers, deleteVoucher } = useVouchers();
  const { transactions } = useTransactions();
  const [isGenerating, setIsGenerating] = useState(false);
  const { dialog, showConfirmDialog, hideConfirmDialog, handleConfirm } = useConfirmDialog();

  const initialFormValues = {
    type: 'time' as 'time' | 'data',
    value: '',
    price: '',
    quantity: '1',
    description: ''
  };

  const validationRules = {
    type: (value: string) => !value ? 'Package type is required' : null,
    value: (value: string) => {
      if (!value) return 'Value is required';
      const num = parseInt(value);
      if (isNaN(num) || num <= 0) return 'Value must be a positive number';
      return null;
    },
    price: (value: string) => {
      if (!value) return 'Price is required';
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) return 'Price must be a positive number';
      if (num > 1000) return 'Price cannot exceed $1000';
      return null;
    },
    quantity: (value: string) => {
      if (!value) return 'Quantity is required';
      const num = parseInt(value);
      if (isNaN(num) || num <= 0) return 'Quantity must be a positive number';
      if (num > 100) return 'Cannot generate more than 100 vouchers at once';
      return null;
    },
    description: () => null // Optional field
  };

  const form = useFormValidation(initialFormValues, validationRules);

  const handleGenerateVouchers = async () => {
    if (!form.validateAll()) {
      toast.error("Please fix the form errors before generating vouchers");
      return;
    }

    const { type, value, price, quantity, description } = form.values;
    const validation = validateVoucherData(type, value, price, quantity);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    const quantityNum = parseInt(quantity);
    const valueNum = parseInt(value);
    const priceNum = parseFloat(price);

    showConfirmDialog({
      title: 'Generate Vouchers',
      message: `Generate ${quantityNum} voucher(s) of ${valueNum} ${type === 'time' ? 'minutes' : 'MB'} for $${priceNum} each?`,
      confirmText: 'Generate',
      variant: 'default',
      onConfirm: async () => {
        setIsGenerating(true);
        try {
          await generateVoucher(type, valueNum, priceNum, quantityNum, description);
          form.reset();
          toast.success(`Successfully generated ${quantityNum} voucher(s)!`);
        } catch (error) {
          console.error('Error generating vouchers:', error);
          toast.error('Failed to generate vouchers. Please try again.');
        } finally {
          setIsGenerating(false);
        }
      }
    });
  };

  const handleDeleteVoucher = (voucherId: string, voucherCode: string) => {
    showConfirmDialog({
      title: 'Delete Voucher',
      message: `Are you sure you want to delete voucher "${voucherCode}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          await deleteVoucher(voucherId);
          toast.success('Voucher deleted successfully');
        } catch (error) {
          console.error('Error deleting voucher:', error);
          toast.error('Failed to delete voucher');
        }
      }
    });
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Voucher code copied to clipboard!");
  };

  const exportVouchers = () => {
    if (vouchers.length === 0) {
      toast.error("No vouchers to export");
      return;
    }

    const activeVouchers = vouchers.filter(v => v.status === 'active');
    if (activeVouchers.length === 0) {
      toast.error("No active vouchers to export");
      return;
    }

    const csvContent = [
      'Code,Type,Value,Price,Description,Created',
      ...activeVouchers.map(v => 
        `${v.code},${v.package_type},${v.value},${v.price},"${v.description || ''}",${new Date(v.created_at).toLocaleDateString()}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vouchers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`Exported ${activeVouchers.length} active vouchers successfully!`);
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
  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Voucher Management</h1>
          <p className="text-gray-600 mt-1">Generate, track, and manage WiFi access vouchers</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refreshVouchers} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportVouchers} disabled={vouchers.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Vouchers
          </Button>
        </div>
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
            <div className="text-2xl font-bold text-purple-600">${totalRevenue.toFixed(2)}</div>
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
              <Select 
                value={form.values.type} 
                onValueChange={(value: 'time' | 'data') => form.setValue('type', value)}
              >
                <SelectTrigger className={form.errors.type && form.touched.type ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Time-based</SelectItem>
                  <SelectItem value="data">Data-based</SelectItem>
                </SelectContent>
              </Select>
              {form.errors.type && form.touched.type && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {form.errors.type}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="value">
                {form.values.type === 'time' ? 'Minutes' : 'MB'}
              </Label>
              <Input
                id="value"
                type="number"
                value={form.values.value}
                onChange={(e) => form.setValue('value', e.target.value)}
                onBlur={() => form.setFieldTouched('value')}
                placeholder={form.values.type === 'time' ? '60' : '1024'}
                className={form.errors.value && form.touched.value ? 'border-red-500' : ''}
              />
              {form.errors.value && form.touched.value && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {form.errors.value}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={form.values.price}
                onChange={(e) => form.setValue('price', e.target.value)}
                onBlur={() => form.setFieldTouched('price')}
                placeholder="5.00"
                className={form.errors.price && form.touched.price ? 'border-red-500' : ''}
              />
              {form.errors.price && form.touched.price && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {form.errors.price}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={form.values.quantity}
                onChange={(e) => form.setValue('quantity', e.target.value)}
                onBlur={() => form.setFieldTouched('quantity')}
                placeholder="1"
                className={form.errors.quantity && form.touched.quantity ? 'border-red-500' : ''}
              />
              {form.errors.quantity && form.touched.quantity && (
                <p className="text-sm text-red-500 mt-1 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {form.errors.quantity}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={form.values.description}
                onChange={(e) => form.setValue('description', e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleGenerateVouchers} 
                className="w-full"
                disabled={isGenerating || !form.isValid}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
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
            <span>Generated Vouchers ({vouchers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vouchers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No vouchers generated yet</p>
              <p className="text-sm">Create your first voucher using the form above</p>
            </div>
          ) : (
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
                          {voucher.package_type === 'time' ? <Clock className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
                          <span className="capitalize">{voucher.package_type}</span>
                        </div>
                      </td>
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
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <QrCode className="h-3 w-3 mr-1" />
                            QR Code
                          </Button>
                          {voucher.status === 'active' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteVoucher(voucher.id, voucher.code)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        dialog={dialog}
        onConfirm={handleConfirm}
        onCancel={hideConfirmDialog}
      />
    </div>
  );
};
