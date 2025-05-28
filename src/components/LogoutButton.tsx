
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export const LogoutButton = ({ 
  variant = "outline", 
  size = "sm", 
  className = "",
  showText = true 
}: LogoutButtonProps) => {
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignOut}
      className={`bg-white hover:bg-gray-50 border-gray-200 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      {showText && <span className="ml-1 hidden sm:inline">Sign Out</span>}
    </Button>
  );
};
