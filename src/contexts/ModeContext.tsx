
import React, { createContext, useState, useContext } from 'react';

export type UserMode = 'admin' | 'coordinator' | 'user';

interface ModeContextProps {
  currentMode: UserMode;
  setCurrentMode: (mode: UserMode) => void;
  isAdmin: boolean;
  isCoordinator: boolean;
  isUser: boolean;
}

const ModeContext = createContext<ModeContextProps>({
  currentMode: 'admin',
  setCurrentMode: () => {},
  isAdmin: true,
  isCoordinator: false,
  isUser: false,
});

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<UserMode>('admin');

  const isAdmin = currentMode === 'admin';
  const isCoordinator = currentMode === 'coordinator';
  const isUser = currentMode === 'user';

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
