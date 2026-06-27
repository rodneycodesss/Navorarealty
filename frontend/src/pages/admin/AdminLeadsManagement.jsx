import { useState, useEffect } from 'react';
import {
  Users2, Phone, Briefcase, DollarSign, MapPin, Tag, MessageSquare, CheckCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLeadsManagement() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLead, setActiveLead] = useState(null);
  const [leadNotes, setLeadNotes] = useState('');
  const [toast, setToast] = useState(null);

  const fetchLeads = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/admin/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend down. Fallback local leads used.", err);
        setLeads([
          {
            id: 301,
            customer: "John Kamuri",
            phone: "+254 700 999 888",
            interested: "Bamburi Beachfront Villa",
            budget: "Ksh 40,000,000",
            location: "Bamburi",
            status: "Negotiating",
            source: "Website Inquiry",
            notes: "Offered 38M, seller holds firm at 42M. Call back on Monday."
          },
          {
            id: 302,
            customer: "Esther Wanjiku",
            phone: "+254 712 111 000",
            interested: "Shanzu Shores Suite",
            budget: "Ksh 16,500,000",
            location: "Shanzu",
            status: "New",
            source: "WhatsApp Chatbot",
            notes: "First-time investor seeking info on occupancy guarantees."
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateLead = (id, status, notes = null) => {
    const payload = { status };
    if (notes !== null) {
      payload.notes = notes;
    }
    
    fetch(`http://localhost:8000/api/admin/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast(`Lead status set to ${status}.`);
          fetchLeads();
          if (activeLead && activeLead.id === id) {
            setActiveLead(data.lead);
          }
        }
      })
      .catch(() => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status, notes: notes !== null ? notes : l.notes } : l));
        if (activeLead && activeLead.id === id) {
          setActiveLead(prev => ({ ...prev, status, notes: notes !== null ? notes : prev.notes }));
        }
        triggerToast(`Lead status set to ${status} (mock sync).`);
      });
  };

  const handleNotesSubmit = (e) => {
    e.preventDefault();
    if (!leadNotes.trim()) return;
    
    handleUpdateLead(activeLead.id, activeLead.status, leadNotes);
    triggerToast('Notes logged successfully.');
    setLeadNotes('');
  };

  const getStatusBadge = (s) => {
    switch (s.toLowerCase()) {
      case 'new': return 'bg-blue-500/10 text-blue-500';
      case 'contacted': return 'bg-amber-500/10 text-amber-500';
      case 'viewing scheduled': return 'bg-purple-500/10 text-purple-500';
      case 'negotiating': return 'bg-indigo-500/10 text-indigo-500 animate-pulse';
      case 'closed': return 'bg-emerald-500/10 text-emerald-500';
      default: return 'bg-red-500/10 text-red-500'; // lost
    }
  };

  return (
    <div className="space-y-6 text-left relative">
      
      {/* Toast Banner */}
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
        <h2 className="text-2xl font-serif text-charcoal dark:text-white font-bold">Leads Management (CRM)</h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mt-1">Nurture client inquiries, review budget requirements, and coordinate purchases.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* CRM Leads Table */}
        <div className="xl:col-span-2 bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b dark:border-gray-800 border-gray-150">
                <tr>
                  <th className="px-6 py-4 text-left">Customer Name</th>
                  <th className="px-6 py-4 text-left">Property Interest</th>
                  <th className="px-6 py-4 text-left">Budget</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-800 font-semibold">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-left">
                      <h4 className="text-charcoal dark:text-white font-bold">{lead.customer}</h4>
                      <span className="text-[10px] text-gray-400 mt-0.5">{lead.phone} • {lead.source}</span>
                    </td>
                    <td className="px-6 py-4 text-left text-gray-500 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Briefcase size={12} className="text-gold" />
                        <span>{lead.interested}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[10px] text-gray-400 mt-1">
                        <MapPin size={10} />
                        <span>{lead.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left font-serif text-charcoal dark:text-white">
                      {lead.budget}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold ${getStatusBadge(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setActiveLead(lead);
                          setLeadNotes(lead.notes || '');
                        }}
                        className="p-1.5 rounded-lg border dark:border-gray-800 hover:bg-deepblue hover:text-white transition-colors"
                        title="View details & notes"
                      >
                        <MessageSquare size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel: CRM Actions & Notes */}
        <div className="xl:col-span-1">
          {activeLead ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6"
            >
              <div className="flex justify-between items-center pb-3 border-b dark:border-gray-800 border-gray-150">
                <h3 className="font-serif font-bold text-sm text-charcoal dark:text-white">Lead Details</h3>
                <button onClick={() => setActiveLead(null)} className="text-gray-400 hover:text-white">
                  <XCircle size={18} />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-charcoal dark:text-white">{activeLead.customer}</h4>
                <p className="text-[10px] text-gray-400 mt-1">{activeLead.phone} • Source: {activeLead.source}</p>
              </div>

              {/* Status workflow selection */}
              <div>
                <label htmlFor="lead-status-select" className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-2">Update Stage Status</label>
                <select
                  id="lead-status-select"
                  value={activeLead.status}
                  onChange={(e) => handleUpdateLead(activeLead.id, e.target.value)}
                  className="w-full bg-charcoal-dark border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                >
                  <option value="New">New Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Viewing Scheduled">Viewing Scheduled</option>
                  <option value="Negotiating">Negotiating</option>
                  <option value="Closed">Closed Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* Admin notes feed */}
              <div className="space-y-4 pt-2 border-t dark:border-gray-800 border-gray-150">
                <div>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-2">Lead Logs & Notes</span>
                  <div className="bg-offwhite dark:bg-gray-800/40 p-3 rounded-xl border dark:border-gray-800 border-gray-100 text-xs text-gray-500 dark:text-gray-300 leading-relaxed font-light">
                    {activeLead.notes || 'No administrative notes logged.'}
                  </div>
                </div>

                <form onSubmit={handleNotesSubmit} className="space-y-2">
                  <textarea
                    rows={3}
                    value={leadNotes}
                    onChange={(e) => setLeadNotes(e.target.value)}
                    placeholder="Append a follow-up comment..."
                    className="w-full bg-charcoal-dark border border-gray-800 rounded-xl p-3 text-xs text-white placeholder:text-gray-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-deepblue hover:bg-gold hover:text-deepblue text-white py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md transition-all"
                  >
                    Log notes
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <div className="h-full border-2 border-dashed dark:border-gray-800 border-gray-150 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-gray-400 bg-white/40 dark:bg-charcoal-dark/20 min-h-[300px]">
              <Users2 size={34} className="mb-4 text-gray-500/60" />
              <p className="text-xs uppercase tracking-wider font-bold">Select a buyer lead to view timeline</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
