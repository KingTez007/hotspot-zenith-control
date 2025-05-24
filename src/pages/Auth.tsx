
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, Info } from "lucide-react";
import { signIn, signUp } from "@/lib/auth";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

// Test account credentials
const testAccounts = [
  { type: "Admin", email: "admin@hotspotpro.com", password: "admin123456", role: "admin" },
  { type: "Coordinator", email: "coordinator@hotspotpro.com", password: "coord123456", role: "coordinator" },
  { type: "User", email: "user@hotspotpro.com", password: "user123456", role: "user" }
];

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error("Email and password are required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn(loginEmail, loginPassword);
      toast.success("Login successful");
      navigate("/"); // Redirect to dashboard on success
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(`Login failed: ${error.message || "Invalid credentials"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerEmail || !registerPassword || !fullName) {
      toast.error("All fields are required");
      return;
    }
    
    if (registerPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(registerEmail, registerPassword, fullName);
      toast.success("Registration successful! Please check your email for verification.");
      setActiveTab("login");
      // Clear form fields
      setRegisterEmail("");
      setRegisterPassword("");
      setFullName("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(`Registration failed: ${error.message || "An error occurred"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to populate login form with test account credentials
  const selectTestAccount = (email: string, password: string) => {
    setLoginEmail(email);
    setLoginPassword(password);
    setActiveTab("login");
  };

  // Function to create test accounts
  const createTestAccounts = async () => {
    setIsLoading(true);
    
    try {
      for (const account of testAccounts) {
        try {
          // Check if the account already exists
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('full_name', `${account.type} User`)
            .single();
          
          if (existingUser) {
            console.log(`Account ${account.email} already exists`);
            continue;
          }
          
          // Try to sign up the test accounts
          await signUp(account.email, account.password, `${account.type} User`, account.role as any);
          toast.success(`Created ${account.type} test account`);
        } catch (error: any) {
          // If account already exists or other error, log it
          console.log(`Issue with ${account.email}: ${error.message}`);
          
          // If it's not a "user already registered" error, show it to the user
          if (!error.message?.includes("already registered")) {
            toast.error(`Error creating ${account.type} account: ${error.message}`);
          }
        }
      }
      
      toast.success("Test accounts are ready. You can now use them to log in.");
      
      // Auto-select the user account for convenience
      selectTestAccount(testAccounts[2].email, testAccounts[2].password);
      
    } catch (error: any) {
      console.error("Error creating test accounts:", error);
      toast.error(`Error creating test accounts: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Wifi className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-bold text-2xl text-gray-900">HotSpot Pro</h1>
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Manage your WiFi hotspot system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setShowTestAccounts(!showTestAccounts)}
            >
              <Info className="h-4 w-4" />
              {showTestAccounts ? "Hide Test Accounts" : "Show Test Accounts"}
            </Button>
          </div>
          
          {showTestAccounts && (
            <div className="mb-6 space-y-4">
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTitle className="text-yellow-800">Test Accounts</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  <p className="mb-2">Click on an account to automatically fill the login form:</p>
                  <div className="space-y-2">
                    {testAccounts.map((account) => (
                      <Button
                        key={account.type}
                        variant="outline"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => selectTestAccount(account.email, account.password)}
                      >
                        <span>{account.type} Account</span>
                        <span className="text-xs opacity-70">{account.email}</span>
                      </Button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-dashed border-yellow-400"
                      onClick={createTestAccounts}
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating accounts..." : "Create Test Accounts"}
                    </Button>
                    <p className="text-xs mt-1 text-yellow-700">
                      Click this button to create test accounts in the database if they don't exist yet.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerEmail">Email</Label>
                  <Input 
                    id="registerEmail" 
                    type="email" 
                    placeholder="your@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registerPassword">Password</Label>
                  <Input 
                    id="registerPassword" 
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            © 2025 HotSpot Pro. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
