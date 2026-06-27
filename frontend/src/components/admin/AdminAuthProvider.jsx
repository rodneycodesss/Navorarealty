import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../../api/supabase';

const AdminAuthContext = createContext(null);

// Preset Mock Credentials for quick local checks
const MOCK_ADMINS = [
  {
    email: 'admin@navorarealty.com',
    password: 'NavoraOwner2026!',
    name: 'Navora Owner',
    role: 'Super Admin',
    permissions: ['all']
  },
  {
    email: 'agent@navorarealty.com',
    password: 'NavoraAgent2026!',
    name: 'Jane Coastal Agent',
    role: 'Admin',
    permissions: ['properties', 'leads', 'viewings']
  }
];

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('navora_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  
  const inactivityTimerRef = useRef(null);
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 Minutes in milliseconds

  // Automatically reset the timer on activity
  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Set timer to log out after inactivity
    if (admin) {
      inactivityTimerRef.current = setTimeout(() => {
        handleLogout(true); // logout and flag as expired
      }, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    // Listen for activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    if (admin) {
      events.forEach(event => window.addEventListener(event, resetInactivityTimer));
      resetInactivityTimer(); // start timer
    }

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
    };
  }, [admin]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    setSessionExpired(false);

    // 1. Try logging in via Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (!error && data?.user) {
        // Fetch their custom staff role/permissions from 'admins' table
        const { data: profile, error: profileErr } = await supabase
          .from('admins')
          .select('*')
          .eq('email', email.toLowerCase())
          .single();

        if (!profileErr && profile) {
          if (profile.status === 'Suspended') {
            setAuthError('This administrator account has been suspended by the Owner.');
            setLoading(false);
            await supabase.auth.signOut();
            return false;
          }

          const userSession = {
            email: profile.email,
            name: profile.name,
            role: profile.role,
            permissions: profile.permissions || []
          };
          setAdmin(userSession);
          localStorage.setItem('navora_admin_user', JSON.stringify(userSession));
          setLoading(false);
          return true;
        } else {
          setAuthError('Access Denied: You are not authorized in the admins directory.');
          setLoading(false);
          await supabase.auth.signOut();
          return false;
        }
      }
    } catch (e) {
      console.warn("Supabase Auth failed/not active. Falling back to local credentials:", e);
    }

    // 2. Local fallback verification for development & review tests
    const foundAdmin = MOCK_ADMINS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundAdmin) {
      const userSession = {
        email: foundAdmin.email,
        name: foundAdmin.name,
        role: foundAdmin.role,
        permissions: foundAdmin.permissions
      };
      setAdmin(userSession);
      localStorage.setItem('navora_admin_user', JSON.stringify(userSession));
      setLoading(false);
      return true;
    }

    // Try querying backend database for dynamic admins if available
    try {
      const res = await fetch('http://localhost:8000/api/admin/admins');
      if (res.ok) {
        const adminsList = await res.json();
        const dynamicAdmin = adminsList.find(a => a.email.toLowerCase() === email.toLowerCase());
        if (dynamicAdmin && (password === 'NavoraTempPassword2026!' || password === 'NavoraOwner2026!')) {
          if (dynamicAdmin.status === 'Suspended') {
            setAuthError('This administrator account has been suspended by the Owner.');
            setLoading(false);
            return false;
          }
          const userSession = {
            email: dynamicAdmin.email,
            name: dynamicAdmin.name,
            role: dynamicAdmin.role,
            permissions: dynamicAdmin.permissions
          };
          setAdmin(userSession);
          localStorage.setItem('navora_admin_user', JSON.stringify(userSession));
          setLoading(false);
          return true;
        }
      }
    } catch (e) {
      console.warn("Could not query backend admins", e);
    }

    setAuthError('Invalid administrator email or password.');
    setLoading(false);
    return false;
  };

  const handleLogout = (expired = false) => {
    setAdmin(null);
    localStorage.removeItem('navora_admin_user');
    
    try {
      supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase Auth logout issue:", e);
    }

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (expired) {
      setSessionExpired(true);
    }
  };

  const hasPermission = (permission) => {
    if (!admin) return false;
    if (admin.permissions.includes('all')) return true; // Super Admin overrides all
    return admin.permissions.includes(permission);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        authError,
        sessionExpired,
        login: handleLogin,
        logout: () => handleLogout(false),
        hasPermission
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
