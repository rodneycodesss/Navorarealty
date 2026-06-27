import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthProvider';
import {
  UserCheck2, Plus, Edit2, ShieldAlert, Key, Trash2, Mail, ShieldCheck, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminAdministratorManagement() {
  const { admin } = useAdminAuth();
  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Add/Edit Modals
  const [addModal, setAddModal] = useState({ open: false, name: '', email: '', role: 'Admin', permissions: ['properties', 'leads'] });
  const [editModal, setEditModal] = useState({ open: false, adminItem: null });
  const [tempPassword, setTempPassword] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchAdmins = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/admin/admins')
      .then(res => res.json())
      .then(data => {
        setAdminsList(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend down. Fallback local admins used.", err);
        setAdminsList([
          {
            email: "admin@navorarealty.com",
            name: "Navora Owner",
            role: "Super Admin",
            status: "Active",
            created: "2026-01-01",
            last_login: "2026-06-27 22:15:00",
            permissions: ["all"]
          },
          {
            email: "agent@navorarealty.com",
            name: "Jane Coastal Agent",
            role: "Admin",
            status: "Active",
            created: "2026-03-12",
            last_login: "2026-06-27 18:40:00",
            permissions: ["properties", "leads", "viewings"]
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (admin?.role !== 'Super Admin') {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center p-8 text-red-500 max-w-md mx-auto">
        <ShieldAlert size={44} className="mb-4 text-red-500/60" />
        <h3 className="text-lg font-serif font-bold">Access Restricted</h3>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">Only the Navora Realty Owner (Super Admin) account has authority to manage administrator privileges and review active staff files.</p>
      </div>
    );
  }

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddAdminSubmit = (e) => {
    e.preventDefault();
    if (!addModal.name || !addModal.email) return;

    const payload = {
      email: addModal.email,
      password: 'NavoraTempPassword2026!',
      name: addModal.name,
      role: addModal.role,
      permissions: addModal.role === 'Super Admin' ? ['all'] : addModal.permissions
    };

    fetch('http://localhost:8000/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast('Administrator created successfully.');
          setTempPassword('NavoraTempPassword2026!');
          fetchAdmins();
        } else {
          triggerToast(data.message || 'Failed to create administrator.');
        }
      })
      .catch(() => {
        // Fallback mock append
        setAdminsList(prev => [...prev, {
          email: payload.email,
          name: payload.name,
          role: payload.role,
          status: 'Active',
          created: '2026-06-27',
          last_login: 'Never',
          permissions: payload.permissions
        }]);
        setTempPassword('NavoraTempPassword2026!');
        triggerToast('Administrator created successfully (mock sync).');
      });
  };

  const handleTogglePermission = (permission) => {
    const activePerms = addModal.permissions;
    if (activePerms.includes(permission)) {
      setAddModal({ ...addModal, permissions: activePerms.filter(p => p !== permission) });
    } else {
      setAddModal({ ...addModal, permissions: [...activePerms, permission] });
    }
  };

  const handleEditTogglePermission = (permission) => {
    const item = editModal.adminItem;
    const activePerms = item.permissions;
    let updated;
    if (activePerms.includes(permission)) {
      updated = activePerms.filter(p => p !== permission);
    } else {
      updated = [...activePerms, permission];
    }
    setEditModal({ ...editModal, adminItem: { ...item, permissions: updated } });
  };

  const handleSaveEditAdmin = (e) => {
    e.preventDefault();
    const item = editModal.adminItem;
    
    fetch(`http://localhost:8000/api/admin/admins/${item.email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: item.status,
        permissions: item.role === 'Super Admin' ? ['all'] : item.permissions,
        role: item.role
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast('Admin profile privileges updated.');
          setEditModal({ open: false, adminItem: null });
          fetchAdmins();
        }
      })
      .catch(() => {
        setAdminsList(prev => prev.map(a => a.email === item.email ? item : a));
        triggerToast('Admin profile privileges updated (mock sync).');
        setEditModal({ open: false, adminItem: null });
      });
  };

  const handleSuspendAdmin = (email, currentStatus) => {
    if (email.toLowerCase() === 'admin@navorarealty.com') {
      triggerToast('Super Admin Owner cannot be suspended.');
      return;
    }
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    
    fetch(`http://localhost:8000/api/admin/admins/${email}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        permissions: [],
        role: 'Admin'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast(`Admin account ${newStatus.toLowerCase()} successfully.`);
          fetchAdmins();
        }
      })
      .catch(() => {
        setAdminsList(prev => prev.map(a => a.email === email ? { ...a, status: newStatus } : a));
        triggerToast(`Admin account ${newStatus.toLowerCase()} (mock sync).`);
      });
  };

  const handleDeleteAdmin = (email) => {
    if (email.toLowerCase() === 'admin@navorarealty.com') {
      triggerToast('Super Admin Owner cannot be deleted.');
      return;
    }
    
    fetch(`http://localhost:8000/api/admin/admins/${email}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast('Administrator deleted successfully.');
          fetchAdmins();
        }
      })
      .catch(() => {
        setAdminsList(prev => prev.filter(a => a.email !== email));
        triggerToast('Administrator deleted (mock sync).');
      });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setTempPassword(null);
      setAddModal({ open: false, name: '', email: '', role: 'Admin', permissions: ['properties', 'leads'] });
    }, 2000);
  };

  const permissionOptions = [
    { key: 'properties', label: 'Property Listings & Verifications' },
    { key: 'leads', label: 'CRM Pipeline Leads' },
    { key: 'viewings', label: 'Viewing bookings schedules' },
    { key: 'support', label: 'Customer issues ticketing' },
    { key: 'whatsapp', label: 'WhatsApp intercept AI' },
    { key: 'reports', label: 'Reports Download' }
  ];

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

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-charcoal dark:text-white font-bold">Administrators Directory</h2>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mt-1">Super Admin Exclusive Dashboard to configure employee roles and permissions.</p>
        </div>
        <button
          onClick={() => setAddModal({ ...addModal, open: true })}
          className="bg-deepblue text-white hover:bg-gold hover:text-deepblue px-5 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider flex items-center space-x-1.5 transition-all shadow-md"
        >
          <Plus size={15} />
          <span>Add Admin</span>
        </button>
      </div>

      {/* Administrators Grid List */}
      <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b dark:border-gray-800 border-gray-150">
              <tr>
                <th className="px-6 py-4 text-left">Staff Name</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Custom Permissions</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-gray-800 font-semibold">
              {adminsList.map(a => (
                <tr key={a.email} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4 text-left">
                    <h4 className="text-charcoal dark:text-white font-bold">{a.name}</h4>
                    <span className="text-[10px] text-gray-400 flex items-center mt-0.5"><Mail size={10} className="mr-1" /> {a.email}</span>
                  </td>
                  <td className="px-6 py-4 text-left text-gray-500 dark:text-gray-300">
                    <span className={`px-2 py-1 rounded text-[9px] uppercase tracking-wider font-bold ${
                      a.role === 'Super Admin' ? 'bg-gold/15 text-gold' : 'bg-deepblue/5 text-deepblue dark:text-white'
                    }`}>
                      {a.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left max-w-xs text-gray-400">
                    <div className="flex flex-wrap gap-1">
                      {a.permissions.includes('all') ? (
                        <span className="text-[9px] text-gold uppercase tracking-wider">All Privileges Enabled</span>
                      ) : (
                        a.permissions.map(p => (
                          <span key={p} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider">
                            {p}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <span className={`px-2 py-1 rounded-full text-[9px] uppercase tracking-wider font-bold ${
                      a.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500 animate-pulse'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => setEditModal({ open: true, adminItem: { ...a } })}
                        className="p-1.5 rounded-lg border dark:border-gray-800 hover:bg-deepblue hover:text-white transition-colors"
                        title="Configure permissions"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleSuspendAdmin(a.email, a.status)}
                        className={`p-1.5 rounded-lg border dark:border-gray-800 transition-colors ${
                          a.status === 'Active' ? 'hover:bg-amber-50 hover:text-amber-600' : 'hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                        title={a.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                      >
                        <Key size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(a.email)}
                        className="p-1.5 rounded-lg border dark:border-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete staff credentials"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Add Admin Form / Credentials Copy Panel */}
      {addModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-gray-800 rounded-2xl p-6 max-w-md w-full text-left space-y-4">
            
            {tempPassword ? (
              // Secure password credentials generator block
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck size={26} />
                </div>
                <h3 className="text-base font-serif font-bold text-white">Administrator Credentials Generated</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">Copy these login details safely. The password will not be shown again.</p>
                <div className="bg-charcoal-dark border border-gray-800 p-3.5 rounded-xl flex justify-between items-center text-xs font-mono text-gold">
                  <span>{tempPassword}</span>
                  <button 
                    onClick={handleCopyPassword}
                    className="text-[10px] text-white hover:text-gold flex items-center space-x-1"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ) : (
              // Input details form
              <>
                <div className="flex justify-between items-center pb-3 border-b border-gray-800 mb-2">
                  <h3 className="text-lg font-serif font-bold text-white">Add New Administrator</h3>
                  <button 
                    onClick={() => setAddModal({ open: false, name: '', email: '', role: 'Admin', permissions: ['properties', 'leads'] })}
                    className="text-gray-500 hover:text-white"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
                
                <form onSubmit={handleAddAdminSubmit} className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Staff Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={addModal.name}
                      onChange={(e) => setAddModal({ ...addModal, name: e.target.value })}
                      className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Staff Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@navorarealty.com"
                      value={addModal.email}
                      onChange={(e) => setAddModal({ ...addModal, email: e.target.value })}
                      className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Role Type</label>
                    <select
                      value={addModal.role}
                      onChange={(e) => setAddModal({ ...addModal, role: e.target.value })}
                      className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none"
                    >
                      <option value="Admin">Standard Admin</option>
                      <option value="Super Admin">Super Admin (Full Access)</option>
                    </select>
                  </div>

                  {addModal.role === 'Admin' && (
                    <div className="space-y-2 pt-2 border-t border-gray-800">
                      <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold">Configure Custom Permissions</label>
                      <div className="grid grid-cols-1 gap-2">
                        {permissionOptions.map(opt => (
                          <label key={opt.key} className="flex items-center space-x-2.5 text-gray-300 select-none cursor-pointer">
                            <input
                              type="checkbox"
                              checked={addModal.permissions.includes(opt.key)}
                              onChange={() => handleTogglePermission(opt.key)}
                              className="w-3.5 h-3.5 bg-charcoal-dark border border-gray-800 rounded text-gold focus:ring-0"
                            />
                            <span>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-deepblue text-white hover:bg-gold hover:text-deepblue py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md transition-all pt-2"
                  >
                    Generate Credentials
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}

      {/* Modal 2: Edit Admin Form */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-gray-800 rounded-2xl p-6 max-w-md w-full text-left space-y-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-800 mb-2">
              <h3 className="text-lg font-serif font-bold text-white">Edit Permissions: {editModal.adminItem.name}</h3>
              <button 
                onClick={() => setEditModal({ open: false, adminItem: null })}
                className="text-gray-500 hover:text-white"
              >
                <XCircle size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditAdmin} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Account Role</label>
                <select
                  value={editModal.adminItem.role}
                  onChange={(e) => setEditModal({ ...editModal, adminItem: { ...editModal.adminItem, role: e.target.value } })}
                  className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none"
                >
                  <option value="Admin">Standard Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              {editModal.adminItem.role === 'Admin' && (
                <div className="space-y-2 pt-2 border-t border-gray-800">
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold">Configure Custom Permissions</label>
                  <div className="grid grid-cols-1 gap-2">
                    {permissionOptions.map(opt => (
                      <label key={opt.key} className="flex items-center space-x-2.5 text-gray-300 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editModal.adminItem.permissions.includes(opt.key)}
                          onChange={() => handleEditTogglePermission(opt.key)}
                          className="w-3.5 h-3.5 bg-charcoal-dark border border-gray-800 rounded text-gold focus:ring-0"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gold text-deepblue hover:bg-white py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold shadow-md transition-all pt-2"
              >
                Save Privileges
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
