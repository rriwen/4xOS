import React from 'react';
import { ArrowDown } from 'lucide-react';
import { CONTACT } from '../constants';

export const Hero = () => {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center border-b-2 border-black bg-paper relative overflow-hidden pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="inline-block border-2 border-black px-4 py-1 font-mono font-bold text-sm bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              AVAILABLE FOR HIRE
            </div>
            
            <h1 className="font-serif text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-black uppercase">
              Product <br/>
              <span className="text-stroke-black text-transparent" style={{ WebkitTextStroke: '2px black' }}>Designer</span>
            </h1>

            <div className="max-w-xl">
              <p className="font-serif text-base leading-[36px] font-medium border-l-4 border-black pl-6 py-2 text-black">
                编辑器产品经验&nbsp; &nbsp;·&nbsp; &nbsp;AI产品创新设计&nbsp; &nbsp;·&nbsp; &nbsp;复杂系统重构<br/>
                致力于通过用户研究、数据洞察，解决业务复杂难题，探索创新体验
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a 
                href="#contact"
                className="inline-flex justify-center items-center px-8 py-4 bg-black text-white font-mono font-bold uppercase border-2 border-black shadow-retro hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                Contact Me
              </a>
              <a 
                href="#projects"
                className="inline-flex justify-center items-center px-8 py-4 bg-white text-black font-mono font-bold uppercase border-2 border-black shadow-retro hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                VIEW PROJECTS
              </a>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-between border-2 border-black p-6 bg-white shadow-retro h-full min-h-[400px]">
            <div className="w-full h-80 bg-gray-200 border-2 border-black mb-4 overflow-hidden relative">
               <img src="/profile.jpg" alt="Profile" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
               <div className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: 'unset' }}></div>
            </div>
            <div className="font-mono text-sm space-y-2">
              <div className="flex justify-between border-b border-black pb-1">
                <span>LOC</span>
                <span className="font-bold">{CONTACT.location}</span>
              </div>
              <div className="flex justify-between border-b border-black pb-1">
                <span>EXP</span>
                <span className="font-bold">5+ Years</span>
              </div>
              <div className="flex justify-between border-b border-black pb-1">
                <span>EDU</span>
                <span className="font-bold">Software Eng.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown size={32} />
      </div>
    </section>
  );
};