import { useState, useEffect } from 'react';
import {
  Calendar, Clock, User, Phone, CheckCircle, XCircle, CalendarClock, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminViewingRequests() {
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, id: null, date: '', time: '' });
  const [toast, setToast] = useState(null);

  const fetchViewings = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/admin/viewings')
      .then(res => res.json())
      .then(data => {
        setViewings(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend down. Fallback local viewings used.", err);
        setViewings([
          {
            id: 201,
            customer: "Michael Ochieng",
            property: "Oceanview Vista Apartment",
            property_id: 1,
            preferred_date: "2026-06-30",
            preferred_time: "10:00 AM",
            phone: "+254 711 555 666",
            status: "Pending"
          },
          {
            id: 202,
            customer: "Fatma Ali",
            property: "Serene Holiday Penthouse",
            property_id: 3,
            preferred_date: "2026-07-02",
            preferred_time: "02:00 PM",
            phone: "+254 722 777 888",
            status: "Approved"
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchViewings();
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = (id, status) => {
    fetch(`http://localhost:8000/api/admin/viewings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast(`Viewing tour status updated to ${status}.`);
          fetchViewings();
        }
      })
      .catch(() => {
        setViewings(prev => prev.map(v => v.id === id ? { ...v, status } : v));
        triggerToast(`Viewing tour status updated to ${status} (mock sync).`);
      });
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    const { id, date, time } = rescheduleModal;
    if (!date || !time) return;

    fetch(`http://localhost:8000/api/admin/viewings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Rescheduled', preferred_date: date, preferred_time: time })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast('Viewing rescheduled and seller notified.');
          setRescheduleModal({ open: false, id: null, date: '', time: '' });
          fetchViewings();
        }
      })
      .catch(() => {
        setViewings(prev => prev.map(v => v.id === id ? { ...v, status: 'Rescheduled', preferred_date: date, preferred_time: time } : v));
        triggerToast('Viewing rescheduled (mock sync).');
        setRescheduleModal({ open: false, id: null, date: '', time: '' });
      });
  };

  const getStatusColor = (s) => {
    switch (s.toLowerCase()) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-500';
      case 'completed': return 'bg-blue-500/10 text-blue-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      case 'rescheduled': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-amber-500/10 text-amber-500 animate-pulse';
    }
  };

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
        <h2 className="text-2xl font-serif text-charcoal dark:text-white font-bold">Viewing Requests</h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mt-1">Review viewing booking inquiries, coordinate dates with sellers, and confirm client arrivals.</p>
      </div>

      {/* Grid List */}
      <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b dark:border-gray-800 border-gray-150">
              <tr>
                <th className="px-6 py-4 text-left">Client Details</th>
                <th className="px-6 py-4 text-left">Property Interest</th>
                <th className="px-6 py-4 text-left">Date & Time</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-gray-800 font-semibold">
              {viewings.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-deepblue/5 flex items-center justify-center text-deepblue dark:text-gold">
                        <User size={13} />
                      </div>
                      <div>
                        <h4 className="text-charcoal dark:text-white font-bold">{v.customer}</h4>
                        <span className="text-[10px] text-gray-400 flex items-center mt-0.5"><Phone size={10} className="mr-1" /> {v.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left text-gray-500 dark:text-gray-300">
                    <h5 className="font-serif font-bold text-sm text-charcoal dark:text-white">{v.property}</h5>
                    <span className="text-[9px] text-gray-400 mt-1 block">Property ID: #{v.property_id}</span>
                  </td>
                  <td className="px-6 py-4 text-left text-gray-500 dark:text-gray-300 space-y-1">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} className="text-gold" />
                      <span>{v.preferred_date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="text-gold" />
                      <span>{v.preferred_time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold ${getStatusColor(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-[10px] uppercase font-bold">
                      {v.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(v.id, 'Approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg flex items-center space-x-1"
                          >
                            <CheckCircle size={11} />
                            <span>Confirm</span>
                          </button>
                          <button
                            onClick={() => setRescheduleModal({ open: true, id: v.id, date: v.preferred_date, time: v.preferred_time })}
                            className="border border-gray-800 text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center space-x-1"
                          >
                            <CalendarClock size={11} />
                            <span>Reschedule</span>
                          </button>
                        </>
                      )}
                      
                      {v.status === 'Approved' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(v.id, 'Completed')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg flex items-center space-x-1"
                          >
                            <CheckCircle size={11} />
                            <span>Done</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(v.id, 'Cancelled')}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-2.5 py-1.5 rounded-lg flex items-center space-x-1"
                          >
                            <XCircle size={11} />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}
                      
                      {(v.status === 'Completed' || v.status === 'Cancelled' || v.status === 'Rescheduled') && (
                        <span className="text-[10px] text-gray-400 tracking-wider">Processed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Reschedule Tour */}
      {rescheduleModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-gray-800 rounded-2xl p-6 max-w-sm w-full text-left space-y-4">
            <h3 className="text-lg font-serif font-bold text-white">Reschedule Viewing Tour</h3>
            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">New Proposed Date</label>
                <input
                  type="date"
                  required
                  value={rescheduleModal.date}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, date: e.target.value })}
                  className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Preferred Time</label>
                <input
                  type="text"
                  required
                  value={rescheduleModal.time}
                  onChange={(e) => setRescheduleModal({ ...rescheduleModal, time: e.target.value })}
                  placeholder="e.g. 10:00 AM"
                  className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gold text-deepblue hover:bg-white transition-colors py-3 rounded-xl text-xs uppercase tracking-wider font-bold"
                >
                  Save Reschedule
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduleModal({ open: false, id: null, date: '', time: '' })}
                  className="flex-1 border border-gray-800 text-gray-400 hover:text-white py-3 rounded-xl text-xs uppercase tracking-wider font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
