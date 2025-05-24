
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    // Show loading indicator while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // User is authenticated, render the children
  return <Outlet />;
};

export const AdminRoute = () => {
  const { isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If user is not an admin, redirect to dashboard
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export const CoordinatorRoute = () => {
  const { isCoordinator, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Admins and coordinators can access coordinator routes
  if (!isCoordinator && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};
