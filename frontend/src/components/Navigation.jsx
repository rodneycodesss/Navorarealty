import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation Links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Investment Opportunities', path: '/investment' },
    { name: 'List Your Property', path: '/list-property' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    // Reserved/Hidden space for Phase 2 Motors
    { name: 'Motors', path: '/motors', hidden: true }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('navora_admin_user');
    setIsAdminLoggedIn(!!saved);
  }, [location.pathname]);

  // Check if current page has a transparent hero header
  const isHomePage = location.pathname === '/';
  const headerBgClass = isScrolled 
    ? 'bg-deepblue shadow-xl border-b border-deepblue-light/30 py-4' 
    : isHomePage 
      ? 'bg-gradient-to-b from-charcoal/80 to-transparent py-6' 
      : 'bg-deepblue py-5';

  return (
    <>
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${headerBgClass}`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex flex-col group">
            <span className="text-2xl md:text-3xl font-serif font-bold tracking-wider text-white">
              NAVORA<span className="text-gold group-hover:text-white transition-colors duration-300">.</span>
            </span>
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-gold leading-none -mt-1 font-semibold">
              REALTY
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center space-x-7">
            {navLinks
              .filter(link => !link.hidden)
              .map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => 
                    `text-xs font-semibold uppercase tracking-widest transition-all duration-300 hover:text-gold relative py-2 ${
                      isActive ? 'text-gold' : 'text-gray-200'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>
                      {isActive && (
                        <motion.span 
                          layoutId="navIndicator"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
          </nav>

          {/* Contact Button */}
          <div className="hidden xl:flex items-center space-x-5">
            <Link 
              to="/contact" 
              className="bg-gold text-deepblue hover:bg-white hover:text-deepblue transition-all duration-300 px-5 py-2 uppercase text-xs tracking-widest font-bold shadow-lg"
            >
              Get in Touch
            </Link>
            {isAdminLoggedIn ? (
              <Link 
                to="/admin/dashboard" 
                className="border border-white hover:border-gold text-white hover:text-gold transition-all duration-300 px-4 py-2 uppercase text-xs tracking-widest font-bold"
              >
                Admin Panel
              </Link>
            ) : (
              <Link 
                to="/admin/login" 
                className="text-gray-300 hover:text-gold transition-all duration-300 uppercase text-xs tracking-widest font-semibold px-2 py-2"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden text-white hover:text-gold transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-charcoal-dark/90 backdrop-blur-sm xl:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-deepblue-dark text-white z-50 p-8 shadow-2xl flex flex-col justify-between xl:hidden"
            >
              <div>
                <div className="flex justify-between items-center mb-12">
                  <div className="flex flex-col">
                    <span className="text-2xl font-serif font-bold tracking-wider text-white">
                      NAVORA<span className="text-gold">.</span>
                    </span>
                    <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-gold leading-none -mt-1 font-semibold">
                      REALTY
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white hover:text-gold p-1"
                  >
                    <X size={26} />
                  </button>
                </div>

                <nav className="flex flex-col space-y-6">
                  {navLinks
                    .filter(link => !link.hidden)
                    .map((link) => (
                      <NavLink
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) => 
                          `text-sm font-semibold uppercase tracking-wider transition-colors py-2 block ${
                            isActive ? 'text-gold border-l-2 border-gold pl-3' : 'text-gray-300 hover:text-white'
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    ))}
                </nav>
              </div>

              <div className="border-t border-deepblue-light/50 pt-8">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Mombasa Coastal Office</p>
                <div className="flex items-center space-x-3 text-gold text-sm font-semibold mb-6">
                  <PhoneCall size={16} />
                  <span>+254 700 000 000</span>
                </div>
                <div className="space-y-3">
                  <Link
                    to="/list-property"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center block bg-gold text-deepblue hover:bg-white transition-all py-3 uppercase text-xs tracking-widest font-bold"
                  >
                    List Your Property
                  </Link>
                  {isAdminLoggedIn ? (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center block border border-white hover:border-gold text-white hover:text-gold transition-all py-3 uppercase text-xs tracking-widest font-bold"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/admin/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center block border border-white/40 hover:border-gold text-gray-300 hover:text-gold transition-all py-3 uppercase text-xs tracking-widest font-bold"
                    >
                      Admin Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
