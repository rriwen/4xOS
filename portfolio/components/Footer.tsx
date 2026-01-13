import React from 'react';
import { CONTACT } from '../constants';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer id="contact" className="bg-black text-white py-20 border-t-4 border-double border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h2 className="font-serif text-5xl md:text-7xl font-black leading-none">
              LET'S WORK <br /> TOGETHER
            </h2>
            <p className="font-mono text-gray-400 max-w-md">
              Available for new opportunities in Product Design and Experience Design.
            </p>
          </div>

          <div className="bg-white text-black p-8 md:p-12 border-4 border-white transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="space-y-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="bg-black text-white p-3 rounded-none group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-mono text-xs text-gray-500 uppercase">Email</p>
                  <a href={`mailto:${CONTACT.email}`} className="font-serif text-xl font-bold hover:underline">{CONTACT.email}</a>
                </div>
              </div>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="bg-black text-white p-3 rounded-none group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-mono text-xs text-gray-500 uppercase">Phone / WeChat</p>
                  <p className="font-serif text-xl font-bold">{CONTACT.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-black text-white p-3 rounded-none">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-mono text-xs text-gray-500 uppercase">Location</p>
                  <p className="font-serif text-xl font-bold">{CONTACT.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm font-mono text-gray-500">
          <p>© {new Date().getFullYear()} REN WENQIAN. All Rights Reserved.</p>
          <p>DESIGNED WITH RAW CODE</p>
        </div>
      </div>
    </footer>
  );
};
