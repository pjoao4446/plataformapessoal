import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Role = 'aluno' | 'professor' | 'admin';

type User = { 
  id: number; 
  name: string; 
  email: string; 
  role: Role;
  avatar_path?: string;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
} | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: Role) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  async function fetchMe(t: string) {
    const res = await fetch('http://localhost:4000/auth/me', {
      headers: { Authorization: `Bearer ${t}` },
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    } else {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Falha no login');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string, role?: Role) {
    const res = await fetch('http://localhost:4000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    if (!res.ok) throw new Error('Falha no registro');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  function updateUser(userData: Partial<User>) {
    if (user) {
      setUser({ ...user, ...userData });
    }
  }

  useMemo(() => {
    if (token && !user) {
      fetchMe(token).catch(() => {});
    }
  }, [token, user]);

  const value = useMemo(() => ({ user, token, login, register, logout, updateUser }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


