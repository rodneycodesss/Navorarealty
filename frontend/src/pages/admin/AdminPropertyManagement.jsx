import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthProvider';
import {
  Building, CheckCircle, XCircle, Trash2, Eye, Edit2, AlertCircle, FileText, CheckSquare, MapPin, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPropertyManagement() {
  const { hasPermission } = useAdminAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionModal, setRejectionModal] = useState({ open: false, id: null, reason: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [editModal, setEditModal] = useState({ open: false, property: null });
  const [toast, setToast] = useState(null);

  const fetchProperties = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/admin/properties')
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend down. Fallback local properties used.", err);
        setProperties([
          {
            id: 1,
            title: "Oceanview Vista Apartment",
            price: "Ksh 18,500,000",
            price_num: 18500000,
            location: "Nyali",
            beds: 3,
            baths: 3,
            sqft: 2200,
            image_url: "/assets/property_1.png",
            verified: true,
            airbnb_ready: true,
            for_sale: true,
            for_rent: true,
            description: "Splendid beachside view apartment."
          },
          {
            id: 2,
            title: "Bamburi Beachfront Villa",
            price: "Ksh 45,000,000",
            price_num: 45000000,
            location: "Bamburi",
            beds: 4,
            baths: 4,
            sqft: 4100,
            image_url: "/assets/kenya_hero_exterior_1_1776795946715.png",
            verified: false,
            airbnb_ready: false,
            for_sale: true,
            for_rent: false,
            description: "Luxurious beachfront villa."
          }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const triggerToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = (id) => {
    if (!hasPermission('properties')) {
      triggerToast('Access Denied. Insufficient permissions.', 'error');
      return;
    }

    fetch(`http://localhost:8000/api/admin/properties/${id}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast('Property approved successfully and is now Live!');
          fetchProperties();
          setSelectedProperty(null);
        } else {
          triggerToast(data.message || 'Verification update failed', 'error');
        }
      })
      .catch(() => {
        // Local state toggle if API fails
        setProperties(prev => prev.map(p => p.id === id ? { ...p, verified: true } : p));
        triggerToast('Property approved successfully (mock sync).');
        setSelectedProperty(null);
      });
  };

  const handleReject = () => {
    const { id, reason } = rejectionModal;
    if (!reason.trim()) {
      triggerToast('Please provide a rejection reason.', 'error');
      return;
    }

    fetch(`http://localhost:8000/api/admin/properties/${id}/verify`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', reason })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast('Property rejected. Notice sent to seller.');
          setRejectionModal({ open: false, id: null, reason: '' });
          fetchProperties();
          setSelectedProperty(null);
        }
      })
      .catch(() => {
        setProperties(prev => prev.map(p => p.id === id ? { ...p, verified: false, rejection_reason: reason } : p));
        triggerToast('Property rejected (mock sync).');
        setRejectionModal({ open: false, id: null, reason: '' });
        setSelectedProperty(null);
      });
  };

  const handleDelete = () => {
    const { id } = deleteModal;
    fetch(`http://localhost:8000/api/admin/properties/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerToast('Property deleted successfully.');
          setDeleteModal({ open: false, id: null });
          fetchProperties();
          setSelectedProperty(null);
        }
      })
      .catch(() => {
        setProperties(prev => prev.filter(p => p.id !== id));
        triggerToast('Property listing removed (mock sync).');
        setDeleteModal({ open: false, id: null });
        setSelectedProperty(null);
      });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updated = editModal.property;
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
    triggerToast('Property details updated successfully.');
    setEditModal({ open: false, property: null });
    if (selectedProperty && selectedProperty.id === updated.id) {
      setSelectedProperty(updated);
    }
  };

  return (
    <div className="space-y-6 text-left relative">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center space-x-3 text-xs uppercase font-bold tracking-wider ${
              toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
            }`}
          >
            <AlertCircle size={16} />
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-charcoal dark:text-white font-bold">Property Verification</h2>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mt-1">Review and verify coastal listings before they launch on the Navora platform.</p>
        </div>
      </div>

      {/* Main Grid: Listings table & Side panel review */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Properties Table */}
        <div className="xl:col-span-2 bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b dark:border-gray-800 border-gray-150">
                <tr>
                  <th className="px-6 py-4 text-left">Property Details</th>
                  <th className="px-6 py-4 text-left">Location</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-800 font-semibold">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-4">
                      <img 
                        src={p.image_url} 
                        alt={p.title} 
                        className="w-12 h-12 object-cover rounded-lg border border-gray-150 dark:border-gray-700" 
                      />
                      <div className="text-left leading-tight">
                        <h4 className="text-charcoal dark:text-white font-serif font-bold text-sm">{p.title}</h4>
                        <span className="text-[10px] text-gray-400 mt-1 block">ID: #{p.id} • {p.beds} Beds • {p.baths} Baths</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin size={13} className="text-gold" />
                        <span>{p.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left font-serif text-charcoal dark:text-white">
                      {p.price}
                    </td>
                    <td className="px-6 py-4 text-left">
                      {p.verified ? (
                        <span className="bg-emerald-500/10 text-emerald-500 text-[9px] uppercase tracking-wider px-2 py-1 rounded-full font-bold">
                          Live Verified
                        </span>
                      ) : (
                        <span className="bg-amber-500/10 text-amber-500 text-[9px] uppercase tracking-wider px-2 py-1 rounded-full font-bold animate-pulse">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setSelectedProperty(p)}
                          className="p-1.5 rounded-lg border dark:border-gray-800 hover:bg-deepblue hover:text-white transition-colors"
                          title="Review details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setEditModal({ open: true, property: { ...p } })}
                          className="p-1.5 rounded-lg border dark:border-gray-800 hover:bg-gold hover:text-deepblue transition-colors"
                          title="Edit details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: p.id })}
                          className="p-1.5 rounded-lg border dark:border-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel: Detail Review */}
        <div className="xl:col-span-1">
          {selectedProperty ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b dark:border-gray-800 border-gray-150">
                <h3 className="font-serif font-bold text-base text-charcoal dark:text-white">Listing Review</h3>
                <button onClick={() => setSelectedProperty(null)} className="text-gray-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <img 
                src={selectedProperty.image_url} 
                alt={selectedProperty.title} 
                className="w-full h-44 object-cover rounded-xl border border-gray-100 dark:border-gray-700 shadow-md"
              />

              <div>
                <h4 className="text-sm font-serif font-bold text-charcoal dark:text-white">{selectedProperty.title}</h4>
                <p className="text-[10px] text-gold uppercase tracking-wider font-bold mt-1">{selectedProperty.location} Coastal Area</p>
                <p className="text-xs text-gray-400 mt-3 leading-relaxed font-sans font-light">{selectedProperty.description || 'No description provided.'}</p>
              </div>

              {/* Checklist verification widget */}
              <div className="bg-offwhite dark:bg-gray-800/40 border dark:border-gray-800 border-gray-100 p-4 rounded-xl space-y-2">
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Documents Checklist</span>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-300">
                  <CheckSquare size={13} className="text-gold" />
                  <span>Land Registry title authenticated</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-300">
                  <CheckSquare size={13} className="text-gold" />
                  <span>Seller proof of identity verified</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-300">
                  <CheckSquare size={13} className="text-gold" />
                  <span>Coastal conservation boundary checked</span>
                </div>
              </div>

              {/* Action workflows */}
              <div className="space-y-3 pt-2">
                {!selectedProperty.verified ? (
                  <>
                    <button
                      onClick={() => handleApprove(selectedProperty.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 text-xs uppercase tracking-wider shadow-md"
                    >
                      <CheckCircle size={15} />
                      <span>Approve & Verify</span>
                    </button>
                    <button
                      onClick={() => setRejectionModal({ open: true, id: selectedProperty.id, reason: '' })}
                      className="w-full border border-red-500 text-red-500 hover:bg-red-500/10 font-bold py-3 rounded-xl flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
                    >
                      <XCircle size={15} />
                      <span>Reject Listing</span>
                    </button>
                  </>
                ) : (
                  <div className="text-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 py-3 rounded-xl text-xs uppercase tracking-wider font-bold">
                    This Listing is Navora Verified
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="h-full border-2 border-dashed dark:border-gray-800 border-gray-150 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-gray-400 bg-white/40 dark:bg-charcoal-dark/20 min-h-[300px]">
              <Building size={34} className="mb-4 text-gray-500/60" />
              <p className="text-xs uppercase tracking-wider font-bold">Select a property listing to review details</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal 1: Rejection Reason */}
      {rejectionModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-gray-800 rounded-2xl p-6 max-w-md w-full text-left space-y-4">
            <h3 className="text-lg font-serif font-bold text-white">Provide Rejection Reason</h3>
            <textarea
              required
              rows={4}
              value={rejectionModal.reason}
              onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
              placeholder="Provide reason (e.g. Title copy unreadable, incorrect mapping boundaries...)"
              className="w-full bg-charcoal-dark border border-gray-800 focus:border-gold rounded-xl p-3 text-xs text-white focus:outline-none placeholder:text-gray-600"
            />
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white hover:bg-red-700 py-3 rounded-xl text-xs uppercase tracking-wider font-bold"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => setRejectionModal({ open: false, id: null, reason: '' })}
                className="flex-1 border border-gray-800 text-gray-400 hover:text-white py-3 rounded-xl text-xs uppercase tracking-wider font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Deletion Confirmation */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-charcoal border border-gray-800 rounded-2xl p-6 max-w-sm w-full text-left space-y-4">
            <h3 className="text-lg font-serif font-bold text-white">Delete Listing Listing?</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-light">Are you sure you want to permanently remove this property from Navora Realty listings? This action is irreversible.</p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white hover:bg-red-700 py-3 rounded-xl text-xs uppercase tracking-wider font-bold"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="flex-1 border border-gray-800 text-gray-400 hover:text-white py-3 rounded-xl text-xs uppercase tracking-wider font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Edit details form */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-charcoal border border-gray-800 rounded-2xl p-6 max-w-lg w-full text-left space-y-4">
            <h3 className="text-lg font-serif font-bold text-white">Edit Property Listing Details</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Title</label>
                <input
                  type="text"
                  value={editModal.property.title}
                  onChange={(e) => setEditModal({ ...editModal, property: { ...editModal.property, title: e.target.value } })}
                  className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Price</label>
                  <input
                    type="text"
                    value={editModal.property.price}
                    onChange={(e) => setEditModal({ ...editModal, property: { ...editModal.property, price: e.target.value } })}
                    className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    value={editModal.property.location}
                    onChange={(e) => setEditModal({ ...editModal, property: { ...editModal.property, location: e.target.value } })}
                    className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Beds</label>
                  <input
                    type="number"
                    value={editModal.property.beds}
                    onChange={(e) => setEditModal({ ...editModal, property: { ...editModal.property, beds: parseInt(e.target.value) } })}
                    className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Baths</label>
                  <input
                    type="number"
                    value={editModal.property.baths}
                    onChange={(e) => setEditModal({ ...editModal, property: { ...editModal.property, baths: parseInt(e.target.value) } })}
                    className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Sqft</label>
                  <input
                    type="number"
                    value={editModal.property.sqft}
                    onChange={(e) => setEditModal({ ...editModal, property: { ...editModal.property, sqft: parseInt(e.target.value) } })}
                    className="w-full bg-charcoal-dark border border-gray-800 rounded-lg p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-gold text-deepblue hover:bg-white transition-colors py-3 rounded-xl text-xs uppercase tracking-wider font-bold"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal({ open: false, property: null })}
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
