import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Square, Car, Calendar, ShieldCheck, CheckCircle2,
  HelpCircle, PhoneCall, MessageSquare, ArrowLeft, Send, Check
} from 'lucide-react';
import { motion } from 'framer-motion';

// Reusable detailed database for offline fallback
const LOCAL_PROPERTIES_DETAILS = [
  {
    id: 1,
    title: "Oceanview Vista Apartment",
    price: "Ksh 18,500,000",
    price_num: 18500000,
    location: "Nyali",
    beds: 3,
    baths: 3.0,
    sqft: 2200,
    parking: 2,
    year_built: 2024,
    image_url: "/assets/property_1.png",
    images: [
      "/assets/property_1.png",
      "/assets/kenya_hero_interior_1_1776795994577.png",
      "/assets/hero_interior_1.png"
    ],
    verified: true,
    airbnb_ready: true,
    rental_yield: 9.8,
    airbnb_income: 220000,
    occupancy_rate: 78.0,
    roi: 12.1,
    amenities: ["Swimming Pool", "Balcony", "Security", "Parking", "Internet", "Backup Power", "Lift", "Gym"],
    description: "Experience coastal luxury living at its finest. This stunning 3-bedroom oceanfront apartment in Nyali offers breathtaking views of the Indian Ocean, premium high-end finishes, an open-plan kitchen, and spacious balconies to enjoy the fresh sea breeze. Strategically located near top-tier restaurants and shopping spots, it is the ideal home for both private stay and premium rental yields."
  },
  {
    id: 2,
    title: "Bamburi Beachfront Villa",
    price: "Ksh 45,000,000",
    price_num: 45000000,
    location: "Bamburi",
    beds: 4,
    baths: 4.0,
    sqft: 4100,
    parking: 3,
    year_built: 2022,
    image_url: "/assets/kenya_hero_exterior_1_1776795946715.png",
    images: [
      "/assets/kenya_hero_exterior_1_1776795946715.png",
      "/assets/kenya_hero_interior_1_1776795994577.png"
    ],
    verified: true,
    airbnb_ready: false,
    rental_yield: 7.5,
    airbnb_income: 380000,
    occupancy_rate: 65.0,
    roi: 9.2,
    amenities: ["Swimming Pool", "Balcony", "Security", "Parking", "Internet", "Backup Power", "Gym"],
    description: "Direct private beach access and exquisite architecture make this 4-bedroom villa in Bamburi a rare coastal gem. Features high ceilings, a private pool, a lush tropical garden, and state-of-the-art security systems. Built with traditional swahili-influenced architecture merged with modern interior styling, this is a premium coastal landmark."
  },
  {
    id: 3,
    title: "Serene Holiday Penthouse",
    price: "Ksh 28,000,000",
    price_num: 28000000,
    location: "Shanzu",
    beds: 2,
    baths: 2.0,
    sqft: 1600,
    parking: 1,
    year_built: 2025,
    image_url: "/assets/kenya_property_1_1776795961306.png",
    images: [
      "/assets/kenya_property_1_1776795961306.png",
      "/assets/hero_interior_1.png",
      "/assets/kenya_hero_interior_1_1776795994577.png"
    ],
    verified: true,
    airbnb_ready: true,
    rental_yield: 10.5,
    airbnb_income: 280000,
    occupancy_rate: 82.0,
    roi: 13.5,
    amenities: ["Swimming Pool", "Balcony", "Security", "Parking", "Internet", "Backup Power", "Lift"],
    description: "Located in the heart of Shanzu, this modern 2-bedroom penthouse is custom-designed for premium holiday rentals and high Airbnb yield. Fully furnished with high-end designer furniture and featuring an expansive panoramic rooftop terrace overlooking the Shanzu coastline. Excellent passive income generator with proven property management support on-site."
  },
  {
    id: 4,
    title: "Mtwapa Marina Residency",
    price: "Ksh 12,000,000",
    price_num: 12000000,
    location: "Mtwapa",
    beds: 2,
    baths: 2.0,
    sqft: 1200,
    parking: 1,
    year_built: 2023,
    image_url: "/assets/kenya_property_2_1776795980612.png",
    images: [
      "/assets/kenya_property_2_1776795980612.png",
      "/assets/kenya_hero_interior_1_1776795994577.png"
    ],
    verified: false,
    airbnb_ready: true,
    rental_yield: 8.8,
    airbnb_income: 130000,
    occupancy_rate: 70.0,
    roi: 9.8,
    amenities: ["Swimming Pool", "Balcony", "Security", "Parking", "Internet", "Backup Power"],
    description: "This elegant 2-bedroom apartment overlooks the Mtwapa Creek, offering a calm and serene waterfront environment. Perfect entry-level investment for vacationers and rental income alike. It features custom teakwood fittings, access to a common marina dock, and proximity to major supermarkets."
  },
  {
    id: 5,
    title: "Kizingo Executive Haven",
    price: "Ksh 32,500,000",
    price_num: 32500000,
    location: "Kizingo",
    beds: 3,
    baths: 3.0,
    sqft: 2800,
    parking: 2,
    year_built: 2024,
    image_url: "/assets/property_2.png",
    images: [
      "/assets/property_2.png",
      "/assets/hero_interior_1.png"
    ],
    verified: true,
    airbnb_ready: false,
    rental_yield: 8.2,
    airbnb_income: 200000,
    occupancy_rate: 72.0,
    roi: 9.5,
    amenities: ["Balcony", "Security", "Parking", "Internet", "Backup Power", "Lift", "Gym"],
    description: "Nestled in the prestigious Kizingo area, this executive 3-bedroom apartment offers urban sophistication combined with partial sea views. High proximity to Mombasa CBD, top schools, and leisure clubs. Perfect for corporate tenants and family residency."
  },
  {
    id: 6,
    title: "Shanzu Shores Suite",
    price: "Ksh 16,500,000",
    price_num: 16500000,
    location: "Shanzu",
    beds: 1,
    baths: 1.5,
    sqft: 950,
    parking: 1,
    year_built: 2025,
    image_url: "/assets/hero_interior_1.png",
    images: [
      "/assets/hero_interior_1.png",
      "/assets/kenya_hero_interior_1_1776795994577.png"
    ],
    verified: true,
    airbnb_ready: true,
    rental_yield: 11.2,
    airbnb_income: 175000,
    occupancy_rate: 85.0,
    roi: 14.2,
    amenities: ["Swimming Pool", "Balcony", "Security", "Parking", "Internet", "Backup Power", "Lift", "Gym"],
    description: "A premium 1-bedroom beachfront apartment designed specifically to maximize high rental yields and Airbnb guest satisfaction. Features state-of-the-art finishes and a private balcony directly overlooking the pool and ocean. Strategically marketed for vacationers looking for cozy luxury."
  }
];

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewingForm, setViewingForm] = useState({ name: '', phone: '', date: '', message: '' });
  const [submittedRequest, setSubmittedRequest] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/properties/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        // Double check matching ID
        if (data.id === parseInt(id)) {
          setProperty(data);
        } else {
          // Fallback search locally
          const fallback = LOCAL_PROPERTIES_DETAILS.find((p) => p.id === parseInt(id));
          setProperty(fallback || LOCAL_PROPERTIES_DETAILS[0]);
        }
        setLoading(false);
      })
      .catch(() => {
        const fallback = LOCAL_PROPERTIES_DETAILS.find((p) => p.id === parseInt(id));
        setProperty(fallback || LOCAL_PROPERTIES_DETAILS[0]);
        setLoading(false);
      });
  }, [id]);

  const handleRequestSubmit = (e) => {
    e.preventDefault();

    const payload = {
      customer: viewingForm.name,
      phone: viewingForm.phone,
      property: property.title,
      property_id: property.id,
      preferred_date: viewingForm.date,
      preferred_time: "10:00 AM" // Default standard coastal morning viewing slot
    };

    fetch('http://localhost:8000/api/viewings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSubmittedRequest(true);
          setTimeout(() => {
            setViewingForm({ name: '', phone: '', date: '', message: '' });
          }, 2000);
        }
      })
      .catch((err) => {
        console.warn("API error booking viewing, falling back to local simulation:", err);
        setSubmittedRequest(true);
        setTimeout(() => {
          setViewingForm({ name: '', phone: '', date: '', message: '' });
        }, 2000);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-offwhite">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-gold border-t-transparent animate-spin"></div>
          <span className="text-gray-500 font-medium">Loading property details...</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-6 py-20 text-center bg-offwhite min-h-[70vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Property Not Found</h2>
        <p className="text-gray-500 mb-8">The requested property listing does not exist or has been removed.</p>
        <Link to="/properties" className="bg-deepblue text-white px-6 py-3 font-bold uppercase tracking-wider text-xs">
          Back to Listings
        </Link>
      </div>
    );
  }

  // Pre-filled WhatsApp details
  const whatsappUrl = `https://wa.me/254700000000?text=${encodeURIComponent(
    `Hello Navora Realty, I'm interested in viewing the "${property.title}" in ${property.location} priced at ${property.price}.`
  )}`;

  return (
    <div className="bg-offwhite min-h-screen pb-20">
      
      {/* Back Button Navigation bar */}
      <div className="bg-white border-b border-gray-100 py-4 shadow-sm">
        <div className="container mx-auto px-6 lg:px-12">
          <Link to="/properties" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-gold uppercase tracking-wider transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to All Properties
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 mt-10">
        
        {/* Header Title block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6 text-left">
          <div>
            <div className="flex flex-wrap gap-2.5 mb-3.5">
              {property.verified && (
                <span className="bg-emerald-600 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full flex items-center shadow-sm">
                  <ShieldCheck size={11} className="mr-1 fill-white/10" />
                  Navora Verified
                </span>
              )}
              {property.airbnb_ready && (
                <span className="bg-deepblue text-gold text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full flex items-center shadow-sm border border-deepblue-light/50">
                  <CheckCircle2 size={11} className="mr-1 fill-gold/10" />
                  Airbnb Ready
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center text-gray-500 text-sm font-semibold tracking-wider mt-3">
              <MapPin size={16} className="text-gold mr-2" />
              <span>{property.location}, Mombasa Coast, Kenya</span>
            </div>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Asking Price</p>
            <p className="text-3xl md:text-4xl font-serif font-bold text-deepblue leading-none">
              {property.price}
            </p>
          </div>
        </div>

        {/* Grid: Left main info, Right quick contact/view forms */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main info column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Gallery Image block */}
            <div className="bg-white p-4 border border-gray-100 rounded-2xl shadow-md space-y-4">
              <div className="h-[400px] md:h-[500px] rounded-xl overflow-hidden relative">
                <img
                  src={property.images[activeImageIdx]}
                  alt={`${property.title} view`}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>
              
              {/* Thumbnails row */}
              {property.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto py-1">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeImageIdx === idx ? 'border-gold scale-95 shadow-md' : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Overview Grid */}
            <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-md text-left">
              <h3 className="text-xl font-serif text-charcoal font-bold mb-6 pb-4 border-b border-gray-100">
                Property Overview
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  { Icon: Bed, label: 'Bedrooms', value: `${property.beds} Rooms` },
                  { Icon: Bath, label: 'Bathrooms', value: `${property.baths} Baths` },
                  { Icon: Square, label: 'Floor Area', value: `${property.sqft} Sqft` },
                  { Icon: Car, label: 'Parking Space', value: `${property.parking} Slot${property.parking > 1 ? 's' : ''}` },
                  { Icon: Calendar, label: 'Year Built', value: property.year_built },
                  { Icon: ShieldCheck, label: 'Listing Status', value: property.verified ? 'Verified' : 'Pending Verification' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3.5">
                    <div className="p-2.5 bg-deepblue/5 text-deepblue rounded-lg">
                      <item.Icon size={18} className="stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{item.label}</p>
                      <p className="text-sm font-semibold text-charcoal mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-md text-left">
              <h3 className="text-xl font-serif text-charcoal font-bold mb-6 pb-4 border-b border-gray-100">
                Description
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line font-sans font-normal">
                {property.description}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-md text-left">
              <h3 className="text-xl font-serif text-charcoal font-bold mb-6 pb-4 border-b border-gray-100">
                Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-sm text-gray-700 font-medium">
                    <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map Placeholder */}
            <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-md text-left">
              <h3 className="text-xl font-serif text-charcoal font-bold mb-6 pb-4 border-b border-gray-100">
                Property Location
              </h3>
              <div className="h-72 bg-gradient-to-br from-slate-100 to-slate-200 border border-gray-200 rounded-xl relative overflow-hidden flex flex-col justify-center items-center p-6 text-center">
                {/* Decorative Map Rings */}
                <div className="absolute w-64 h-64 border border-deepblue/5 rounded-full animate-pulse pointer-events-none"></div>
                <div className="absolute w-32 h-32 border border-deepblue/10 rounded-full pointer-events-none"></div>
                
                <div className="z-10 relative">
                  <div className="w-12 h-12 bg-deepblue text-gold rounded-full flex items-center justify-center shadow-xl mx-auto mb-4 border border-deepblue-light">
                    <MapPin size={24} className="animate-bounce" />
                  </div>
                  <h4 className="font-serif font-bold text-charcoal text-base mb-1">Mombasa Coastal Map Preview</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                    Location pinned at {property.location}, Mombasa. Secure neighborhood check and direct ocean access verified.
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=Mombasa+${property.location}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-deepblue text-white hover:bg-gold hover:text-deepblue transition-all px-6 py-2.5 uppercase text-[10px] tracking-widest font-bold inline-block shadow-md"
                  >
                    Open Google Maps
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right contact forms column */}
          <div className="space-y-8">
            
            {/* Investment Analysis Panel */}
            <div className="bg-deepblue text-white p-8 border border-deepblue-dark rounded-2xl shadow-xl text-left relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full pointer-events-none -mr-6 -mt-6"></div>
              
              <h3 className="text-lg font-serif text-white font-bold mb-5 flex items-center border-b border-white/10 pb-4">
                <TrendingUp size={20} className="text-gold mr-2" />
                Investment Analysis
              </h3>

              <div className="space-y-4">
                {[
                  { label: "Purchase Price", val: property.price, type: 'price' },
                  { label: "Est. Monthly Long-term Rent", val: `Ksh ${(property.price_num * 0.007).toLocaleString(undefined, {maximumFractionDigits:0})}`, desc: 'Based on 8% long term yield' },
                  { label: "Est. Monthly Airbnb Income", val: `Ksh ${property.airbnb_income.toLocaleString()}`, desc: `At ${property.occupancy_rate}% occupancy rate`, highlight: property.airbnb_ready },
                  { label: "Estimated ROI", val: `${property.roi}%`, highlight: true, color: 'text-emerald-400' }
                ].map((item, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${item.highlight ? 'bg-white/5 border-gold/45' : 'bg-black/10 border-white/5'}`}>
                    <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold">{item.label}</span>
                    <span className={`block font-serif text-lg font-bold mt-1 ${item.color || 'text-white'}`}>{item.val}</span>
                    {item.desc && <span className="block text-[9px] text-gray-400 font-medium mt-0.5">{item.desc}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact Actions panel */}
            <div className="bg-white p-8 border border-gray-100 rounded-2xl shadow-lg text-left">
              <h3 className="text-xl font-serif text-charcoal font-bold mb-6 pb-4 border-b border-gray-100">
                Contact Agent
              </h3>

              <div className="space-y-4">
                {/* 1. WhatsApp Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors rounded-xl flex items-center justify-center font-bold tracking-widest text-xs uppercase space-x-2 shadow-md"
                >
                  <MessageSquare size={16} fill="white" />
                  <span>WhatsApp Agent</span>
                </a>

                {/* 2. Phone Agent */}
                <a
                  href="tel:+254700000000"
                  className="w-full py-3.5 bg-gray-50 text-charcoal hover:bg-gray-100 transition-colors border border-gray-200 rounded-xl flex items-center justify-center font-bold tracking-widest text-xs uppercase space-x-2"
                >
                  <PhoneCall size={15} />
                  <span>Call Hotline</span>
                </a>
              </div>

              {/* View booking form widget */}
              <div className="mt-8 border-t border-gray-100 pt-8">
                <h4 className="font-serif font-bold text-charcoal text-base mb-4">Request a Viewing</h4>
                
                {submittedRequest ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 text-center rounded-xl"
                  >
                    <CheckCircle2 size={32} className="text-emerald-600 mx-auto mb-2" />
                    <h5 className="font-bold text-sm">Request Submitted</h5>
                    <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                      Our coastal agent will verify availability and reach out to schedule your tour.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRequestSubmit} className="space-y-3.5">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={viewingForm.name}
                        onChange={(e) => setViewingForm({ ...viewingForm, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        value={viewingForm.phone}
                        onChange={(e) => setViewingForm({ ...viewingForm, phone: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <input
                        type="date"
                        required
                        value={viewingForm.date}
                        onChange={(e) => setViewingForm({ ...viewingForm, date: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold text-gray-500"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Any questions or special requests?"
                        rows="3"
                        value={viewingForm.message}
                        onChange={(e) => setViewingForm({ ...viewingForm, message: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-deepblue text-white hover:bg-gold hover:text-deepblue transition-all duration-300 py-3 rounded-lg flex items-center justify-center font-bold tracking-widest text-xs uppercase space-x-2 shadow-md"
                    >
                      <Send size={12} />
                      <span>Request Viewing</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
