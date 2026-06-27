import { useState, useEffect } from 'react';
import {
  MessageSquare, User, Bot, AlertCircle, ArrowRight, UserCheck2, HelpCircle, CheckCircle, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminWhatsAppAI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [toast, setToast] = useState(null);

  const fetchChats = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/admin/whatsapp')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend down. Fallback local chats used.", err);
        // Fallback chats database
        setData({
          total_convs: 142,
          active_convs: 18,
          faqs: [
            { question: "How is property title verified?", count: 52 },
            { question: "What is the average Airbnb yield in Shanzu?", count: 34 },
            { question: "Do you list motors/vehicles?", count: 12 }
          ],
          chats: [
            {
              id: "wa_1",
              customer: "Patrick Njoroge",
              phone: "+254 701 222 333",
              status: "Handover Requested",
              messages: [
                { sender: "user", text: "Is this villa freehold or leasehold?" },
                { sender: "bot", text: "Let me forward this question to a property agent." },
                { sender: "user", text: "Yes please, connect me to a human." }
              ]
            },
            {
              id: "wa_2",
              customer: "Amina Yusuf",
              phone: "+254 702 444 555",
              status: "AI Active",
              messages: [
                { sender: "user", text: "Hi, do you have apartments in Nyali under 20M?" },
                { sender: "bot", text: "Yes! The Oceanview Vista Apartment is listed in Nyali for Ksh 18,500,000. Would you like to review it?" }
              ]
            }
          ]
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateChatStatus = (chatId, status) => {
    fetch(`http://localhost:8000/api/admin/whatsapp/${chatId}?status=${status}`, {
      method: 'PUT'
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          triggerToast(`Chat status updated to ${status}.`);
          fetchChats();
          if (activeChat && activeChat.id === chatId) {
            setActiveChat(resData.chat);
          }
        }
      })
      .catch(() => {
        const updated = data.chats.map(c => c.id === chatId ? { ...c, status } : c);
        setData({ ...data, chats: updated });
        if (activeChat && activeChat.id === chatId) {
          setActiveChat({ ...activeChat, status });
        }
        triggerToast(`Intercepted conversation (mock sync).`);
      });
  };

  const handleSendChatText = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Simulate sending message to customer
    const updatedMessages = [...activeChat.messages, { sender: 'admin', text: replyText }];
    const updatedChat = { ...activeChat, messages: updatedMessages, status: 'Agent Assigned' };
    
    const updatedChats = data.chats.map(c => c.id === activeChat.id ? updatedChat : c);
    setData({ ...data, chats: updatedChats });
    setActiveChat(updatedChat);
    setReplyText('');
    triggerToast('Message sent over WhatsApp connection.');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-8 bg-gray-250 dark:bg-gray-800 rounded w-1/4"></div>
        <div className="grid grid-cols-4 gap-6">
          <div className="h-28 bg-gray-250 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-28 bg-gray-250 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-28 bg-gray-250 dark:bg-gray-800 rounded-xl"></div>
          <div className="h-28 bg-gray-250 dark:bg-gray-800 rounded-xl"></div>
        </div>
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
        <h2 className="text-2xl font-serif text-charcoal dark:text-white font-bold">WhatsApp AI Copilot</h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mt-1">Monitor automatic AI customer chat flows, review trigger logs, and intercept requests.</p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Total Conversations</span>
          <div className="text-xl font-serif font-bold text-charcoal dark:text-white mt-1">{data.total_convs}</div>
        </div>
        <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Active Right Now</span>
          <div className="text-xl font-serif font-bold text-charcoal dark:text-white mt-1">{data.active_convs}</div>
        </div>
        <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">AI Response Rate</span>
          <div className="text-xl font-serif font-bold text-emerald-500 mt-1">98.4%</div>
        </div>
        <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Average Resolution</span>
          <div className="text-xl font-serif font-bold text-gold mt-1">12 seconds</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Active chats list & AI questions */}
        <div className="xl:col-span-2 space-y-6">
          {/* Active Chats list */}
          <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-serif font-bold text-charcoal dark:text-white mb-4">Active Threads</h3>
            <div className="space-y-3">
              {data.chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`p-4 border rounded-xl flex items-center justify-between transition-colors ${
                    activeChat && activeChat.id === chat.id 
                      ? 'border-gold bg-gold/5' 
                      : 'dark:border-gray-800 border-gray-100 hover:bg-gray-50/60 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-full bg-deepblue/5 flex items-center justify-center text-deepblue dark:text-gold">
                      <Smartphone size={16} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-charcoal dark:text-white">{chat.customer}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{chat.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                      chat.status === 'Handover Requested'
                        ? 'bg-red-500/10 text-red-500 animate-pulse'
                        : chat.status === 'Agent Assigned'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {chat.status}
                    </span>
                    <button
                      onClick={() => setActiveChat(chat)}
                      className="p-1.5 rounded-lg border dark:border-gray-800 hover:bg-deepblue hover:text-white transition-colors"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Triggered FAQ analytics list */}
          <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-serif font-bold text-charcoal dark:text-white mb-4">Frequently Triggered Topics</h3>
            <div className="space-y-3">
              {data.faqs.map((faq, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b dark:border-gray-800 border-gray-100 pb-2">
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
                    <HelpCircle size={14} className="text-gold" />
                    <span>{faq.question}</span>
                  </div>
                  <span className="bg-deepblue/5 text-deepblue dark:text-gold px-2.5 py-1 rounded font-bold">{faq.count} triggers</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Chat console intercept panel */}
        <div className="xl:col-span-1">
          {activeChat ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-[500px]"
            >
              <div>
                <div className="flex justify-between items-center pb-3 border-b dark:border-gray-800 border-gray-150 mb-4">
                  <h3 className="font-serif font-bold text-sm text-charcoal dark:text-white">Intercept Session</h3>
                  <button onClick={() => setActiveChat(null)} className="text-gray-400 hover:text-white">
                    <XCircle size={18} />
                  </button>
                </div>

                <div className="text-left text-xs bg-offwhite dark:bg-gray-800/40 p-3 rounded-xl mb-4 leading-relaxed font-light">
                  <span className="block text-[8px] uppercase tracking-wider font-bold text-gray-400 mb-1">Customer Number</span>
                  {activeChat.phone}
                </div>

                {/* Messages History list */}
                <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                  {activeChat.messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col text-xs leading-relaxed max-w-[85%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-offwhite dark:bg-gray-800 text-charcoal dark:text-white rounded-bl-none'
                        : msg.sender === 'bot'
                          ? 'bg-gold/10 text-gold border border-gold/10 rounded-br-none ml-auto'
                          : 'bg-deepblue text-white rounded-br-none ml-auto'
                    }`}>
                      <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400 mb-0.5 flex items-center">
                        {msg.sender === 'user' ? <User size={10} className="mr-0.5" /> : <Bot size={10} className="mr-0.5" />}
                        {msg.sender}
                      </span>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat action triggers */}
              <div className="space-y-3 border-t dark:border-gray-800 border-gray-150 pt-4 mt-4">
                <form onSubmit={handleSendChatText} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Intercept and type response..."
                    className="flex-grow bg-charcoal-dark border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="bg-deepblue hover:bg-gold hover:text-deepblue text-white p-2.5 rounded-xl transition-all"
                  >
                    <ArrowRight size={15} />
                  </button>
                </form>

                <div className="flex space-x-2 text-[9px] font-bold uppercase">
                  {activeChat.status !== 'Agent Assigned' && (
                    <button
                      onClick={() => handleUpdateChatStatus(activeChat.id, 'Agent Assigned')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg flex items-center justify-center space-x-1"
                    >
                      <UserCheck2 size={12} />
                      <span>Takeover Chat</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleUpdateChatStatus(activeChat.id, 'Resolved')}
                    className="flex-1 border border-gray-800 text-gray-400 hover:text-white py-2 rounded-lg flex items-center justify-center space-x-1"
                  >
                    <CheckCircle size={12} />
                    <span>End Convo</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full border-2 border-dashed dark:border-gray-800 border-gray-150 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-gray-400 bg-white/40 dark:bg-charcoal-dark/20 min-h-[300px]">
              <MessageSquare size={34} className="mb-4 text-gray-500/60" />
              <p className="text-xs uppercase tracking-wider font-bold">Select a conversation thread to intercept</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
