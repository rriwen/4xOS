import React from 'react';
import { Project } from '../types';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const { detail } = project;

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-paper min-h-screen pb-20">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 font-mono text-sm font-bold uppercase hover:underline decoration-2 underline-offset-4"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </button>
      </div>

      {/* Hero */}
      <div className="border-y-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <div>
               <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span key={tag} className="font-mono text-xs font-bold border border-black px-2 py-1 uppercase bg-black text-white">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-5xl md:text-6xl font-black uppercase leading-[0.9] mb-4">
                {project.title}
              </h1>
              <p className="font-mono text-xl text-gray-600">{project.subtitle}</p>
            </div>
            
            <div className="flex flex-col gap-4 font-mono text-sm border-l-2 border-black pl-6">
              <div>
                <span className="text-gray-500 block text-xs uppercase mb-1">Role</span>
                <span className="font-bold">{project.role}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs uppercase mb-1">Key Metrics</span>
                <div className="flex gap-4">
                  {project.metrics.map((m, i) => <span key={i} className="font-bold bg-gray-100 px-2 py-1">{m}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* Background & Challenge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
             <h3 className="font-serif text-2xl font-bold border-b-2 border-black pb-2">Background</h3>
             <p className="text-lg leading-relaxed font-medium text-gray-800">{detail.background}</p>
          </div>
          <div className="space-y-4">
             <h3 className="font-serif text-2xl font-bold border-b-2 border-black pb-2">The Challenge</h3>
             <p className="text-lg leading-relaxed font-medium text-gray-800">{detail.challenge}</p>
          </div>
        </div>

        {/* Image */}
        <div className="w-full aspect-video border-2 border-black p-2 bg-white shadow-retro">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover grayscale"
          />
        </div>

        {/* Solution */}
        <div className="space-y-6">
           <SectionHeader number="01" title="The Solution" />
           <div className="bg-white border-2 border-black p-8 shadow-retro">
             <p className="text-lg leading-loose font-medium whitespace-pre-line">{detail.solution}</p>
           </div>
        </div>

        {/* Process & Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="space-y-6">
            <h3 className="font-serif text-3xl font-bold">Process</h3>
            <ul className="space-y-0 border-l-2 border-black ml-2">
              {detail.process.map((step, i) => (
                <li key={i} className="relative pl-8 pb-8 last:pb-0">
                  <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 bg-black rounded-full"></div>
                  <p className="font-medium text-lg">{step}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-serif text-3xl font-bold">Results</h3>
            <div className="space-y-4">
              {detail.result.map((res, i) => (
                <div key={i} className="flex gap-4 items-start bg-black text-white p-4 shadow-retro">
                  <CheckCircle2 className="shrink-0 mt-1" size={20} />
                  <p className="font-medium">{res}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};