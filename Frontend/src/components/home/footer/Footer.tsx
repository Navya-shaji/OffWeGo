import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-10 px-6 border-t border-white/10 mt-auto">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src="/images/logo_white_circle.png"
              alt="OffWeGo Logo"
              className="h-20 w-auto object-contain mb-4 transform -translate-x-2"
            />
            <p className="text-white/40 text-xs font-light tracking-widest uppercase">
              OffWeGo Travel
            </p>
          </div>

          {/* Reach Us */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold mb-4 text-white uppercase tracking-[0.2em]">Reach us</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="w-3.5 h-3.5 text-white/60" />
                <span className="text-white/50 text-[13px] font-light">+1 (617) 555-0198</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <Mail className="w-3.5 h-3.5 text-white/60" />
                <span className="text-white/50 text-[13px] font-light">support@offwego.com</span>
              </div>
              <div className="flex items-start justify-center md:justify-start gap-3">
                <MapPin className="w-3.5 h-3.5 text-white/60 mt-0.5" />
                <span className="text-white/50 text-[13px] font-light leading-relaxed">
                  132 Dartmouth St, Boston, MA
                </span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold mb-4 text-white uppercase tracking-[0.2em]">Company</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-white/50 hover:text-white transition-colors text-[13px] font-light">About Us</a></li>
              <li><a href="/contact" className="text-white/50 hover:text-white transition-colors text-[13px] font-light">Contact Us</a></li>
              <li><a href="/blog" className="text-white/50 hover:text-white transition-colors text-[13px] font-light">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold mb-4 text-white uppercase tracking-[0.2em]">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-white/50 hover:text-white transition-colors text-[13px] font-light">Privacy Policy</a></li>
              <li><a href="/terms" className="text-white/50 hover:text-white transition-colors text-[13px] font-light">Terms & Conditions</a></li>
              <li><a href="/refund" className="text-white/50 hover:text-white transition-colors text-[13px] font-light">Refund Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-10 pt-6 text-center">
          <p className="text-[10px] text-white/20 tracking-widest uppercase">
            © {new Date().getFullYear()} OffWeGo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;