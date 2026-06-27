import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Compass, Calculator, Calendar, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

const LOCAL_INVESTMENTS_DB = [
  {
    id: 6,
    title: "Shanzu Shores Suite",
    category: "Beachfront Development",
    price: "Ksh 16,500,000",
    price_num: 16500000,
    location: "Shanzu",
    yield: "11.2%",
    airbnb: "Ksh 175,000",
    occupancy: "85%",
    roi: "14.2%",
    attractions: "Shanzu Beach, Serena Beach Club, Bamburi Forest, Waterfront Bars",
    summary: "Specifically designed to maximize premium holiday booking volume. Features a custom keyless entry system, high-end beachfront amenities, and a fully hands-off on-site property management team that handles bookings, cleanings, and guest logistics.",
    img: "/assets/hero_interior_1.png"
  },
  {
    id: 3,
    title: "Serene Holiday Penthouse",
    category: "Holiday Home Investment",
    price: "Ksh 28,000,000",
    price_num: 28000000,
    location: "Shanzu",
    yield: "10.5%",
    airbnb: "Ksh 280,000",
    occupancy: "82%",
    roi: "13.5%",
    attractions: "Shanzu Shores, Haller Park, Mtwapa Creek Boat Cruises, City Mall Nyali",
    summary: "An expansive 2-bedroom penthouse featuring a panoramic private rooftop terrace that is extremely attractive to families and high-net-worth holiday vacationers. Proven occupancy rates during coastal holidays and weekends.",
    img: "/assets/kenya_property_1_1776795961306.png"
  },
  {
    id: 1,
    title: "Oceanview Vista Apartment",
    category: "High ROI Residence",
    price: "Ksh 18,500,000",
    price_num: 18500000,
    location: "Nyali",
    yield: "9.8%",
    airbnb: "Ksh 220,000",
    occupancy: "78%",
    roi: "12.1%",
    attractions: "Nyali Golf Club, Nyali Beach, Wild Waters Theme Park, Nyali Cinema Center",
    summary: "Combines the safety of long-term tenancy demand with high Airbnb flexibility. Strategic 3-bedroom layout that caters to corporate executives and wealthy families visiting the Mombasa coastline.",
    img: "/assets/property_1.png"
  },
  {
    id: 4,
    title: "Mtwapa Creek Marina Residency",
    category: "Waterfront Investment",
    price: "Ksh 12,000,000",
    price_num: 12000000,
    location: "Mtwapa",
    yield: "8.8%",
    airbnb: "Ksh 130,000",
    occupancy: "70%",
    roi: "9.8%",
    attractions: "Mtwapa Creek Marina, Moorings Floating Restaurant, Beach Clubs, Local Markets",
    summary: "Affordable entry-level holiday home investment focusing on water sport tourism. It offers scenic creek views and boat access, driving constant interest from local weekenders.",
    img: "/assets/kenya_property_2_1776795980612.png"
  }
];

