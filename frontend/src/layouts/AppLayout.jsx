import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  History, 
  User, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Search, 
  WifiOff, 
  LogOut, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CommandPalette } from '../components/CommandPalette';

export const AppLayout = () => {
  const { user, token, loading, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Get theme preferences (dark mode is default for premium dashboard)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') !== 'light'
  );

  // Apply Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Monitor online status
  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Listen to keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If auth is still loading, show skeleton style fullscreen loader
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Sparkles className="w-10 h-10 text-brand-accent animate-pulse" />
        <p className="text-xs font-semibold text-slate-400 tracking-wider">LOADING SECURE ENVIRONMENT...</p>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Audit', path: '/upload', icon: UploadCloud },
    { name: 'Audit History', path: '/history', icon: History },
    { name: 'My Profile', path: '/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      
      {/* 1. Command Palette Spotlight */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        setIsOpen={setIsCommandPaletteOpen}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* 2. Offline Status Banner */}
      {isOffline && (
        <div className="fixed top-0 inset-x-0 z-50 bg-brand-error text-white text-center py-1.5 text-xs font-semibold flex items-center justify-center space-x-2 animate-slideDown shadow-lg">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are currently offline. Check your network connection.</span>
        </div>
      )}

      {/* 3. Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-card-dark border-r border-slate-100 dark:border-slate-900/60 p-5 h-screen sticky top-0">
        
        {/* Brand Logo header */}
        <div className="flex items-center space-x-3 pb-8 pt-3 px-2 border-b border-slate-50 dark:border-slate-850">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-brand-primary/20">
            UI
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800 dark:text-white">AI UI Audit</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">DESIGN PILOT</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 py-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path === '/history' && location.pathname.startsWith('/analysis'));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-slate-50 dark:bg-slate-800/80 text-brand-primary font-semibold shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-850/50'
                  }
                `}
              >
                <Icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-brand-primary' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Command bar tip */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-premium border border-slate-100 dark:border-slate-850 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-2">QUICK NAVIGATION</p>
          <button 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center justify-between w-full px-2 py-1.5 bg-white dark:bg-card-dark border border-slate-200/50 dark:border-slate-800 rounded-lg text-xs text-slate-500 shadow-sm"
          >
            <span className="flex items-center text-[10px]"><Search className="w-3 h-3 mr-1.5 text-slate-400" /> Search...</span>
            <kbd className="font-mono text-[9px] px-1 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-slate-400">Ctrl+K</kbd>
          </button>
        </div>

        {/* Profile Footer */}
        <div className="pt-4 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 mr-3 border border-slate-200 dark:border-slate-800 shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            title="Logout" 
            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-error hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 4. Mobile Nav Bar */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="lg:hidden flex items-center justify-between bg-white dark:bg-card-dark border-b border-slate-100 dark:border-slate-900/60 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white font-extrabold text-xs">
              UI
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-white">AI UI Audit</span>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 5. Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu */}
            <div className="relative w-72 max-w-xs bg-white dark:bg-card-dark flex flex-col p-6 border-r border-slate-100 dark:border-slate-800 z-50 animate-slideRight">
              <div className="flex items-center justify-between pb-6 border-b border-slate-50 dark:border-slate-850">
                <span className="text-sm font-extrabold text-slate-800 dark:text-white">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 py-6">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || 
                                   (item.path === '/history' && location.pathname.startsWith('/analysis'));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-250
                        ${isActive 
                          ? 'bg-slate-50 dark:bg-slate-800 text-brand-primary font-semibold' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-850'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-850 flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold mr-3 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none">{user?.name}</p>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                  </div>
                </div>
                <button onClick={logout} className="p-1.5 rounded-lg text-slate-400 hover:text-brand-error hover:bg-rose-500/10 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. Main Dashboard Content Frame */}
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:p-8 xl:p-10 max-w-[1600px] w-full mx-auto">
          {/* Top Bar for Desktop layout */}
          <div className="hidden lg:flex items-center justify-between mb-8 select-none">
            <div>
              <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-1.5">PILOT VIEW</p>
              <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                {location.pathname === '/dashboard' && 'Designer Cockpit'}
                {location.pathname === '/upload' && 'UI/UX Audit Pilot'}
                {location.pathname === '/history' && 'Saved Audits'}
                {location.pathname.startsWith('/analysis') && 'Audit Deep-Dive Report'}
                {location.pathname === '/profile' && 'Preferences & Settings'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Dark mode switcher */}
              <button 
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-850 bg-white dark:bg-card-dark hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors shadow-sm"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Render Route view */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
