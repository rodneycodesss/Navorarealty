import { motion } from 'framer-motion';
import { ShieldCheck, Anchor, Award, ZoomIn, Eye, Sparkles } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="bg-offwhite min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="relative py-24 bg-deepblue text-white overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/assets/kenya_hero_exterior_1_1776795946715.png')" }}></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-3xl">
          <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-3">Get to Know Us</h4>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">About Navora Realty</h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Find. Invest. Stay. Establishing the gold standard in coastal property validation.
          </p>
        </div>
      </section>

      {/* 2. Our Story Section */}
      <section className="py-24 bg-white text-left">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Image layout */}
            <div className="w-full lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-11/12 rounded-2xl overflow-hidden shadow-2xl"
              >
                <img src="/assets/kenya_hero_interior_1_1776795994577.png" alt="Mombasa Coastal Office Interior" className="w-full h-[450px] object-cover" />
              </motion.div>
              {/* Overlay card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="absolute bottom-6 right-0 bg-gold text-deepblue p-8 shadow-2xl rounded-2xl w-60 border border-gold-light/20"
              >
                <h4 className="text-4xl font-serif font-bold mb-1">100%</h4>
                <p className="tracking-widest uppercase text-[10px] font-bold">Verified Coastal Portfolio</p>
              </motion.div>
            </div>

            {/* Story Text */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-2">Our Origins</h4>
              <h2 className="text-3xl md:text-4xl font-serif text-charcoal font-bold leading-tight">
                To become Kenya's most trusted marketplace for verified coastal properties.
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed font-sans font-normal">
                Navora Realty was founded in Mombasa, Kenya, to solve the single largest bottleneck in the coastal real estate market: **trust and verification**. For too long, local and international buyers have struggled with ambiguous land titles, inflated yields, and unverified mock listings.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed font-sans font-normal">
                We began at the Coast—anchoring our presence in Mombasa’s prime hubs including Nyali, Bamburi, Shanzu, Mtwapa, and Kizingo. By dedicating ourselves strictly to properties that undergo our intensive physical and title deed audit, we ensure that every single listing is ready for secure transactions and high occupancy yields.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed font-sans font-normal">
                While we begin with beachfront villas and premium Airbnb suites, Navora Realty is built for future expansion across Kenya, holding transparency, safety, and investment-readiness as our absolute compass.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Mission, Vision, and Values cards */}
      <section className="py-24 bg-offwhite border-t border-b border-gray-100 text-left">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Mission */}
            <div className="bg-white p-8 md:p-10 border border-gray-100 rounded-2xl shadow-md">
              <div className="w-10 h-10 bg-deepblue/5 text-deepblue rounded-xl flex items-center justify-center mb-6">
                <Anchor size={20} className="stroke-[2]" />
              </div>
              <h3 className="text-xl font-serif text-charcoal font-bold mb-3">Our Mission</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                To simplify coastal real estate investing by establishing a strictly authenticated marketplace where buyers find secure titles and high-yielding, premium Airbnb properties with zero hassle.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 md:p-10 border border-gray-100 rounded-2xl shadow-md">
              <div className="w-10 h-10 bg-deepblue/5 text-deepblue rounded-xl flex items-center justify-center mb-6">
                <Eye size={20} className="stroke-[2]" />
              </div>
              <h3 className="text-xl font-serif text-charcoal font-bold mb-3">Our Vision</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                To lead the Kenyan real estate ecosystem as the premier, trusted brand for premium properties, expanding from Mombasa coastally and inland, defining trust-centered PropTech.
              </p>
            </div>

          </div>

          {/* Core Values */}
          <div>
            <h3 className="text-2xl font-serif text-charcoal font-bold text-center mb-12">Our Core Values</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Absolute Trust", desc: "No listing goes online without legal title review and coordinate checks. Trust is our product." },
                { title: "High Transparency", desc: "We publish real yields, historical occupancy rates, and actual photos. No false promises." },
                { title: "Coastal Specialization", desc: "Deep local knowledge allows us to secure prime beachfront spots before anyone else." },
                { title: "Investment-Centricity", desc: "Every property is analyzed to ensure it generates consistent cashflow and solid ROIs." }
              ].map((val, idx) => (
                <div key={idx} className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
                  <div className="w-5 h-5 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-4">
                    <Sparkles size={12} className="stroke-[2.5]" />
                  </div>
                  <h4 className="font-serif font-bold text-charcoal text-base mb-2">{val.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
