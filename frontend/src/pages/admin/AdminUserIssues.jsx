import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthProvider';
import {
  LifeBuoy, Mail, Phone, Calendar, AlertTriangle, ArrowRight, CheckCircle2, MessageSquare, Archive, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUserIssues() {
  const { hasPermission } = useAdminAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [toast, setToast] = useState(null);

  const fetchIssues = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/admin/issues')
      .then(res => res.json())
      .then(data => {
        setIssues(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend down. Fallback local support tickets used.", err);
        setIssues([
          {
            id: 101,
            name: "David Kamau",
            phone: "+254 700 111 222",
            email: "david@kamau.com",
            category: "Verification Delay",
            priority: "Medium",
            status: "Open",
            date: "2026-06-25",
            messages: [{"sender": "customer", "text": "Hello, my beachfront suite listing has been pending verification for 3 days. When will it go live?"}]
          },
          {
            id: 102,
            name: "Sarah Njeri",
            phone: "+254 700 333 444",
            email: "sarah@njeri.com",
            category: "Account Access",
            priority: "High",
            status: "Resolved",
            date: "2026-06-24",
            messages: [
              {"sender": "customer", "text": "I can't reset my list-property password."},
              {"sender": "admin", "text": "We have sent a secure password reset link to your email."}
            ]
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpdateStatus = (id, status) => {
    fetch(`http://localhost:8000/api/admin/issues/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast(`Ticket status set to ${status}.`);
          fetchIssues();
          if (activeTicket && activeTicket.id === id) {
            setActiveTicket(prev => ({ ...prev, status }));
          }
        }
      })
      .catch(() => {
        setIssues(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        if (activeTicket && activeTicket.id === id) {
          setActiveTicket(prev => ({ ...prev, status }));
        }
        triggerToast(`Ticket status updated (mock sync).`);
      });
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    fetch(`http://localhost:8000/api/admin/issues/${activeTicket.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: activeTicket.status, reply: replyText })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast('Reply sent successfully.');
          setReplyText('');
          fetchIssues();
          setActiveTicket(data.ticket);
        }
      })
      .catch(() => {
        const updatedMsgs = [...activeTicket.messages, { sender: 'admin', text: replyText }];
        const updatedTicket = { ...activeTicket, messages: updatedMsgs };
        setIssues(prev => prev.map(t => t.id === activeTicket.id ? updatedTicket : t));
        setActiveTicket(updatedTicket);
        setReplyText('');
        triggerToast('Reply sent (mock sync).');
      });
  };

  const getPriorityColor = (p) => {
    switch (p.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
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
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-charcoal dark:text-white font-bold">Support Tickets</h2>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mt-1">Review user issues, resolve listing difficulties, and support clients.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Ticket list table */}
        <div className="xl:col-span-2 bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b dark:border-gray-800 border-gray-150">
                <tr>
                  <th className="px-6 py-4 text-left">Ticket details</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Priority</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-800 font-semibold">
                {issues.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-left">
                      <h4 className="text-charcoal dark:text-white font-bold">{ticket.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">#{ticket.id} • {ticket.date}</p>
                    </td>
                    <td className="px-6 py-4 text-left text-gray-500 dark:text-gray-400">
                      {ticket.category}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <span className={`px-2.5 py-1 rounded-full border text-[9px] uppercase tracking-wider font-bold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <span className={`px-2 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                        ticket.status === 'Resolved' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : ticket.status === 'Escalated' 
                            ? 'bg-red-500/10 text-red-500' 
                            : 'bg-amber-500/10 text-amber-500 animate-pulse'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setActiveTicket(ticket)}
                        className="p-1.5 rounded-lg border dark:border-gray-800 hover:bg-deepblue hover:text-white transition-colors"
                        title="View Chat Details"
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

        {/* Support Chat thread side desk */}
        <div className="xl:col-span-1">
          {activeTicket ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[500px]"
            >
              <div>
                <div className="flex justify-between items-center pb-3 border-b dark:border-gray-800 border-gray-150 mb-4">
                  <h3 className="font-serif font-bold text-sm text-charcoal dark:text-white">Ticket Conversation</h3>
                  <button onClick={() => setActiveTicket(null)} className="text-gray-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
                
                {/* Client contacts */}
                <div className="text-left text-xs bg-offwhite dark:bg-gray-800/40 p-3 rounded-xl mb-4 space-y-1">
                  <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-300">
                    <Mail size={12} className="text-gold" />
                    <span>{activeTicket.email}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-300">
                    <Phone size={12} className="text-gold" />
                    <span>{activeTicket.phone}</span>
                  </div>
                </div>

                {/* Messages feed */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {activeTicket.messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col text-xs leading-relaxed max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'admin'
                        ? 'bg-deepblue text-white rounded-br-none self-end ml-auto'
                        : 'bg-offwhite dark:bg-gray-800 text-charcoal dark:text-white rounded-bl-none'
                    }`}>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action desk */}
              <div className="space-y-3 border-t dark:border-gray-800 border-gray-150 pt-4 mt-4">
                <form onSubmit={handleSendReply} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a message reply..."
                    className="flex-grow bg-charcoal-dark border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-gold"
                  />
                  <button 
                    type="submit"
                    className="bg-deepblue hover:bg-gold hover:text-deepblue text-white p-2.5 rounded-xl transition-all"
                  >
                    <ArrowRight size={15} />
                  </button>
                </form>
                
                <div className="flex space-x-2 text-[10px]">
                  <button
                    onClick={() => handleUpdateStatus(activeTicket.id, 'Resolved')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg flex items-center justify-center space-x-1 uppercase"
                  >
                    <CheckCircle2 size={12} />
                    <span>Mark Resolved</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(activeTicket.id, 'Escalated')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg flex items-center justify-center space-x-1 uppercase"
                  >
                    <ShieldAlert size={12} />
                    <span>Escalate</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full border-2 border-dashed dark:border-gray-800 border-gray-150 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-gray-400 bg-white/40 dark:bg-charcoal-dark/20 min-h-[300px]">
              <LifeBuoy size={34} className="mb-4 text-gray-500/60" />
              <p className="text-xs uppercase tracking-wider font-bold">Select a support ticket to reply</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
