import { createContext, useContext, ReactNode, FC, useState } from 'react';

interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface IUserContext {
  setTokens: ({ access_token, refresh_token }: Tokens) => void;
  tokens: Tokens;
  user?: any;
  setUser: (user: any) => void;
}

const initialValue: IUserContext = {
  setTokens: () => Promise.reject({ message: 'context not initialized' }),
  tokens: {
    access_token: '',
    refresh_token: '',
  },
  setUser: () => Promise.reject({ message: 'context not initialized' }),
};
const UserContext = createContext<IUserContext>(initialValue);

export const useUser = () => useContext(UserContext);

interface ApiProviderProps {
  children: ReactNode;
}

const UserProvider: FC<ApiProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>();
  const [tokens, setTokens] = useState<Tokens>({
    access_token: localStorage.getItem('access_token') || '',
    refresh_token: localStorage.getItem('refresh_token') || '',
  });
  return (
    <UserContext.Provider
      value={{
        setTokens,
        tokens,
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
