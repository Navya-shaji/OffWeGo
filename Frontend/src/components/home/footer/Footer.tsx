import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-coral-500 to-orange-500 bg-clip-text text-transparent">
              OffWeGo
            </h4>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your gateway to extraordinary travel experiences. Discover, explore, and create memories that last a lifetime.
            </p>
            <div className="space-y-2">
              <h5 className="font-semibold mb-3">Newsletter</h5>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button className="bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Reach Us */}
          <div>
            <h5 className="font-semibold mb-4">Reach Us</h5>
            <div className="space-y-3 text-gray-400">
              <p>
                123 Travel Street<br />
                Adventure City, AC 12345
              </p>
              <p>contact@offwego.com</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Careers</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Press</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Support</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 OffWeGo. All rights reserved. Made with ❤️ for travelers worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
