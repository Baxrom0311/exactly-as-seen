import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Role } from "@/api/types";
import { mockApi } from "@/api/mockApi";

interface AuthCtx {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<User>;
  register: (data: { full_name: string; phone: string; password: string; role: Role; age?: number; gender?: "M" | "F"; language?: "uz" | "ru" | "en" }) => Promise<User>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (phone: string, password: string) => {
    const res = await mockApi.login(phone, password);
    localStorage.setItem("access_token", res.access_token);
    setUser(res.user);
    return res.user;
  };

  const register = async (data: any) => {
    const res = await mockApi.register(data);
    localStorage.setItem("access_token", res.access_token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be inside AuthProvider");
  return v;
}

export function homeForRole(role?: Role) {
  if (role === "family") return "/family-dashboard";
  if (role === "doctor") return "/doctor-dashboard";
  return "/dashboard";
}
