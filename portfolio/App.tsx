import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { ProjectDetail } from './components/ProjectDetail';
import { Skills } from './components/Skills';
import { Footer } from './components/Footer';
import { PROJECTS } from './constants';

function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#project/')) {
        const id = hash.replace('#project/', '');
        // Validate project id exists
        if (PROJECTS.find(p => p.id === id)) {
          setProjectId(id);
          setCurrentRoute('project');
        } else {
          // Fallback if ID invalid
          window.location.hash = '';
          setCurrentRoute('home');
        }
      } else {
        setCurrentRoute('home');
        setProjectId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Effect to handle scrolling to section when route changes to home
  useEffect(() => {
    if (currentRoute === 'home') {
      const hash = window.location.hash;
      if (hash && !hash.startsWith('#project/')) {
        // We use a timeout to ensure the DOM has re-rendered the Home sections
        setTimeout(() => {
          const id = hash.replace('#', '');
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else if (!hash) {
        // Scroll to top if no hash (e.g. clicking Logo)
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentRoute, projectId]);

  const activeProject = projectId ? PROJECTS.find(p => p.id === projectId) : null;

  if (currentRoute === 'project' && activeProject) {
    return (
      <div className="min-h-screen flex flex-col antialiased selection:bg-black selection:text-white">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20">
          <ProjectDetail 
            project={activeProject} 
            onBack={() => {
              window.location.hash = '#projects';
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-black selection:text-white">
      <Navbar />
      <main className="flex-grow pt-16 md:pt-20">
        <Hero />
        <Experience />
        <Skills />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}

export default App;