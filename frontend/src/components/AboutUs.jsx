import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function AboutUs() {
  return (
    <section className="py-24 bg-offwhite" id="about">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center">
        
        {/* Image Grid */}
        <div className="w-full lg:w-1/2 mb-16 lg:mb-0 relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-4/5 z-10 relative"
          >
            <img src="/assets/kenya_hero_interior_1_1776795994577.png" alt="Luxury Interior" className="w-full h-[500px] object-cover shadow-2xl" />
          </motion.div>
          
          {/* Overlay Box */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute bottom-10 -right-4 lg:-right-10 bg-bronze text-white p-10 shadow-xl z-20 w-64"
          >
            <h3 className="text-5xl font-serif mb-2">15+</h3>
            <p className="tracking-widest uppercase text-xs">Years of Excellence in Real Estate</p>
          </motion.div>
        </div>

        {/* Text Area */}
        <div className="w-full lg:w-1/2 lg:pl-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h4 className="text-bronze uppercase tracking-widest text-sm font-medium mb-3">About RealRodstar</h4>
            <h2 className="text-4xl lg:text-5xl font-serif text-charcoal mb-8 leading-tight">
              We Help You Find the Perfect Property
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              With over 15 years of experience in the luxury real estate market, our expert team is dedicated to providing personalized service to help you navigate your property journey.
            </p>
            <p className="text-gray-600 mb-10 leading-relaxed">
              Whether you are looking for a modern downtown apartment or a serene suburban home, we ensure a seamless and transparent process from start to finish.
            </p>

            <div className="flex items-center space-x-6">
              <button className="bg-charcoal text-white px-8 py-4 uppercase tracking-wider text-sm font-medium hover:bg-bronze transition-colors flex items-center">
                Read More
              </button>
              
              <button className="flex items-center space-x-3 text-charcoal hover:text-bronze transition-colors group">
                <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-bronze transition-colors">
                  <Play size={18} className="text-bronze ml-1" />
                </div>
                <span className="uppercase text-sm font-medium tracking-wide">Watch Video</span>
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
