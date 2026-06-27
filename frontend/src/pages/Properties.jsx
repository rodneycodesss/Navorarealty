import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Info, RefreshCw } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

// Comprehensive local fallback database
const LOCAL_PROPERTIES_DB = [
  {
    id: 1,
    title: "Oceanview Vista Apartment",
    price: "Ksh 18,500,000",
    price_num: 18500000,
    location: "Nyali",
    beds: 3,
    baths: 3,
    sqft: 2200,
    type: "Apartment",
    image_url: "/assets/property_1.png",
    verified: true,
    airbnb_ready: true,
    for_sale: true,
    for_rent: true,
    description: "Experience coastal luxury living at its finest. This stunning 3-bedroom oceanfront apartment in Nyali offers breathtaking views of the Indian Ocean."
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
    type: "Villa",
    image_url: "/assets/kenya_hero_exterior_1_1776795946715.png",
    verified: true,
    airbnb_ready: false,
    for_sale: true,
    for_rent: false,
    description: "Direct private beach access and exquisite architecture make this 4-bedroom villa in Bamburi a rare coastal gem."
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
    type: "Penthouse",
    image_url: "/assets/kenya_property_1_1776795961306.png",
    verified: true,
    airbnb_ready: true,
    for_sale: true,
    for_rent: true,
    description: "Located in the heart of Shanzu, this modern 2-bedroom penthouse is custom-designed for premium holiday rentals and high Airbnb yield."
  },
  {
    id: 4,
    title: "Mtwapa Marina Residency",
    price: "Ksh 12,000,000",
    price_num: 12000000,
    location: "Mtwapa",
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: "Apartment",
    image_url: "/assets/kenya_property_2_1776795980612.png",
    verified: false,
    airbnb_ready: true,
    for_sale: false,
    for_rent: true,
    description: "This elegant 2-bedroom apartment overlooks the Mtwapa Creek, offering a calm and serene waterfront environment."
  },
  {
    id: 5,
    title: "Kizingo Executive Haven",
    price: "Ksh 32,500,000",
    price_num: 32500000,
    location: "Kizingo",
    beds: 3,
    baths: 3,
    sqft: 2800,
    type: "Apartment",
    image_url: "/assets/property_2.png",
    verified: true,
    airbnb_ready: false,
    for_sale: true,
    for_rent: true,
    description: "Nestled in the prestigious Kizingo area, this executive 3-bedroom apartment offers urban sophistication combined with partial sea views."
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
    type: "Apartment",
    image_url: "/assets/hero_interior_1.png",
    verified: true,
    airbnb_ready: true,
    for_sale: true,
    for_rent: false,
    description: "A premium 1-bedroom beachfront apartment designed specifically to maximize high rental yields and Airbnb guest satisfaction."
  }
];

