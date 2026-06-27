import { useState } from 'react';
import {
  FileSpreadsheet, FileText, Download, Loader2, Calendar, ShieldCheck, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminReports() {
  const [activeReport, setActiveReport] = useState('listings');
  const [exportFormat, setExportFormat] = useState('csv');
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const reportTypes = [
    { id: 'listings', name: 'Monthly Properties Listings', desc: 'Summary of verified, pending, and rejected coastal property listings.' },
    { id: 'leads', name: 'Sales Leads Performance', desc: 'CRM leads pipeline conversions, active budgets, and inbound sources.' },
    { id: 'viewings', name: 'Client Viewing Tour Schedules', desc: 'History of approved, rescheduled, and completed site tours.' },
    { id: 'issues', name: 'Customer Support Tickets', desc: 'Resolved and escalated support tickets log summary.' }
  ];

  const handleExport = async () => {
    setDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // simulated compile time

    let filename = '';
    let headers = [];
    let rows = [];

    if (activeReport === 'listings') {
      filename = `Navora_Monthly_Listings.${exportFormat === 'pdf' ? 'txt' : exportFormat}`;
      headers = ['Property ID', 'Title', 'Location', 'Price (Ksh)', 'Verified', 'Airbnb Ready', 'ROI (%)'];
      rows = [
        [1, 'Oceanview Vista Apartment', 'Nyali', 18500000, 'True', 'True', 12.1],
        [2, 'Bamburi Beachfront Villa', 'Bamburi', 45000000, 'True', 'False', 9.2],
        [3, 'Serene Holiday Penthouse', 'Shanzu', 28000000, 'True', 'True', 13.5],
        [4, 'Mtwapa Marina Residency', 'Mtwapa', 12000000, 'False', 'True', 11.0],
        [5, 'Kizingo Royal Suite', 'Kizingo', 32000000, 'False', 'False', 8.5]
      ];
    } else if (activeReport === 'leads') {
      filename = `Navora_Leads_CRM.${exportFormat === 'pdf' ? 'txt' : exportFormat}`;
      headers = ['Lead ID', 'Customer Name', 'Phone', 'Interest', 'Budget', 'Status', 'Source'];
      rows = [
        [301, 'John Kamuri', '+254700999888', 'Bamburi Beachfront Villa', 'Ksh 40,000,000', 'Negotiating', 'Website Inquiry'],
        [302, 'Esther Wanjiku', '+254712111000', 'Shanzu Shores Suite', 'Ksh 16,500,000', 'New', 'WhatsApp Chatbot'],
        [303, 'Amani Salim', '+254722333444', 'Oceanview Vista Apartment', 'Ksh 18,500,000', 'Closed', 'Referral']
      ];
    } else if (activeReport === 'viewings') {
      filename = `Navora_Tour_Schedules.${exportFormat === 'pdf' ? 'txt' : exportFormat}`;
      headers = ['Viewing ID', 'Customer', 'Property Title', 'Date', 'Time', 'Status'];
      rows = [
        [201, 'Michael Ochieng', 'Oceanview Vista Apartment', '2026-06-30', '10:00 AM', 'Pending'],
        [202, 'Fatma Ali', 'Serene Holiday Penthouse', '2026-07-02', '02:00 PM', 'Approved']
      ];
    } else {
      filename = `Navora_Support_Tickets.${exportFormat === 'pdf' ? 'txt' : exportFormat}`;
      headers = ['Ticket ID', 'Customer', 'Category', 'Priority', 'Status', 'Date'];
      rows = [
        [101, 'David Kamau', 'Verification Delay', 'Medium', 'Open', '2026-06-25'],
        [102, 'Sarah Njeri', 'Account Access', 'High', 'Resolved', '2026-06-24']
      ];
    }

    // Trigger file download stream
    let content = '';
    if (exportFormat === 'csv' || exportFormat === 'xlsx') {
      const separator = exportFormat === 'xlsx' ? '\t' : ',';
      content = [headers.join(separator), ...rows.map(r => r.join(separator))].join('\n');
    } else {
      // PDF/Plain Text Print Summary Layout
      content = `NAVORA REALTY MANAGEMENT REPORT\n`;
      content += `========================================\n`;
      content += `Report Type: ${filename.split('.')[0].replace(/_/g, ' ')}\n`;
      content += `Generated Date: 2026-06-27\n`;
      content += `========================================\n\n`;
      content += headers.join(' | ') + '\n';
      content += '-'.repeat(80) + '\n';
      rows.forEach(r => {
        content += r.join(' | ') + '\n';
      });
    }

    const mimeType = exportFormat === 'csv' 
      ? 'text/csv;charset=utf-8;' 
      : exportFormat === 'xlsx'
        ? 'application/vnd.ms-excel;charset=utf-8;'
        : 'text/plain;charset=utf-8;';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloading(false);
    triggerToast(`Report downloaded successfully as ${exportFormat.toUpperCase()}.`);
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
        <h2 className="text-2xl font-serif text-charcoal dark:text-white font-bold">Document Exports & Reports</h2>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mt-1">Compile corporate statistics and export spreadsheets directly to local storage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Report selection widgets */}
        <div className="lg:col-span-2 space-y-4">
          {reportTypes.map((report) => (
            <div
              key={report.id}
              onClick={() => setActiveReport(report.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                activeReport === report.id
                  ? 'border-gold bg-gold/5 dark:bg-gold/[0.03]'
                  : 'dark:border-gray-800 border-gray-150 bg-white dark:bg-charcoal-dark hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activeReport === report.id ? 'bg-gold/20 text-gold' : 'bg-deepblue/5 text-deepblue dark:text-gold'
                }`}>
                  {activeReport === report.id ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                </div>
                <div className="text-left">
                  <h4 className="font-serif font-bold text-sm text-charcoal dark:text-white leading-snug">{report.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed font-sans">{report.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Format selectors & compile downloads */}
        <div className="lg:col-span-1 bg-white dark:bg-charcoal-dark border border-gray-150 dark:border-gray-800 p-6 rounded-2xl shadow-sm h-fit space-y-6">
          <div className="border-b dark:border-gray-800 border-gray-150 pb-4">
            <h3 className="font-serif font-bold text-sm text-charcoal dark:text-white">Export Configurations</h3>
          </div>

          {/* Export formats radio checks */}
          <div className="space-y-3 text-xs font-semibold">
            <label className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1">Select File Format</label>
            
            {[
              { id: 'csv', name: 'Comma Separated Values (.csv)', desc: 'Standard data exchange format.' },
              { id: 'xlsx', name: 'Microsoft Excel Spreadsheet (.xlsx / tab-delimited)', desc: 'Pre-formatted structure.' },
              { id: 'pdf', name: 'Printable Layout Summary (.pdf / .txt)', desc: 'Reader friendly text summary.' }
            ].map(fmt => (
              <label 
                key={fmt.id} 
                className={`p-3 border rounded-xl flex items-start space-x-3 cursor-pointer select-none transition-colors ${
                  exportFormat === fmt.id 
                    ? 'border-gold bg-gold/5 text-gold' 
                    : 'dark:border-gray-800 border-gray-100 text-gray-300 hover:bg-gray-800/30'
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  checked={exportFormat === fmt.id}
                  onChange={() => setExportFormat(fmt.id)}
                  className="mt-0.5 text-gold focus:ring-0 w-3.5 h-3.5 bg-charcoal border border-gray-850"
                />
                <div className="text-left text-xs leading-none">
                  <span className="font-bold text-charcoal dark:text-white">{fmt.name}</span>
                  <p className="text-[9px] text-gray-400 mt-1">{fmt.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Download trigger */}
          <button
            onClick={handleExport}
            disabled={downloading}
            className="w-full bg-deepblue hover:bg-gold text-white hover:text-deepblue disabled:bg-gray-800 disabled:text-gray-600 transition-all duration-300 py-3.5 rounded-xl flex items-center justify-center font-bold tracking-widest text-xs uppercase space-x-2.5 shadow-lg"
          >
            {downloading ? (
              <>
                <Loader2 className="animate-spin" size={15} />
                <span>Compiling summary...</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>Compile & Download</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
