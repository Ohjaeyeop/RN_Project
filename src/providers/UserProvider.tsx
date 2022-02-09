import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type User = {
  username: string;
};

const UserContext = createContext<
  | {
      user: User | undefined;
      setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    }
  | undefined
>(undefined);

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
function UserProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const value = {user, setUser};
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export {UserProvider, useUser};
