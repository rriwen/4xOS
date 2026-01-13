import React from 'react';
import { Menu, X } from 'lucide-react';
import { CONTACT } from '../constants';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { label: 'Experiences', href: '#work' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-paper border-b-2 border-black z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-black"></div>
            <a href="#" className="font-serif text-2xl font-black tracking-tighter">
              REN WENQIAN
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-mono text-sm font-bold uppercase hover:underline decoration-2 underline-offset-4"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 border-2 border-black active:bg-black active:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-black bg-paper absolute w-full h-screen">
          <div className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-serif text-4xl font-bold border-b border-gray-300 pb-2"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-8 font-mono text-sm text-gray-500">
              <p>{CONTACT.location}</p>
              <p>{CONTACT.email}</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
