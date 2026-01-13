import React from 'react';
import { EXPERIENCE } from '../constants';
import { SectionHeader } from './SectionHeader';

export const Experience = () => {
  return (
    <section id="work" className="py-20 border-b-2 border-black bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number="01" title="Experiences" />

        <div className="space-y-12">
          {EXPERIENCE.map((job, index) => (
            <div key={index} className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8 border-2 border-black bg-white">
              
              {/* Sidebar/Date */}
              <div className="md:col-span-3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-gray-400 pb-4 md:pb-0 md:pr-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold mb-1">{job.company}</h3>
                  <p className="font-mono text-sm text-gray-600 mb-4">{job.role}</p>
                </div>
                <div className="font-mono text-xs bg-black text-white inline-block px-2 py-1 self-start">
                  {job.period}
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-9 space-y-6">
                <div className="space-y-3">
                  {job.description.map((desc, i) => (
                    <p key={i} className="text-sm md:text-base leading-relaxed font-medium">
                      • {desc}
                    </p>
                  ))}
                </div>
                
                {job.achievements && (
                  <div className="bg-gray-100 p-4 border border-black mt-4">
                    <h4 className="font-mono text-xs font-bold uppercase mb-2 text-gray-500">Key Achievements</h4>
                    <ul className="space-y-2">
                      {job.achievements.map((ach, i) => (
                        <li key={i} className="text-sm font-bold flex items-start">
                          <span className="mr-2">→</span> {ach}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-black"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
