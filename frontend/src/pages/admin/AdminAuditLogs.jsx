import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../components/admin/AdminAuthProvider';
import {
  History, ShieldAlert, ShieldCheck, RefreshCw, Terminal, Search
} from 'lucide-react';

export default function AdminAuditLogs() {
  const { admin } = useAdminAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/admin/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Backend down. Fallback local logs used.", err);
        setLogs([
          { admin: "admin@navorarealty.com", action: "Website Settings Updated", time: "2026-06-27 10:15:30", record: "Company Settings", ip: "192.168.1.55" },
          { admin: "admin@navorarealty.com", action: "Approved Property Listing", time: "2026-06-26 14:22:10", record: "Oceanview Vista (ID 1)", ip: "192.168.1.55" },
          { admin: "agent@navorarealty.com", action: "Scheduled Client Tour", time: "2026-06-25 09:12:00", record: "Viewing ID 202 (Fatma Ali)", ip: "192.168.1.80" }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (admin?.role !== 'Super Admin') {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center p-8 text-red-500 max-w-md mx-auto">
        <ShieldAlert size={44} className="mb-4 text-red-500/60" />
        <h3 className="text-lg font-serif font-bold">Access Restricted</h3>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">Only the Navora Realty Owner (Super Admin) account has authorization to inspect the system modifications and review the audit logs timeline.</p>
      </div>
    );
  }

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.admin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.record.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left relative">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-serif text-charcoal dark:text-white font-bold flex items-center">
            <History className="mr-2 text-gold stroke-[2]" size={24} />
            <span>Audit Logs Tracker</span>
          </h2>
          <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mt-1">Immutable administrative timeline tracking changes, login actions, and records adjustments.</p>
        </div>
        
        {/* Search bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 text-gray-500" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action logs..."
            className="w-full bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal dark:text-white focus:outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Audit list panel */}
      <div className="bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500 space-y-4">
            <RefreshCw className="animate-spin" size={24} />
            <span className="text-xs uppercase tracking-widest font-bold">Querying security logs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-b dark:border-gray-800 border-gray-150">
                <tr>
                  <th className="px-6 py-4 text-left">Timestamp</th>
                  <th className="px-6 py-4 text-left">Administrator</th>
                  <th className="px-6 py-4 text-left">Action Logs</th>
                  <th className="px-6 py-4 text-left">Affected Record</th>
                  <th className="px-6 py-4 text-left">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-gray-800 font-semibold font-mono text-[11px] text-gray-600 dark:text-gray-300">
                {filteredLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-left whitespace-nowrap text-gray-400 font-sans">
                      {log.time}
                    </td>
                    <td className="px-6 py-4 text-left font-sans text-charcoal dark:text-white">
                      {log.admin}
                    </td>
                    <td className="px-6 py-4 text-left font-sans text-gold">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 text-left">
                      {log.record}
                    </td>
                    <td className="px-6 py-4 text-left text-gray-400 font-sans">
                      {log.ip}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-sans">
                      No matching audit logs found in search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