export default function InvestmentOpportunities() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Simple Interactive Calculator state
  const [calcInputs, setCalcInputs] = useState({ purchasePrice: 18500000, dailyRate: 12000, occupancyRate: 75 });
  const [calcResults, setCalcResults] = useState({ annualRevenue: 0, estYield: 0 });

  useEffect(() => {
    fetch('http://localhost:8000/api/investment')
      .then(res => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then(data => {
        setInvestments(data.length > 0 ? data : LOCAL_INVESTMENTS_DB);
        setUsingFallback(data.length === 0);
        setLoading(false);
      })
      .catch(() => {
        setInvestments(LOCAL_INVESTMENTS_DB);
        setUsingFallback(true);
        setLoading(false);
      });
  }, []);

  // Update calculator results when inputs change
  useEffect(() => {
    const annualRevenue = calcInputs.dailyRate * (calcInputs.occupancyRate / 100) * 365;
    const estYield = (annualRevenue / calcInputs.purchasePrice) * 100;
    setCalcResults({
      annualRevenue,
      estYield: estYield.toFixed(2)
    });
  }, [calcInputs]);

  return (
    <div className="bg-offwhite min-h-screen py-16">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Intro Section */}
        <div className="max-w-3xl text-left mb-16">
          <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-3">Wealth Generation</h4>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal mb-5">
            Coastal Real Estate Investment Portal
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            The Kenyan Coast, beginning with Mombasa, is experiencing historic tourism and infrastructure growth. Discover curated real estate listings optimized for capital appreciation, Airbnb guest occupancy, and verified rental returns.
          </p>
          
          {usingFallback && (
            <div className="mt-4 inline-flex items-center text-xs bg-gold/15 text-gold-dark border border-gold/20 px-3 py-1.5 rounded-full font-medium">
              <Info size={12} className="mr-1.5" />
              Showing local verified investment opportunities (offline mode)
            </div>
          )}
        </div>

        {/* ROI Investment List */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 rounded-full border-4 border-gold border-t-transparent animate-spin mx-auto mb-4"></div>
            <span className="text-gray-500 font-medium text-sm">Analyzing market yields...</span>
          </div>
        ) : (
          <div className="space-y-12 mb-20">
            {investments.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Image block */}
                <div className="lg:col-span-5 relative h-72 lg:h-auto overflow-hidden">
                  <img
                    src={item.image_url || item.img}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-deepblue text-gold text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center shadow-md border border-deepblue-light/50">
                    <Award size={11} className="mr-1.5" />
                    {item.category || "High ROI Apartment"}
                  </div>
                  {item.verified && (
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center shadow-md">
                      <ShieldCheck size={11} className="mr-1.5" />
                      Navora Verified
                    </div>
                  )}
                </div>

                {/* Details Column */}
                <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-between text-left">
                  <div>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                      <div>
                        <h2 className="text-2xl font-serif font-bold text-charcoal mb-1">
                          {item.title}
                        </h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                          Location: {item.location}, Mombasa Coast
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400 block font-bold uppercase tracking-wider">Asking Price</span>
                        <span className="text-2xl font-serif font-bold text-deepblue leading-none">{item.price}</span>
                      </div>
                    </div>

                    {/* Investment metrics strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-offwhite p-4 border border-gray-100 rounded-xl mb-6 text-center">
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-1">Est. Rental Yield</span>
                        <span className="text-charcoal font-serif font-bold text-base">{item.rental_yield ? `${item.rental_yield}%` : item.yield}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-1">Airbnb Income / Mo</span>
                        <span className="text-gold font-serif font-bold text-base">{item.airbnb_income ? `Ksh ${item.airbnb_income.toLocaleString()}` : item.airbnb}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-1">Est. Occupancy</span>
                        <span className="text-charcoal font-serif font-bold text-base">{item.occupancy_rate ? `${item.occupancy_rate}%` : item.occupancy}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-1">Estimated ROI</span>
                        <span className="text-emerald-600 font-serif font-bold text-base">{item.roi}%</span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 font-sans">
                      {item.description || item.summary}
                    </p>

                    {/* Attractions info */}
                    <div className="flex items-start space-x-2 text-xs font-semibold text-charcoal mb-8">
                      <Compass size={16} className="text-gold mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="text-gray-400 uppercase tracking-widest text-[9px] mr-1.5">Nearby Attractions:</span>
                        {item.attractions || "Coastal resorts, beachfront access, shopping facilities."}
                      </span>
                    </div>
                  </div>

                  {/* Actions button */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <Link
                      to={`/property/${item.id}`}
                      className="bg-deepblue text-white hover:bg-gold hover:text-deepblue transition-all duration-300 px-6 py-3 uppercase text-[10px] tracking-widest font-bold text-center flex-grow sm:flex-grow-0"
                    >
                      Analyze Opportunity
                    </Link>
                    <Link
                      to="/contact"
                      className="border border-gray-200 text-charcoal hover:bg-gray-50 transition-all duration-300 px-6 py-3 uppercase text-[10px] tracking-widest font-bold text-center"
                    >
                      Talk to Portfolio Manager
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Interactive Investment Yield Calculator */}
        <section className="bg-deepblue text-white p-8 md:p-12 border border-deepblue-dark rounded-2xl shadow-xl mb-16 text-left relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full pointer-events-none -mr-16 -mb-16"></div>
          
          <div className="max-w-xl mb-10 relative z-10">
            <h3 className="text-2xl md:text-3xl font-serif text-white font-bold mb-3 flex items-center">
              <Calculator className="text-gold mr-3" />
              Yield Estimator
            </h3>
            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              Input hypothetical occupancy values to estimate gross annual revenues and corresponding yields relative to purchase values.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Calculator inputs form */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Purchase Price (Ksh)</label>
                <input
                  type="number"
                  value={calcInputs.purchasePrice}
                  onChange={(e) => setCalcInputs({ ...calcInputs, purchasePrice: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-deepblue-light/50 border border-deepblue-light rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Daily Airbnb Rate (Ksh)</label>
                <input
                  type="number"
                  value={calcInputs.dailyRate}
                  onChange={(e) => setCalcInputs({ ...calcInputs, dailyRate: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-deepblue-light/50 border border-deepblue-light rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Est. Occupancy Rate (%)</label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={calcInputs.occupancyRate}
                  onChange={(e) => setCalcInputs({ ...calcInputs, occupancyRate: parseInt(e.target.value) || 30 })}
                  className="w-full accent-gold mt-2 cursor-pointer"
                />
                <span className="block text-right text-xs text-gold font-bold mt-1.5">{calcInputs.occupancyRate}% Occupied</span>
              </div>
            </div>

            {/* Calculations results block */}
            <div className="lg:col-span-5 bg-deepblue-dark/60 border border-deepblue-light/40 p-6 rounded-xl grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-1">Gross Annual Income</span>
                <span className="text-xl md:text-2xl font-serif font-bold text-white leading-none">
                  Ksh {calcResults.annualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-gray-400 font-bold mb-1">Est. Gross Yield</span>
                <span className="text-xl md:text-2xl font-serif font-bold text-emerald-400 leading-none">
                  {calcResults.estYield}%
                </span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
