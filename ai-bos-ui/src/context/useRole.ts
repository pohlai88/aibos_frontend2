// src/context/useRole.ts
import { createContext, useContext, useState } from 'react';

export type RoleType = 'admin' | 'finance' | 'auditor' | 'api-user' | 'super-admin';

const RoleContext = createContext<{
  role: RoleType;
  setRole: React.Dispatch<React.SetStateAction<RoleType>>;
}>({
  role: 'auditor',
  setRole: () => {},
});

export const RoleProvider = ({
  children,
  value = 'auditor',
}: {
  children: React.ReactNode;
  value?: RoleType;
}) => {
  const [role, setRole] = useState<RoleType>(value);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
