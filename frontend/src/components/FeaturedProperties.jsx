import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Fetch mock data from FastAPI backend
    fetch('http://localhost:8000/api/featured')
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(err => console.error("Could not fetch properties", err));
  }, []);

  return (
    <section className="py-24 bg-white" id="properties">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center md:text-left md:flex justify-between items-end mb-16">
          <div>
            <h4 className="text-bronze uppercase tracking-widest text-sm font-medium mb-3">Our Selection</h4>
            <h2 className="text-4xl lg:text-5xl font-serif text-charcoal">Featured Properties</h2>
          </div>
          <button className="hidden md:inline-block border-b-2 border-bronze pb-1 text-charcoal font-medium uppercase tracking-wider hover:text-bronze transition-colors">
            View All Properties
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map((property, idx) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 overflow-hidden mb-6">
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 left-4 bg-charcoal text-white px-3 py-1 uppercase text-xs tracking-wider">
                  For Sale
                </div>
                <div className="absolute bottom-0 left-0 bg-bronze text-white px-6 py-3 font-serif text-xl">
                  {property.price}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-serif text-charcoal group-hover:text-bronze transition-colors mb-2">
                  {property.title}
                </h3>
                <div className="flex items-center text-gray-500 text-sm mb-5">
                  <MapPin size={16} className="text-bronze mr-2" />
                  {property.location}
                </div>

                <div className="flex items-center space-x-6 border-t border-gray-200 pt-4 text-gray-600">
                  <div className="flex items-center">
                    <Bed size={18} className="text-bronze mr-2" />
                    <span>{property.beds} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath size={18} className="text-bronze mr-2" />
                    <span>{property.baths} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <Square size={18} className="text-bronze mr-2" />
                    <span>{property.sqft} Sqft</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
