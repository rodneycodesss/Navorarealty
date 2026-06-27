import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthProvider';
import {
  LayoutDashboard, Building, LifeBuoy, Calendar, Users2, MessageSquareCode,
  ShieldAlert, Settings, FileSpreadsheet, History, LogOut, Menu, ChevronLeft,
  Sun, Moon, Bell, ShieldCheck, UserCheck2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const { admin, logout, hasPermission } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('navora_admin_theme') === 'dark';
  });
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Property Submitted', desc: 'Nyali Penthouse details uploaded.', time: '5m ago', read: false },
    { id: 2, title: 'Viewing Requested', desc: 'Michael Ochieng booked ID 1.', time: '20m ago', read: false },
    { id: 3, title: 'Customer Support Inquiry', desc: 'David Kamau filed a ticket.', time: '1h ago', read: true }
  ]);

  // Sync Dark/Light theme with document classes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('navora_admin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('navora_admin_theme', 'light');
    }
  }, [darkMode]);

  // Redirect if not logged in
  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    }
  }, [admin, navigate]);

  if (!admin) return null;

  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, permission: 'all' },
    { name: 'Properties Verification', path: '/admin/properties', icon: Building, permission: 'properties' },
    { name: 'Viewing Requests', path: '/admin/viewings', icon: Calendar, permission: 'viewings' },
    { name: 'CRM Leads', path: '/admin/leads', icon: Users2, permission: 'leads' },
    { name: 'Support Tickets', path: '/admin/issues', icon: LifeBuoy, permission: 'support' },
    { name: 'WhatsApp AI', path: '/admin/whatsapp', icon: MessageSquareCode, permission: 'whatsapp' },
    { name: 'Administrators', path: '/admin/admins', icon: UserCheck2, permission: 'admins', superAdminOnly: true },
    { name: 'Reports', path: '/admin/reports', icon: FileSpreadsheet, permission: 'reports' },
    { name: 'Audit Logs', path: '/admin/logs', icon: History, permission: 'logs', superAdminOnly: true },
    { name: 'Settings', path: '/admin/settings', icon: Settings, permission: 'settings', superAdminOnly: true }
  ];

  const filteredLinks = sidebarLinks.filter(link => {
    if (link.superAdminOnly && admin.role !== 'Super Admin') return false;
    return link.permission === 'all' || hasPermission(link.permission);
  });

  const getBreadcrumbName = () => {
    const segment = location.pathname.split('/').pop();
    if (!segment || segment === 'admin') return 'Dashboard';
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-charcoal text-white' : 'bg-offwhite text-charcoal'} transition-colors duration-300 font-sans`}>
      
      {/* 1. Sidebar Panel (Desktop) */}
      <aside 
        className={`hidden lg:flex flex-col flex-shrink-0 border-r ${
          darkMode ? 'bg-charcoal-dark border-gray-800' : 'bg-white border-gray-200'
        } transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Sidebar Header Logo */}
        <div className={`p-6 flex items-center justify-between border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <Link to="/admin/dashboard" className="flex flex-col text-left">
            <span className={`font-serif font-bold tracking-wider leading-none ${isCollapsed ? 'text-lg' : 'text-xl'}`}>
              NAVORA<span className="text-gold">.</span>
            </span>
            {!isCollapsed && (
              <span className="text-[8px] font-sans tracking-[0.3em] uppercase text-gold font-bold mt-1">
                REALTY ADMIN
              </span>
            )}
          </Link>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg border hover:bg-gray-150 transition-colors ${
              darkMode ? 'border-gray-800 text-gray-400 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft size={16} className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow py-6 px-4 space-y-1.5 overflow-y-auto">
          {filteredLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-350 ${
                  isActive
                    ? 'bg-deepblue text-white shadow-md'
                    : darkMode
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                      : 'text-gray-600 hover:text-deepblue hover:bg-gray-50'
                }`
              }
            >
              <link.icon size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="text-xs font-semibold uppercase tracking-wider">{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <button
            onClick={() => logout()}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors ${
              darkMode ? 'text-gray-400 hover:bg-red-950/20' : 'text-gray-600'
            }`}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="text-xs font-semibold uppercase tracking-wider">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className={`h-20 border-b flex items-center justify-between px-6 md:px-10 z-30 sticky top-0 ${
          darkMode ? 'bg-charcoal-dark border-gray-800' : 'bg-white border-gray-200'
        } backdrop-blur-md`}>
          
          <div className="flex items-center space-x-4">
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className={`lg:hidden p-2 rounded-lg border ${
                darkMode ? 'border-gray-800 text-gray-300' : 'border-gray-200 text-gray-600'
              }`}
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest">
              <span className="text-gray-400">Portal</span>
              <span className="text-gray-400">/</span>
              <span className="text-gold">{getBreadcrumbName()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            
            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-colors ${
                darkMode ? 'border-gray-800 text-gold hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications Panel */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl border relative transition-colors ${
                  darkMode ? 'border-gray-800 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-3 w-80 rounded-2xl border shadow-2xl z-50 p-4 text-left ${
                        darkMode ? 'bg-charcoal border-gray-800 text-white' : 'bg-white border-gray-150 text-charcoal'
                      }`}
                    >
                      <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-800 mb-3">
                        <span className="font-serif font-bold text-sm">Notifications</span>
                        <button 
                          onClick={markAllRead}
                          className="text-[10px] text-gold uppercase tracking-wider font-bold hover:text-deepblue"
                        >
                          Mark All Read
                        </button>
                      </div>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-2.5 rounded-lg text-xs border ${
                            n.read 
                              ? 'border-transparent text-gray-400' 
                              : darkMode 
                                ? 'bg-gray-800/40 border-gray-800 text-white font-semibold' 
                                : 'bg-offwhite border-gray-100 text-charcoal font-semibold'
                          }`}>
                            <div className="flex justify-between">
                              <span>{n.title}</span>
                              <span className="text-[9px] text-gray-400">{n.time}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">{n.desc}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Badge */}
            <div className="flex items-center space-x-3 pl-4 border-l dark:border-gray-800 border-gray-200">
              <div className="w-10 h-10 rounded-full bg-deepblue text-gold flex items-center justify-center font-serif text-sm font-bold border border-gold/30">
                {admin.name.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-charcoal dark:text-white">{admin.name}</span>
                <span className="text-[9px] text-gold uppercase tracking-widest font-semibold mt-1 flex items-center">
                  <ShieldCheck size={10} className="mr-0.5" />
                  {admin.role}
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* 3. Mobile Slide drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className={`fixed top-0 bottom-0 left-0 w-72 z-50 p-6 flex flex-col justify-between lg:hidden ${
                darkMode ? 'bg-charcoal-dark text-white border-r border-gray-800' : 'bg-white text-charcoal border-r border-gray-200'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-8 border-b dark:border-gray-800 border-gray-200 pb-4">
                  <div className="flex flex-col">
                    <span className="text-xl font-serif font-bold tracking-wider leading-none">
                      NAVORA<span className="text-gold">.</span>
                    </span>
                    <span className="text-[8px] font-sans tracking-[0.3em] uppercase text-gold font-bold mt-1">
                      REALTY ADMIN
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1 rounded-lg border dark:border-gray-800 border-gray-200 text-gray-500"
                  >
                    <ChevronLeft size={18} />
                  </button>
                </div>

                <nav className="space-y-2">
                  {filteredLinks.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-deepblue text-white shadow-md'
                            : darkMode
                              ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                              : 'text-gray-600 hover:text-deepblue hover:bg-gray-50'
                        }`
                      }
                    >
                      <link.icon size={20} />
                      <span className="uppercase text-xs tracking-wider">{link.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div>
                <button
                  onClick={() => {
                    setIsMobileOpen(false);
                    logout();
                  }}
                  className={`w-full flex items-center space-x-3.5 px-4 py-3.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors ${
                    darkMode ? 'text-gray-400 hover:bg-red-950/20' : 'text-gray-600'
                  }`}
                >
                  <LogOut size={20} />
                  <span className="uppercase text-xs tracking-wider font-semibold">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
