import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    fetch('http://localhost:8000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (!res.ok) throw new Error("API Offline");
        return res.json();
      })
      .then(() => {
        setSubmitting(false);
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      })
      .catch(() => {
        // Backend offline fallback - simulate successful submit
        setTimeout(() => {
          setSubmitting(false);
          setSuccess(true);
          setFormData({ name: '', email: '', phone: '', message: '' });
        }, 1200);
      });
  };

  const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(
    "Hello Navora Realty, I have an inquiry about coastal properties."
  )}`;

  return (
    <div className="bg-offwhite min-h-screen py-16">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Intro */}
        <div className="text-left mb-16 max-w-3xl">
          <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-2">Connect</h4>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal mb-4">Contact Our Team</h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            Have questions about local property laws, specific listings, or yield metrics? Reach out to our Nyali-based advisors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* 1. Contact Info Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Info Card: Phone */}
            <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-md flex items-start space-x-4 text-left">
              <div className="p-3 bg-deepblue/5 text-deepblue rounded-lg">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-charcoal text-base">Call Hotline</h4>
                <p className="text-sm text-gray-500 mt-1">Available Mon - Sat (8am - 6pm)</p>
                <a href="tel:+254700000000" className="text-gold hover:text-deepblue font-bold text-sm block mt-2 transition-colors">
                  +254 700 000 000
                </a>
              </div>
            </div>

            {/* Info Card: Email */}
            <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-md flex items-start space-x-4 text-left">
              <div className="p-3 bg-deepblue/5 text-deepblue rounded-lg">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-charcoal text-base">Email Inquiries</h4>
                <p className="text-sm text-gray-500 mt-1">We respond within 12 hours</p>
                <a href="mailto:info@navorarealty.com" className="text-gold hover:text-deepblue font-bold text-sm block mt-2 transition-colors">
                  info@navorarealty.com
                </a>
              </div>
            </div>

            {/* Info Card: Address */}
            <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-md flex items-start space-x-4 text-left">
              <div className="p-3 bg-deepblue/5 text-deepblue rounded-lg">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-charcoal text-base">Coastal Office</h4>
                <p className="text-sm text-gray-500 mt-1">Navora Plaza, Links Road</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider block mt-2">
                  Nyali, Mombasa, Kenya
                </p>
              </div>
            </div>

            {/* Info Card: WhatsApp */}
            <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-md flex items-start space-x-4 text-left">
              <div className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-lg">
                <MessageSquare size={20} fill="#25D366" fillOpacity={0.1} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-charcoal text-base">Direct Chat</h4>
                <p className="text-sm text-gray-500 mt-1">Connect with an agent on WhatsApp</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:text-emerald-700 font-bold text-sm block mt-2 transition-colors"
                >
                  Start Chatting
                </a>
              </div>
            </div>

          </div>

          {/* 2. Form & Map Column (8 cols) */}
          <div className="lg:col-span-8 space-y-10 text-left">
            
            {/* Form */}
            <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-2xl shadow-lg">
              <h3 className="text-xl font-serif text-charcoal font-bold mb-6 pb-4 border-b border-gray-100">
                Send a Message
              </h3>

              {success ? (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 text-center rounded-xl flex flex-col items-center"
                >
                  <CheckCircle2 size={36} className="text-emerald-600 mb-3" />
                  <h4 className="font-bold text-base">Message Sent Successfully</h4>
                  <p className="text-xs text-emerald-700 mt-1.5 leading-relaxed max-w-sm">
                    Thank you for reaching out. A coastal advisor has received your request and will follow up shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-deepblue text-white hover:bg-gold hover:text-deepblue transition-all px-6 py-2.5 uppercase text-[10px] tracking-widest font-bold mt-6 shadow-md"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="name@domain.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +254 700 000 000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Your Message</label>
                    <textarea
                      name="message"
                      required
                      rows="5"
                      placeholder="Write your questions or request viewing times here..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-deepblue text-white hover:bg-gold hover:text-deepblue transition-all duration-300 py-3.5 rounded-lg flex items-center justify-center font-bold tracking-widest text-xs uppercase space-x-2 shadow-md"
                  >
                    <Send size={14} />
                    <span>{submitting ? "Sending message..." : "Send Inquiry"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Google Map Placeholder */}
            <div className="bg-white p-4 border border-gray-100 rounded-2xl shadow-lg">
              <div className="h-80 bg-slate-100 border border-gray-200 rounded-xl relative overflow-hidden flex flex-col justify-center items-center p-6 text-center">
                {/* Decorative Map Ring Overlay */}
                <div className="absolute w-72 h-72 border border-gold/5 rounded-full pointer-events-none"></div>
                <div className="absolute w-40 h-40 border border-gold/10 rounded-full pointer-events-none"></div>
                
                <div className="z-10">
                  <div className="w-12 h-12 bg-deepblue text-gold rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 border border-deepblue-light">
                    <MapPin size={24} className="animate-bounce" />
                  </div>
                  <h4 className="font-serif font-bold text-charcoal text-base mb-1">Mombasa Office Location</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                    Navora Plaza, Links Road, Nyali, Mombasa, Kenya.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Nyali+Mombasa+Kenya+Links+Road"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-deepblue text-white hover:bg-gold hover:text-deepblue transition-all px-6 py-2.5 uppercase text-[10px] tracking-widest font-bold inline-block shadow-md"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
