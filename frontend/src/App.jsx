import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Admin Core
import { AdminAuthProvider } from './components/admin/AdminAuthProvider';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import InvestmentOpportunities from './pages/InvestmentOpportunities';
import ListYourProperty from './pages/ListYourProperty';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import DashboardHome from './pages/admin/DashboardHome';
import AdminPropertyManagement from './pages/admin/AdminPropertyManagement';
import AdminViewingRequests from './pages/admin/AdminViewingRequests';
import AdminLeadsManagement from './pages/admin/AdminLeadsManagement';
import AdminUserIssues from './pages/admin/AdminUserIssues';
import AdminWhatsAppAI from './pages/admin/AdminWhatsAppAI';
import AdminAdministratorManagement from './pages/admin/AdminAdministratorManagement';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';

// Scroll to Top component on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Layout wrapper for public pages to conditionally show headers/footers
function PublicLayout({ children }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return children;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-grow pt-[80px]">
        {children}
      </div>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <PublicLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/investment" element={<InvestmentOpportunities />} />
            <Route path="/list-property" element={<ListYourProperty />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Console Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="properties" element={<AdminPropertyManagement />} />
              <Route path="viewings" element={<AdminViewingRequests />} />
              <Route path="leads" element={<AdminLeadsManagement />} />
              <Route path="issues" element={<AdminUserIssues />} />
              <Route path="whatsapp" element={<AdminWhatsAppAI />} />
              <Route path="admins" element={<AdminAdministratorManagement />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="logs" element={<AdminAuditLogs />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </PublicLayout>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

export default App;
