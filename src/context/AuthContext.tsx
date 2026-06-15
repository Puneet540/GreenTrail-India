// ============================================================
//  GreenTrail India — Auth Context
//  Wraps Firebase auth state + backend user profile
//  Usage: const { user, backendUser, loading } = useAuth();
// ============================================================

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "@/lib/firebase";
import { syncUser, getMyProfile, type UserProfile } from "@/lib/backendApi";

type AuthContextType = {
  firebaseUser: User | null;       // Firebase auth user
  backendUser: UserProfile | null; // MongoDB user profile
  loading: boolean;
  refreshBackendUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  backendUser: null,
  loading: true,
  refreshBackendUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [backendUser, setBackendUser]   = useState<UserProfile | null>(null);
  const [loading, setLoading]           = useState(true);

  const refreshBackendUser = async () => {
    try {
      const res = await getMyProfile();
      if (res.success) setBackendUser(res.data);
    } catch {
      setBackendUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      setFirebaseUser(user);

      if (user) {
        try {
          // Sync user to MongoDB on every login
          await syncUser({ name: user.displayName || "", photoURL: user.photoURL || "" });
          await refreshBackendUser();
        } catch (err) {
          console.error("Failed to sync user with backend:", err);
        }
      } else {
        setBackendUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, backendUser, loading, refreshBackendUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
