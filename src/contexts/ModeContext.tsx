
import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

export type UserMode = 'admin' | 'coordinator' | 'user';

interface ModeContextProps {
  currentMode: UserMode;
  setCurrentMode: (mode: UserMode) => void;
  isAdmin: boolean;
  isCoordinator: boolean;
  isUser: boolean;
}

const ModeContext = createContext<ModeContextProps>({
  currentMode: 'user',
  setCurrentMode: () => {},
  isAdmin: false,
  isCoordinator: false,
  isUser: true,
});

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isCoordinator, isUser } = useAuth();

  // Determine current mode based on auth
  const currentMode: UserMode = isAdmin ? 'admin' : isCoordinator ? 'coordinator' : 'user';

  // This function is kept for compatibility but doesn't actually change mode
  const setCurrentMode = (mode: UserMode) => {
    console.warn('Mode switching is now handled by authentication. Please sign in with the appropriate role.');
  };

  return (
    <ModeContext.Provider value={{ 
      currentMode,
      setCurrentMode,
      isAdmin,
      isCoordinator,
      isUser
    }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => useContext(ModeContext);
