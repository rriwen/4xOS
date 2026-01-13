import React from 'react';
import { SKILLS } from '../constants';
import { SectionHeader } from './SectionHeader';

export const Skills = () => {
  return (
    <section id="skills" className="py-20 border-b-2 border-black bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number="02" title="Skills" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map((category, index) => (
            <div key={index} className="border-2 border-black p-6 bg-white hover:-translate-y-2 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:shadow-retro">
              <h3 className="font-serif text-xl font-bold mb-6 pb-2 border-b-2 border-black">
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.items.map((skill, i) => (
                  <li key={i} className="font-mono text-sm flex items-center">
                    <span className="w-1.5 h-1.5 bg-black mr-3"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