export default function Properties() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL query parameters
  const getQueryParams = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      location: searchParams.get('location') || 'All',
      type: searchParams.get('type') || 'All',
      beds: searchParams.get('beds') || 'All',
      baths: searchParams.get('baths') || 'All',
      min_price: searchParams.get('min_price') || 'All',
      max_price: searchParams.get('max_price') || 'All',
      verified_only: searchParams.get('verified_only') === 'true',
      airbnb_ready: searchParams.get('airbnb_ready') === 'true',
      purpose: searchParams.get('purpose') || 'All',
    };
  }, [location.search]);

  const [filters, setFilters] = useState(getQueryParams());
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Sync state with URL params on navigation
  useEffect(() => {
    setFilters(getQueryParams());
  }, [location.search, getQueryParams]);

  // Fetch properties matching filters
  const fetchFilteredProperties = useCallback(() => {
    setLoading(true);
    
    // Construct query parameters
    const query = new URLSearchParams();
    if (filters.location !== 'All') query.set('location', filters.location);
    if (filters.type !== 'All') query.set('type', filters.type);
    if (filters.beds !== 'All') query.set('beds', filters.beds);
    if (filters.baths !== 'All') query.set('baths', filters.baths);
    if (filters.min_price !== 'All') query.set('min_price', filters.min_price);
    if (filters.max_price !== 'All') query.set('max_price', filters.max_price);
    if (filters.verified_only) query.set('verified_only', 'true');
    if (filters.airbnb_ready) query.set('airbnb_ready', 'true');
    if (filters.purpose !== 'All') query.set('purpose', filters.purpose);

    const apiUrl = `http://localhost:8000/api/properties?${query.toString()}`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        setProperties(data);
        setUsingFallback(false);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to client-side filtering
        let filtered = [...LOCAL_PROPERTIES_DB];

        if (filters.purpose !== 'All') {
          if (filters.purpose === 'sale') {
            filtered = filtered.filter(p => p.for_sale);
          } else if (filters.purpose === 'rent') {
            filtered = filtered.filter(p => p.for_rent);
          } else if (filters.purpose === 'airbnb') {
            // properties for sale and rent can also be secured for BNBs,
            // so we filter by airbnb_ready check!
            filtered = filtered.filter(p => p.airbnb_ready);
          }
        }
        if (filters.location !== 'All') {
          filtered = filtered.filter(p => p.location.toLowerCase() === filters.location.toLowerCase());
        }
        if (filters.type !== 'All') {
          filtered = filtered.filter(p => p.type.toLowerCase() === filters.type.toLowerCase());
        }
        if (filters.beds !== 'All') {
          filtered = filtered.filter(p => p.beds >= parseInt(filters.beds));
        }
        if (filters.baths !== 'All') {
          filtered = filtered.filter(p => p.baths >= parseFloat(filters.baths));
        }
        if (filters.min_price !== 'All') {
          filtered = filtered.filter(p => p.price_num >= parseInt(filters.min_price));
        }
        if (filters.max_price !== 'All') {
          filtered = filtered.filter(p => p.price_num <= parseInt(filters.max_price));
        }
        if (filters.verified_only) {
          filtered = filtered.filter(p => p.verified);
        }
        if (filters.airbnb_ready) {
          filtered = filtered.filter(p => p.airbnb_ready);
        }

        setProperties(filtered);
        setUsingFallback(true);
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    fetchFilteredProperties();
  }, [fetchFilteredProperties]);

  const handleFilterChange = (key, value) => {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);

    // Push new params to URL to preserve state in history
    const query = new URLSearchParams();
    Object.entries(nextFilters).forEach(([k, v]) => {
      if (k === 'verified_only' || k === 'airbnb_ready') {
        if (v) query.set(k, 'true');
      } else if (v !== 'All') {
        query.set(k, v.toString());
      }
    });
    navigate(`/properties?${query.toString()}`, { replace: true });
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      location: 'All',
      type: 'All',
      beds: 'All',
      baths: 'All',
      min_price: 'All',
      max_price: 'All',
      verified_only: false,
      airbnb_ready: false,
      purpose: 'All',
    };
    setFilters(defaultFilters);
    navigate('/properties', { replace: true });
  };

  return (
    <div className="bg-offwhite min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Page Title */}
        <div className="mb-10 text-left">
          <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-2">Coastal Collection</h4>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal">Available Properties</h1>
          
          {usingFallback && (
            <div className="mt-3 inline-flex items-center text-xs bg-gold/15 text-gold-dark border border-gold/20 px-3 py-1 rounded-full font-medium">
              <Info size={12} className="mr-1.5" />
              Showing local verified inventory (offline mode)
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* 1. Sidebar Filters */}
          <aside className="w-full lg:w-80 bg-white p-8 border border-gray-100 rounded-2xl shadow-lg flex-shrink-0 self-start">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <span className="flex items-center text-charcoal font-serif font-bold text-lg">
                <SlidersHorizontal size={18} className="text-gold mr-2.5" />
                Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-gold hover:text-deepblue font-semibold uppercase tracking-wider transition-colors"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-6 text-left">
              {/* Purpose */}
              <div>
                <label htmlFor="filter-purpose" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Purpose</label>
                <select
                  id="filter-purpose"
                  value={filters.purpose}
                  onChange={(e) => handleFilterChange('purpose', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold font-sans"
                >
                  <option value="All">All Purposes</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="airbnb">Airbnb (BNB)</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="filter-location" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Location</label>
                <select
                  id="filter-location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold font-sans"
                >
                  <option value="All">All Locations</option>
                  <option value="Nyali">Nyali</option>
                  <option value="Bamburi">Bamburi</option>
                  <option value="Shanzu">Shanzu</option>
                  <option value="Mtwapa">Mtwapa</option>
                  <option value="Kizingo">Kizingo</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label htmlFor="filter-type" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Property Type</label>
                <select
                  id="filter-type"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold font-sans"
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label htmlFor="filter-maxprice" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Price Limit</label>
                <select
                  id="filter-maxprice"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold font-sans"
                >
                  <option value="All">No Max Price</option>
                  <option value="15000000">Ksh 15 Million</option>
                  <option value="20000000">Ksh 20 Million</option>
                  <option value="30000000">Ksh 30 Million</option>
                  <option value="40000000">Ksh 40 Million</option>
                  <option value="50000000">Ksh 50 Million</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Bedrooms</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {['All', '1', '2', '3', '4'].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleFilterChange('beds', val)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        filters.beds === val
                          ? 'bg-deepblue text-white shadow-md'
                          : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {val === 'All' ? 'Any' : `${val}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Bathrooms</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['All', '1', '2', '3'].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleFilterChange('baths', val)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        filters.baths === val
                          ? 'bg-deepblue text-white shadow-md'
                          : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {val === 'All' ? 'Any' : `${val}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes: Verified / Airbnb */}
              <div className="space-y-4 pt-4 border-t border-gray-100 text-sm font-semibold">
                <label className="flex items-center space-x-3 cursor-pointer text-charcoal">
                  <input
                    type="checkbox"
                    checked={filters.verified_only}
                    onChange={(e) => handleFilterChange('verified_only', e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-gray-300 text-deepblue focus:ring-gold focus:ring-1"
                  />
                  <span>Navora Verified Only</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer text-charcoal">
                  <input
                    type="checkbox"
                    checked={filters.airbnb_ready}
                    onChange={(e) => handleFilterChange('airbnb_ready', e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-gray-300 text-deepblue focus:ring-gold focus:ring-1"
                  />
                  <span>Airbnb Ready Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* 2. Grid Listings Column */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <RefreshCw className="animate-spin text-gold" size={40} />
                <span className="text-gray-500 font-medium">Fetching coastal catalog...</span>
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-md">
                <SlidersHorizontal size={48} className="text-gold mx-auto mb-6 opacity-40" />
                <h3 className="text-2xl font-serif text-charcoal font-bold mb-3">No Properties Match</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                  We couldn't find any listings matching your specific combination of filters. Try broadening your location, beds, or price range.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-deepblue text-white hover:bg-gold hover:text-deepblue transition-all px-8 py-3.5 uppercase text-xs tracking-widest font-bold shadow-md"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div>
                <p className="text-left text-xs text-gray-500 font-bold uppercase tracking-wider mb-6">
                  Showing {properties.length} match{properties.length > 1 ? 'es' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
