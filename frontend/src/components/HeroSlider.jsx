import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSlider() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/kenya_hero_exterior_1_1776795946715.png)' }}
        />
        <div className="absolute inset-0 bg-charcoal bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h4
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-bronze uppercase tracking-[0.2em] font-medium mb-4"
        >
          Exceptional Living Spaces
        </motion.h4>
        
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-white text-5xl md:text-7xl font-serif mb-8 leading-tight"
        >
          Your Smarter Property Decisions
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <button className="bg-bronze text-white px-8 py-4 uppercase tracking-wider text-sm font-medium hover:bg-white hover:text-charcoal transition-colors duration-300 flex items-center space-x-2">
            <span>Explore Properties</span>
            <ArrowRight size={18} />
          </button>
          <button className="border border-white text-white px-8 py-4 uppercase tracking-wider text-sm font-medium hover:bg-white hover:text-charcoal transition-colors duration-300">
            Contact Agent
          </button>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        <div className="w-12 h-1 bg-bronze cursor-pointer"></div>
        <div className="w-12 h-1 bg-white bg-opacity-50 hover:bg-opacity-100 cursor-pointer transition-all"></div>
        <div className="w-12 h-1 bg-white bg-opacity-50 hover:bg-opacity-100 cursor-pointer transition-all"></div>
      </div>
    </section>
  );
}
