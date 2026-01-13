import React from 'react';
import { PROJECTS } from '../constants';
import { SectionHeader } from './SectionHeader';
import { ArrowUpRight } from 'lucide-react';

export const Projects = () => {
  return (
    <section id="projects" className="py-20 border-b-2 border-black bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number="03" title="Projects" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-16">
          {PROJECTS.map((project) => (
            <a 
              key={project.id} 
              href={`#project/${project.id}`}
              className="group flex flex-col h-full cursor-pointer block"
            >
              
              {/* Image Container */}
              <div className="border-2 border-black overflow-hidden relative shadow-retro group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-300 bg-gray-100 aspect-[4/3] mb-6">
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute top-4 right-4 bg-white border-2 border-black p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={24} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="font-mono text-xs font-bold border border-black px-2 py-1 uppercase bg-transparent group-hover:bg-black group-hover:text-white transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-serif text-3xl font-bold mb-2 group-hover:underline decoration-4 underline-offset-4">{project.title}</h3>
                <p className="font-mono text-sm text-gray-600 mb-4 border-b border-black pb-4 inline-block w-full">{project.subtitle}</p>
                
                <p className="text-base leading-relaxed mb-6 font-medium text-gray-800 flex-grow">
                  {project.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                  {project.metrics.map((metric, i) => (
                    <div key={i} className="border-l-4 border-black pl-3 py-1 bg-gray-50">
                       <span className="font-bold font-mono text-sm block">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};