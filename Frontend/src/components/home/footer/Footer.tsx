import React from 'react';

import { MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white">
<div className="container mx-auto px-6 py-10 max-w-6xl">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          {/* Company Info */}
          <div className="lg:col-span-2">
<h4 className="text-3xl font-light mb-4 tracking-tight">
              Off<span className="font-bold">WeGo</span>
            </h4>
<p className="text-white/60 mb-6">
              Your gateway to extraordinary travel experiences. Discover, explore, 
              and create memories that last a lifetime.
            </p>

      
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-sm font-semibold tracking-wider uppercase text-white/80 mb-8">
              Contact
            </h5>
            <div className="space-y-6 text-white/60 font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <p>123 Travel Street<br />Adventure City, AC 12345</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <p>contact@offwego.com</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-sm font-semibold tracking-wider uppercase text-white/80 mb-8">
              Company
            </h5>
            <div className="space-y-4">
              <a href="#" className="block text-white/60 hover:text-white transition-colors duration-300 font-light">
                About Us
              </a>
              <a href="#" className="block text-white/60 hover:text-white transition-colors duration-300 font-light">
                Careers
              </a>
              <a href="#" className="block text-white/60 hover:text-white transition-colors duration-300 font-light">
                Press
              </a>
              <a href="#" className="block text-white/60 hover:text-white transition-colors duration-300 font-light">
                Blog
              </a>
              <a href="#" className="block text-white/60 hover:text-white transition-colors duration-300 font-light">
                Partners
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h5 className="text-sm font-semibold tracking-wider uppercase text-white/80 mb-8">
              Legal
            </h5>
            <div className="space-y-4">
              <a href="#" className="block text-white/60 hover:text-white transition-colors duration-300 font-light">
                Privacy Policy
              </a>
              <a href="#" className="block text-white/60 hover:text-white transition-colors duration-300 font-light">
                Terms of Service
              </a>
              <a href="#" className="block text-white/60 hover:text-white transition-colors duration-300 font-light">
                Cookie Policy
              </a>
              <a href="#" className="block text-white/60 hover:text-white transition-colors duration-300 font-light">
                Support
              </a>
              <a href="#" className="block text-white/60 hover:text-white transition-colors duration-300 font-light">
                FAQs
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-sm">
          <p>&copy; 2024 OffWeGo. All rights reserved.</p>
          <p className="font-light">Crafted for travelers worldwide</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;