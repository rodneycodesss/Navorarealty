import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PropertyCard({ property }) {
  const {
    id,
    title,
    price,
    location,
    beds,
    baths,
    sqft,
    image_url,
    verified,
    airbnb_ready
  } = property;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col h-full group"
    >
      {/* Property Image Container */}
      <div className="relative h-64 md:h-72 overflow-hidden flex-shrink-0">
        <img
          src={image_url}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Overlays */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
          {verified && (
            <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center shadow-md">
              <ShieldCheck size={12} className="mr-1 fill-white/10" />
              Navora Verified
            </span>
          )}
          {airbnb_ready && (
            <span className="bg-deepblue/95 backdrop-blur-sm text-gold text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full flex items-center shadow-md">
              <CheckCircle2 size={12} className="mr-1 fill-gold/10" />
              Airbnb Ready
            </span>
          )}
        </div>

        {/* Pricing Overlay */}
        <div className="absolute bottom-4 left-4 bg-deepblue/90 backdrop-blur-sm text-white px-5 py-2.5 font-serif text-lg font-bold shadow-lg border-l-4 border-gold">
          {price}
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2.5">
            <MapPin size={14} className="text-gold mr-1.5 flex-shrink-0" />
            <span>{location}, Mombasa</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-serif text-charcoal font-bold mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-1">
            {title}
          </h3>
        </div>

        <div>
          {/* Features specs */}
          <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-4 mb-5 text-gray-600 text-xs font-semibold">
            <div className="flex items-center justify-center space-x-1.5 border-r border-gray-100">
              <Bed size={15} className="text-gold" />
              <span>{beds} Bed{beds > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 border-r border-gray-100">
              <Bath size={15} className="text-gold" />
              <span>{baths} Bath{baths > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5">
              <Square size={14} className="text-gold" />
              <span>{sqft} Sqft</span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to={`/property/${id}`}
            className="w-full text-center block bg-deepblue text-white group-hover:bg-gold group-hover:text-deepblue transition-all duration-300 py-3 uppercase text-xs tracking-widest font-bold shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
