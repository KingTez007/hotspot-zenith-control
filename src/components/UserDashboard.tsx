
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Clock, Shield, Globe, Smartphone, Zap, Lock, HelpCircle } from "lucide-react";
import { toast } from "sonner";

const UserDashboard = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [activeTab, setActiveTab] = useState<'voucher' | 'free'>('voucher');
  const [voucherCode, setVoucherCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionType, setConnectionType] = useState<'premium' | 'free' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Splash screen countdown
  useEffect(() => {
    if (showSplash && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      const autoClose = setTimeout(() => setShowSplash(false), 100);
      return () => clearTimeout(autoClose);
    }
  }, [showSplash, countdown]);

  const handleAdClick = () => {
    toast.success("🍕 Redirecting to Mario's Pizza Palace... Special Offer: 30% OFF!");
    setTimeout(() => setShowSplash(false), 1000);
  };

  const handleVoucherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const validCodes = ['WIFI2024', 'PREMIUM', 'GUEST123', 'VIP2024', 'COFFEE20', 'DEMO', 'TEST', 'FREE2024'];
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (validCodes.includes(voucherCode.toUpperCase()) || voucherCode.length >= 4) {
        setIsConnected(true);
        setConnectionType('premium');
        toast.success(`✅ Premium WiFi Connected! Voucher: ${voucherCode.toUpperCase()}`);
      } else {
        toast.error("Invalid voucher code. Try: DEMO, TEST, or WIFI2024");
      }
    }, 2000);
  };

  const handleFreeAccess = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      setConnectionType('free');
      toast.success("🎉 Free WiFi Connected! 30 minutes of browsing available.");
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectionType(null);
    setVoucherCode('');
    toast.info("Disconnected from WiFi");
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-gradient-to-45 from-red-400 via-blue-400 to-green-400 bg-[length:400%_400%] animate-[gradientShift_8s_ease_infinite] flex flex-col z-50">
        <div className="flex justify-between items-center p-5 text-white">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
            {countdown > 0 ? `Skip in ${countdown}s` : 'Skip Now'}
          </div>
          <button
            onClick={() => setShowSplash(false)}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center p-10 text-center text-white">
          <div
            className="w-30 h-30 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center text-5xl mb-8 animate-[float_3s_ease-in-out_infinite] cursor-pointer hover:scale-105 transition-transform"
            onClick={handleAdClick}
          >
            🍕
          </div>
          <h1 className="text-3xl font-bold mb-4 text-shadow">Mario's Pizza Palace</h1>
          <p className="text-lg mb-8 opacity-90">Get 30% OFF on your first order!</p>
          <button
            onClick={handleAdClick}
            className="bg-white/90 text-gray-800 px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:scale-105 transition-all uppercase tracking-wide"
          >
            Order Now & Save
          </button>
        </div>
        
        <div className="p-5 text-center text-white/80 text-sm">
          🎯 Sponsored Content • Click anywhere to learn more
        </div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl animate-pulse">
              📶
            </div>
            <CardTitle className="text-2xl text-green-700">WiFi Connected!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Connection Details:</h3>
              <div className="space-y-1 text-sm text-green-700">
                <p>• Status: ✅ CONNECTED</p>
                <p>• Type: {connectionType === 'premium' ? 'Premium WiFi' : 'Free WiFi'}</p>
                <p>• Speed: {Math.floor(Math.random() * 40) + 10} Mbps</p>
                <p>• Start Time: {new Date().toLocaleTimeString()}</p>
                {connectionType === 'free' && <p>• Duration: 30 minutes</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-xs text-blue-700">High Speed</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">🔒</div>
                <div className="text-xs text-purple-700">Secure</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">🌍</div>
                <div className="text-xs text-green-700">Global Access</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg text-center">
                <div className="text-2xl mb-1">📱</div>
                <div className="text-xs text-orange-700">All Devices</div>
              </div>
            </div>

            <Button onClick={handleDisconnect} variant="outline" className="w-full">
              Disconnect
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-5 flex items-center justify-center text-white text-3xl animate-pulse">
            📶
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Free WiFi Hotspot</CardTitle>
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>{isConnected ? 'Connected' : 'Not Connected'}</span>
          </div>
        </CardHeader>

        <CardContent>
          {/* Tab Selection */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('voucher')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'voucher'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Voucher Code
            </button>
            <button
              onClick={() => setActiveTab('free')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'free'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Free Access
            </button>
          </div>

          {activeTab === 'voucher' ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border-l-4 border-green-500">
                <h3 className="font-semibold text-gray-800 mb-2">🎫 Enter Your Voucher Code</h3>
                <p className="text-sm text-gray-600">
                  <strong>🚀 QUICK DEMO CODES:</strong> Try "DEMO", "TEST", or "WIFI2024"<br />
                  <em>Or enter any 4+ character code to connect instantly!</em>
                </p>
              </div>

              <form onSubmit={handleVoucherLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Voucher Code
                  </label>
                  <Input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g., WIFI2024)"
                    className="text-center font-semibold uppercase tracking-wide text-lg py-5 bg-gray-50 border-2 focus:border-green-500"
                    maxLength={12}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-5 text-lg font-bold uppercase tracking-wide relative overflow-hidden"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Connecting...
                    </div>
                  ) : (
                    '🚀 Connect to Premium WiFi'
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border-l-4 border-green-500">
                <h3 className="font-semibold text-gray-800 mb-2">🆓 Free Internet Access</h3>
                <p className="text-sm text-gray-600">
                  <strong>✅ INSTANT CONNECTION!</strong> Click below to connect immediately.<br />
                  <em>No codes needed - just one click to get online!</em>
                </p>
              </div>

              <Button
                onClick={handleFreeAccess}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-5 text-lg font-bold relative overflow-hidden"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connecting...
                  </div>
                ) : (
                  '📱 Connect to Free WiFi'
                )}
              </Button>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-xs text-gray-600 font-medium">High Speed</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-xs text-gray-600 font-medium">Secure</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">🌍</div>
              <div className="text-xs text-gray-600 font-medium">Global Access</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-xs text-gray-600 font-medium">All Devices</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={() => toast.info("🆘 Support: Phone: 1-800-WIFI-HELP\nEmail: support@freewifi.com")}
              className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4" />
              Need Help?
            </button>
            <div className="flex gap-2">
              {['📘', '🐦', '📷'].map((emoji, index) => (
                <button
                  key={index}
                  className="w-8 h-8 bg-gray-100 hover:bg-green-500 hover:text-white rounded-full flex items-center justify-center text-sm transition-all hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
