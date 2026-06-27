import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ArrowRight, ShieldCheck, Waves, TrendingUp, Users } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

// Fallback properties for safety in case API fails
const LOCAL_FEATURED_FALLBACK = [
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
    for_rent: true
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
    verified: true,
    airbnb_ready: false,
    for_sale: true,
    for_rent: false
  },
  {
    id: 3,
    title: "Serene Holiday Penthouse",
    price: "Ksh 28,000,000",
    price_num: 28000000,
    location: "Shanzu",
    beds: 2,
    baths: 2,
    sqft: 1600,
    image_url: "/assets/kenya_property_1_1776795961306.png",
    verified: true,
    airbnb_ready: true,
    for_sale: true,
    for_rent: true
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  // Hero images for slider
  const heroImages = [
    '/assets/kenya_hero_exterior_1_1776795946715.png',
    '/assets/kenya_hero_interior_1_1776795994577.png',
    '/assets/hero_exterior_1.png'
  ];

  // Search filter states
  const [searchParams, setSearchParams] = useState({
    purpose: 'sale',
    location: 'All',
    type: 'All',
    beds: 'All',
    priceRange: 'All'
  });

  useEffect(() => {
    // API Fetch
    fetch('http://localhost:8000/api/featured')
      .then(res => res.json())
      .then(data => setFeaturedProperties(data))
      .catch(err => {
        console.warn("FastAPI backend not active. Using frontend fallback.", err);
        setFeaturedProperties(LOCAL_FEATURED_FALLBACK);
      });

    // Auto Slider
    const timer = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.purpose) query.set('purpose', searchParams.purpose);
    if (searchParams.location !== 'All') query.set('location', searchParams.location);
    if (searchParams.type !== 'All') query.set('type', searchParams.type);
    if (searchParams.beds !== 'All') query.set('beds', searchParams.beds);
    
    if (searchParams.priceRange !== 'All') {
      const [min, max] = searchParams.priceRange.split('-');
      if (min) query.set('min_price', min);
      if (max) query.set('max_price', max);
    }
    
    navigate(`/properties?${query.toString()}`);
  };

  return (
    <div className="relative">
      
      {/* 1. Hero Section with Carousel & Modern Filters */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden" aria-label="Featured property hero">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Real <img> tag so Lighthouse/browsers can discover and preload the LCP element */}
              <img
                src={heroImages[heroIndex]}
                alt={heroIndex === 0 ? 'Beachfront property exterior in Mombasa, Kenya' : heroIndex === 1 ? 'Luxury interior of a coastal apartment in Mombasa' : 'Scenic coastal property exterior at Mombasa'}
                width="1920"
                height="1080"
                fetchPriority={heroIndex === 0 ? 'high' : 'auto'}
                loading="eager"
                decoding="auto"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-deepblue/80 via-deepblue/45 to-charcoal/80" aria-hidden="true"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col justify-center items-center h-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block bg-gold/25 backdrop-blur-sm border border-gold/40 text-gold uppercase tracking-[0.25em] text-xs font-bold px-4 py-1.5 rounded-full mb-6"
          >
            Mombasa Coastal Specialist
          </motion.div>
          
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-white text-4xl sm:text-5xl md:text-7xl font-serif mb-6 leading-tight font-medium max-w-4xl"
          >
            Verified Coastal Properties in Mombasa
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-white/90 text-base md:text-xl max-w-2xl mb-12 font-sans font-light leading-relaxed"
          >
            Browse carefully verified apartments, holiday homes, beachfront properties, and investment opportunities across Kenya's coast.
          </motion.p>

          {/* Quick Search Widget */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="w-full max-w-4xl bg-white/95 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-100"
          >
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end text-left text-charcoal" role="search" aria-label="Search coastal properties">
              {/* Filter 1: Purpose */}
              <div>
                <label htmlFor="search-purpose" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Purpose</label>
                <select
                  id="search-purpose"
                  value={searchParams.purpose}
                  onChange={(e) => setSearchParams({ ...searchParams, purpose: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="sale">Buy (Verified)</option>
                  <option value="rent">Rent</option>
                  <option value="airbnb">Airbnb (BNB)</option>
                </select>
              </div>

              {/* Filter 2: Location */}
              <div>
                <label htmlFor="search-location" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Location</label>
                <select
                  id="search-location"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="All">All Locations</option>
                  <option value="Nyali">Nyali</option>
                  <option value="Bamburi">Bamburi</option>
                  <option value="Shanzu">Shanzu</option>
                  <option value="Mtwapa">Mtwapa</option>
                  <option value="Kizingo">Kizingo</option>
                </select>
              </div>

              {/* Filter 3: Property Type */}
              <div>
                <label htmlFor="search-type" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Property Type</label>
                <select
                  id="search-type"
                  value={searchParams.type}
                  onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa / Mansion</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              {/* Filter 4: Bedrooms */}
              <div>
                <label htmlFor="search-beds" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Bedrooms</label>
                <select
                  id="search-beds"
                  value={searchParams.beds}
                  onChange={(e) => setSearchParams({ ...searchParams, beds: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="All">Any Bedrooms</option>
                  <option value="1">1+ Bed</option>
                  <option value="2">2+ Beds</option>
                  <option value="3">3+ Beds</option>
                  <option value="4">4+ Beds</option>
                </select>
              </div>

              {/* Filter 5: Search CTA */}
              <button
                type="submit"
                className="w-full bg-deepblue text-white hover:bg-gold hover:text-deepblue transition-all duration-300 py-3.5 rounded-lg flex items-center justify-center font-bold tracking-widest text-xs uppercase space-x-2"
              >
                <Search size={16} />
                <span>Search</span>
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* 2. Featured Properties Grid */}
      <section className="py-24 bg-white" id="properties">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              {/* Use p not h4 so heading hierarchy is h1 → h2 without skipping levels */}
              <p className="text-gold uppercase tracking-widest text-xs font-bold mb-3">Our Handpicked Selection</p>
              <h2 className="text-3xl md:text-5xl font-serif text-charcoal font-bold">Featured Properties</h2>
            </div>
            <Link
              to="/properties"
              className="group flex items-center text-charcoal font-bold uppercase tracking-wider text-xs border-b-2 border-gold pb-1.5 hover:text-gold transition-colors duration-300"
            >
              <span>Explore All Listings</span>
              <ArrowRight size={14} className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Choose Navora */}
      <section className="py-24 bg-offwhite border-t border-b border-gray-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-3">Core Values</h4>
            <h2 className="text-3xl md:text-4xl font-serif text-charcoal font-bold">Why Choose Navora</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                Icon: ShieldCheck,
                title: "Verified Listings",
                description: "Every property is reviewed and physically authenticated before publication. Zero unverified spam."
              },
              {
                Icon: Waves,
                title: "Coastal Specialists",
                description: "Deep roots and focused experience in high-quality beachfront opportunities in Mombasa and the Coast."
              },
              {
                Icon: TrendingUp,
                title: "Investment Focus",
                description: "Helping buyers identify prime properties with strong capital appreciation and high Airbnb rental yield."
              },
              {
                Icon: Users,
                title: "Personalized Support",
                description: "Direct connection to real, responsive local advisors assisting you through the purchase and legal process."
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-white p-8 border border-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-left"
              >
                <div className="w-12 h-12 bg-deepblue/5 flex items-center justify-center rounded-xl text-deepblue mb-6">
                  <card.Icon size={24} className="stroke-[2]" />
                </div>
                <h3 className="text-lg font-serif text-charcoal font-bold mb-3">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Browse by Location */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-3">Coastal Neighborhoods</h4>
            <h2 className="text-3xl md:text-4xl font-serif text-charcoal font-bold">Browse by Location</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: 'Nyali', count: 12, img: '/assets/property_1.png' },
              { name: 'Bamburi', count: 8, img: '/assets/kenya_hero_exterior_1_1776795946715.png' },
              { name: 'Shanzu', count: 15, img: '/assets/kenya_property_1_1776795961306.png' },
              { name: 'Mtwapa', count: 6, img: '/assets/kenya_property_2_1776795980612.png' },
              { name: 'Kizingo', count: 5, img: '/assets/property_2.png' }
            ].map((loc, idx) => (
              <Link
                key={idx}
                to={`/properties?location=${loc.name}`}
                className="group relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={loc.img}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deepblue/90 via-deepblue/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-serif font-bold group-hover:text-gold transition-colors duration-300">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">{loc.count} listings available</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Investment Opportunities Highlight */}
      <section className="py-24 bg-deepblue text-white relative overflow-hidden">
        {/* Decorative Wave Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,202.7C96,213,192,235,288,218.7C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-3">Maximize Returns</h4>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">Investment-Focused Properties</h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Maximize rental yields with our vetted, Airbnb-ready coastal suites. Built in prime tourist hubs, these offerings yield premium year-round occupancy.
              </p>
            </div>
            <Link
              to="/investment"
              className="bg-gold text-deepblue hover:bg-white hover:text-deepblue transition-all duration-300 px-8 py-3.5 uppercase text-xs tracking-widest font-bold shadow-lg"
            >
              View Investment Analysis
            </Link>
          </div>

          {/* Featured Investment Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Shanzu Shores Suite",
                price: "Ksh 16,500,000",
                yield: "11.2%",
                airbnb: "Ksh 175,000",
                roi: "14.2%",
                img: "/assets/hero_interior_1.png"
              },
              {
                title: "Serene Holiday Penthouse",
                price: "Ksh 28,000,000",
                yield: "10.5%",
                airbnb: "Ksh 280,000",
                roi: "13.5%",
                img: "/assets/kenya_property_1_1776795961306.png"
              },
              {
                title: "Oceanview Vista Apartment",
                price: "Ksh 18,500,000",
                yield: "9.8%",
                airbnb: "Ksh 220,000",
                roi: "12.1%",
                img: "/assets/property_1.png"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-deepblue-light/50 border border-deepblue-light/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
                <div className="relative h-56 overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center shadow-md">
                    Navora Verified
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gold text-lg font-serif font-semibold mb-4">{item.price}</p>
                  
                  {/* Yield Breakdown */}
                  <div className="grid grid-cols-3 gap-2 bg-deepblue-dark/50 p-4 border border-deepblue-light/20 text-center rounded-xl mb-4 text-xs font-semibold">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">Rental Yield</span>
                      <span className="text-white text-sm">{item.yield}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">Airbnb Income</span>
                      <span className="text-gold text-sm font-serif">{item.airbnb.split(" ")[1]}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-gray-400 mb-1">Est. ROI</span>
                      <span className="text-emerald-400 text-sm">{item.roi}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-3">Client Reviews</h4>
            <h2 className="text-3xl md:text-4xl font-serif text-charcoal font-bold">Testimonials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Purchasing my holiday home in Nyali through Navora Realty was incredibly seamless. The property verification details they shared gave me 100% peace of mind, especially being based in the UK.",
                author: "David Kamau",
                role: "Holiday Home Owner"
              },
              {
                quote: "Navora's focus on high-yield properties in Mombasa is unmatched. They helped me identify an Airbnb penthouse in Shanzu that now operates at an average of 82% occupancy. True investment partners.",
                author: "Sarah Njeri",
                role: "Real Estate Investor"
              },
              {
                quote: "The team is knowledgeable, highly professional, and extremely honest about market metrics. The WhatsApp support let me coordinate views and receive copies of titles instantly. Strongly recommend.",
                author: "Amit Patel",
                role: "Beachfront Villa Buyer"
              }
            ].map((test, idx) => (
              <div key={idx} className="bg-offwhite p-8 border border-gray-100 rounded-2xl flex flex-col justify-between text-left">
                <p className="text-gray-600 text-sm leading-relaxed italic mb-8">
                  "{test.quote}"
                </p>
                <div>
                  <h4 className="font-serif text-charcoal font-bold text-base">{test.author}</h4>
                  <p className="text-gold text-xs font-bold uppercase tracking-wider mt-1">{test.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action (CTA) */}
      <section className="py-24 bg-charcoal text-white relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 max-w-2xl leading-tight">
            Ready to Find Your Next Coastal Investment?
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mb-12">
            Get in touch with our coastal property specialists to explore unlisted inventory, book private tours, or analyze specific project yields.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 w-full justify-center">
            <Link
              to="/properties"
              className="bg-gold text-deepblue hover:bg-white hover:text-deepblue transition-all duration-300 px-8 py-4 uppercase text-xs tracking-widest font-bold shadow-lg"
            >
              Browse Properties
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white hover:bg-white hover:text-charcoal transition-all duration-300 px-8 py-4 uppercase text-xs tracking-widest font-bold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
