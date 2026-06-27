import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthProvider';
import {
  Settings, Save, Globe, Shield, Smartphone, Mail, Key, Sparkles, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSettings() {
  const { admin } = useAdminAuth();
  const [settings, setSettings] = useState({
    company_name: 'Navora Realty',
    email: 'info@navorarealty.com',
    phone: '+254 700 000 000',
    whatsapp: '+254700000000',
    google_maps_key: 'AIzaSyFakeKey...',
    seo_description: "Kenya's premier verified coastal properties."
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchSettings = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend down. Fallback local settings used.", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    
    fetch('http://localhost:8000/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast('Website settings saved successfully.');
          setSettings(data.settings);
          setSaving(false);
        }
      })
      .catch(() => {
        triggerToast('Website settings saved (mock sync).');
        setSaving(false);
      });
  };

  if (admin?.role !== 'Super Admin') {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center p-8 text-red-500 max-w-md mx-auto">
        <Shield size={44} className="mb-4 text-red-500/60" />
        <h3 className="text-lg font-serif font-bold">Access Restricted</h3>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">Only the Navora Realty Owner (Super Admin) account has authorization to change global platform parameters or modify security API integrations.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-8 bg-gray-250 dark:bg-gray-800 rounded w-1/4"></div>
        <div className="h-72 bg-gray-250 dark:bg-gray-800 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl bg-deepblue text-white text-xs uppercase font-bold tracking-wider"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h2 className="text-2xl font-serif text-charcoal dark:text-white font-bold">Global Site Settings</h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mt-1">Configure corporate brand assets, contact hotlines, Google Maps integrations, and SEO metadata.</p>
      </div>

      <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 p-6 md:p-8 rounded-2xl shadow-sm max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-2">Company Name</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
                <input
                  type="text"
                  required
                  value={settings.company_name}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  className="w-full bg-charcoal-dark border border-gray-850 focus:border-gold rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-2">Business Support Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-charcoal-dark border border-gray-850 focus:border-gold rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Telephone Number */}
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-2">Company Phone Line</label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
                <input
                  type="text"
                  required
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-charcoal-dark border border-gray-850 focus:border-gold rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none"
                />
              </div>
            </div>

            {/* WhatsApp Integration number */}
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-2">WhatsApp Line Number (international format)</label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
                <input
                  type="text"
                  required
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full bg-charcoal-dark border border-gray-850 focus:border-gold rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-gray-150 dark:border-gray-850">
            {/* Google Maps Key */}
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-2">Google Maps Embed API Key</label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
                <input
                  type="text"
                  required
                  value={settings.google_maps_key}
                  onChange={(e) => setSettings({ ...settings, google_maps_key: e.target.value })}
                  className="w-full bg-charcoal-dark border border-gray-850 focus:border-gold rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* SEO Description */}
            <div>
              <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-2">Global Metadata Description (SEO)</label>
              <div className="relative">
                <Sparkles className="absolute left-3.5 top-3.5 text-gray-500" size={16} />
                <textarea
                  rows={4}
                  required
                  value={settings.seo_description}
                  onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                  className="w-full bg-charcoal-dark border border-gray-850 focus:border-gold rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none leading-relaxed font-sans font-light"
                />
              </div>
            </div>
          </div>

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-deepblue hover:bg-gold text-white hover:text-deepblue disabled:bg-gray-800 disabled:text-gray-600 transition-all duration-300 py-4 rounded-xl flex items-center justify-center font-bold tracking-widest text-xs uppercase space-x-2.5 shadow-lg"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={15} />
                <span>Saving Configurations...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
