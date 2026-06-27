import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-gray-300 pt-20 pb-8 border-t border-gray-900">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="flex flex-col space-y-6">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-serif font-bold tracking-wider text-white">
                NAVORA<span className="text-gold">.</span>
              </span>
              <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-gold leading-none -mt-1 font-semibold">
                REALTY
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              To become Kenya's most trusted marketplace for verified coastal properties, beginning with Mombasa. Find. Invest. Stay.
            </p>
            <div className="flex items-center space-x-4">
              {[
                { 
                  name: 'Facebook', 
                  url: '#', 
                  svg: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-5 1.55-5 4.5V8z"/></svg> 
                },
                { 
                  name: 'Instagram', 
                  url: '#', 
                  svg: <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> 
                },
                { 
                  name: 'Linkedin', 
                  url: '#', 
                  svg: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg> 
                },
                { 
                  name: 'Twitter', 
                  url: '#', 
                  svg: <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg> 
                }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6 pb-2 border-b border-gray-800 w-12">
              Explore
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link to="/properties" className="hover:text-gold transition-colors duration-200">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/investment" className="hover:text-gold transition-colors duration-200">
                  Investment Opportunities
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations Col */}
          <div>
            <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6 pb-2 border-b border-gray-800 w-12">
              Locations
            </h4>
            <ul className="space-y-4 text-sm">
              {['Nyali', 'Bamburi', 'Shanzu', 'Mtwapa', 'Kizingo'].map((loc) => (
                <li key={loc}>
                  <Link 
                    to={`/properties?location=${loc}`} 
                    className="hover:text-gold transition-colors duration-200"
                  >
                    Properties in {loc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-6 pb-2 border-b border-gray-800 w-12">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin size={18} className="text-gold flex-shrink-0 mt-0.5" />
                <span>Navora Plaza, Links Road, Nyali, Mombasa, Kenya</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone size={18} className="text-gold flex-shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail size={18} className="text-gold flex-shrink-0" />
                <span>info@navorarealty.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} Navora Realty. All Rights Reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
