import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, Theme, Persona, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import { DEMO_USERS } from '../data/demo';

interface AppContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  toggleLocale: () => void;
  theme: Theme;
  toggleTheme: () => void;
  persona: Persona;
  setPersona: (p: Persona) => void;
  currentProfile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register', intendedDestination?: string) => void;
  closeAuthModal: () => void;
  judgeDemoLogin: (role?: Persona) => void;
  logout: () => void;
  navigateWithAuth: (targetTab: string) => void;
  t: typeof translations['bn'];
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Locale preference (Bengali by default)
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('bhumidisha_locale');
    return saved === 'en' ? 'en' : 'bn';
  });

  // Theme preference: DEFAULT TO LIGHT MODE! Versioned key to prevent dark override
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('bhumidisha_theme_v3');
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Ephemeral session state
  const [persona, setPersonaState] = useState<Persona>('citizen');
  const [profiles, setProfiles] = useState(DEMO_USERS);
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [intendedTab, setIntendedTab] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Sync theme with DOM documentElement (both data-theme and class)
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('bhumidisha_theme_v3', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  const setLocale = (loc: Locale) => {
    setLocaleState(loc);
    localStorage.setItem('bhumidisha_locale', loc);
    document.documentElement.lang = loc;
  };

  const toggleLocale = () => {
    setLocale(locale === 'bn' ? 'en' : 'bn');
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setPersona = (p: Persona) => {
    setPersonaState(p);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfiles((prev) => {
      const currentRole = persona === 'institution' ? 'institution' : 'citizen';
      return {
        ...prev,
        [currentRole]: {
          ...prev[currentRole],
          ...updated,
        },
      };
    });
    showToast(locale === 'bn' ? 'প্রোফাইল তথ্য আপডেট করা হয়েছে' : 'Profile updated');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((cur) => (cur === msg ? null : cur));
    }, 3200);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login', destination?: string) => {
    setAuthModalMode(mode);
    if (destination) {
      setIntendedTab(destination);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Protected route navigation guard
  const navigateWithAuth = (targetTab: string) => {
    const protectedTabs = ['verifier', 'wallet', 'assistant', 'dashboard', 'profile'];
    if (protectedTabs.includes(targetTab) && !isLoggedIn) {
      openAuthModal('login', targetTab);
      return;
    }
    setActiveTab(targetTab);
  };

  const judgeDemoLogin = (role: Persona = 'citizen') => {
    setPersonaState(role);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    const dest = intendedTab || 'dashboard';
    setIntendedTab(null);
    setActiveTab(dest);
    showToast(
      locale === 'bn'
        ? 'বিচারক ডেমো সেশনে সফলভাবে প্রবেশ করেছেন'
        : 'Logged in as Judge Demo'
    );
  };

  const logout = () => {
    setIsLoggedIn(false);
    setActiveTab('home');
    showToast(locale === 'bn' ? 'সফলভাবে প্রস্থান করা হয়েছে' : 'Logged out successfully');
  };

  const currentProfile = persona === 'institution' ? profiles.institution : profiles.citizen;
  const t = translations[locale];

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        theme,
        toggleTheme,
        persona,
        setPersona,
        currentProfile,
        updateProfile,
        activeTab,
        setActiveTab,
        isLoggedIn,
        setIsLoggedIn,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        judgeDemoLogin,
        logout,
        navigateWithAuth,
        t,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
