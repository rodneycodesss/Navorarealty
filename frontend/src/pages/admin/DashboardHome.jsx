import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Home, Eye, Users, FileText, CheckCircle2, AlertTriangle, HelpCircle, Phone, ArrowUpRight
} from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("FastAPI backend not active. Using client fallback stats.", err);
        // Resilient Fallback stats
        setStats({
          total_listings: 6,
          pending_verification: 2,
          approved_listings: 4,
          rejected_listings: 1,
          active_leads: 8,
          viewing_requests: 5,
          monthly_visitors: 2480,
          new_submissions: 2,
          whatsapp_inquiries: 142,
          website_traffic: 15430
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse text-left">
        <div className="h-10 bg-gray-250 dark:bg-gray-800 rounded-lg w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-250 dark:bg-gray-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="h-80 bg-gray-250 dark:bg-gray-800 rounded-2xl"></div>
          <div className="h-80 bg-gray-250 dark:bg-gray-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Cards Metadata to display
  const cardData = [
    { label: 'Total Listings', val: stats.total_listings, icon: Home, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Pending Review', val: stats.pending_verification, icon: AlertTriangle, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Approved Live', val: stats.approved_listings, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Rejected Listings', val: stats.rejected_listings, icon: HelpCircle, color: 'text-red-500 bg-red-500/10' },
    { label: 'Active Leads', val: stats.active_leads, icon: Users, color: 'text-purple-500 bg-purple-500/10' },
    { label: 'Viewing Requests', val: stats.viewing_requests, icon: FileText, color: 'text-indigo-500 bg-indigo-500/10' },
    { label: 'Monthly Visitors', val: stats.monthly_visitors.toLocaleString(), icon: Eye, color: 'text-teal-500 bg-teal-500/10' },
    { label: 'New Submissions', val: stats.new_submissions, icon: TrendingUp, color: 'text-pink-500 bg-pink-500/10' },
    { label: 'WhatsApp Inqs', val: stats.whatsapp_inquiries, icon: Phone, color: 'text-green-500 bg-green-500/10' },
    { label: 'Website Traffic', val: stats.website_traffic.toLocaleString(), icon: ArrowUpRight, color: 'text-indigo-600 bg-indigo-600/10' }
  ];

  return (
    <div className="space-y-10 text-left">
      <div>
        <h2 className="text-3xl font-serif text-charcoal dark:text-white font-bold leading-tight">Welcome back, Administrator</h2>
        <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-semibold">Here is what's happening with Navora Realty properties today.</p>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {cardData.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.5 }}
            className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-snug">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon size={16} />
              </div>
            </div>
            <div className="text-2xl font-serif font-bold text-charcoal dark:text-white mt-1">
              {card.val}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Listings Growth (Timeline) */}
        <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-serif font-bold text-charcoal dark:text-white mb-4">Listings Growth Over Time</h3>
          <div className="h-60 w-full relative flex items-end">
            {/* SVG Line Chart */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0B1B3D" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0B1B3D" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#888" strokeOpacity="0.1" strokeDasharray="5,5" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#888" strokeOpacity="0.1" strokeDasharray="5,5" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#888" strokeOpacity="0.1" strokeDasharray="5,5" />
              
              {/* Path Area */}
              <path d="M 0 170 Q 100 130 200 110 T 400 60 L 500 40 L 500 180 L 0 180 Z" fill="url(#gradient-blue)" />
              {/* Path Line */}
              <path d="M 0 170 Q 100 130 200 110 T 400 60 L 500 40" fill="none" stroke="#C5A880" strokeWidth="3" />
              {/* Data points */}
              <circle cx="200" cy="110" r="4" fill="#0B1B3D" stroke="#C5A880" strokeWidth="2" />
              <circle cx="400" cy="60" r="4" fill="#0B1B3D" stroke="#C5A880" strokeWidth="2" />
              <circle cx="500" cy="40" r="4" fill="#0B1B3D" stroke="#C5A880" strokeWidth="2" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[9px] text-gray-400 uppercase tracking-widest font-bold pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>Jan</span>
              <span>Mar</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Monthly Leads Pipeline */}
        <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-serif font-bold text-charcoal dark:text-white mb-4">Monthly Inbound Leads</h3>
          <div className="h-60 w-full flex items-end justify-between px-4 pb-2 relative border-b border-gray-100 dark:border-gray-800">
            {[
              { m: 'Jan', val: 40 },
              { m: 'Feb', val: 55 },
              { m: 'Mar', val: 78 },
              { m: 'Apr', val: 65 },
              { m: 'May', val: 92 },
              { m: 'Jun', val: 115 }
            ].map((bar, idx) => (
              <div key={bar.m} className="flex flex-col items-center space-y-2 w-12 group">
                <div className="text-[10px] text-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.val}
                </div>
                <div 
                  style={{ height: `${(bar.val / 130) * 100}%` }}
                  className="w-8 bg-deepblue hover:bg-gold rounded-t-lg transition-all duration-500 shadow-lg"
                ></div>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{bar.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Property Views Hitrate */}
        <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-serif font-bold text-charcoal dark:text-white mb-4">Property View Activities (Daily)</h3>
          <div className="h-60 w-full relative flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              <path d="M 0 150 Q 80 180 160 90 T 320 60 T 500 30" fill="none" stroke="#0B1B3D" strokeWidth="3" />
              <path d="M 0 150 Q 80 180 160 90 T 320 60 T 500 30 L 500 190 L 0 190 Z" fill="#0B1B3D" fillOpacity="0.05" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[9px] text-gray-400 uppercase tracking-widest font-bold pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Chart 4: Popular Locations Distribution */}
        <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-serif font-bold text-charcoal dark:text-white mb-4">Popular Coastal Locations</h3>
          <div className="space-y-4 py-2">
            {[
              { loc: 'Nyali', val: 42, color: 'bg-deepblue' },
              { loc: 'Shanzu', val: 28, color: 'bg-gold' },
              { loc: 'Bamburi', val: 18, color: 'bg-charcoal' },
              { loc: 'Mtwapa', val: 8, color: 'bg-blue-500' },
              { loc: 'Kizingo', val: 4, color: 'bg-emerald-500' }
            ].map(item => (
              <div key={item.loc} className="space-y-1 text-left text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-charcoal dark:text-gray-300">{item.loc}</span>
                  <span className="text-gray-400">{item.val}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
