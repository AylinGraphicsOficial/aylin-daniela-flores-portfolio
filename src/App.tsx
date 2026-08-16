/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Language, Project } from './types';
import { WebGLFluidShader } from './components/WebGLFluidShader';
import { CustomCursor } from './components/CustomCursor';
import { TopNavBar } from './components/TopNavBar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { WorksBentoGrid } from './components/WorksBentoGrid';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { StatsAndMilestones } from './components/StatsAndMilestones';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Lazy-loaded: only fetched when scrolled into view or opened on demand
const Interactive3DViewer = lazy(() =>
  import('./components/Interactive3DViewer').then((m) => ({ default: m.Interactive3DViewer }))
);
const CaseStudyModal = lazy(() =>
  import('./components/CaseStudyModal').then((m) => ({ default: m.CaseStudyModal }))
);
const ProjectPlannerModal = lazy(() =>
  import('./components/ProjectPlannerModal').then((m) => ({ default: m.ProjectPlannerModal }))
);
const CVViewerModal = lazy(() =>
  import('./components/CVViewerModal').then((m) => ({ default: m.CVViewerModal }))
);

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [isProjectPlannerOpen, setIsProjectPlannerOpen] = useState<boolean>(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState<boolean>(false);

  // Toggle language between EN and ES
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCaseStudy(null);
        setIsProjectPlannerOpen(false);
        setIsCVModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth Scroll Reveal Intersection Observer
  useEffect(() => {
    const reveals = document.querySelectorAll('.scroll-reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050B05] text-white selection:bg-[#76FF03] selection:text-[#050B05]">
      {/* Dynamic Background GLSL Liquid WebGL Shader */}
      <WebGLFluidShader interactive={true} />

      {/* Kinetic Fluid Custom Mouse Cursor */}
      <CustomCursor />

      {/* Fixed Sticky Header Navigation */}
      <TopNavBar
        lang={lang}
        onLanguageToggle={toggleLanguage}
        onOpenProjectPlanner={() => setIsProjectPlannerOpen(true)}
      />

      {/* Main Content Layout with Smooth Scroll Reveal Transitions */}
      <main className="relative z-10 flex flex-col space-y-4">
        <div className="scroll-reveal is-visible">
          <HeroSection
            lang={lang}
            onOpenCVModal={() => setIsCVModalOpen(true)}
            onOpenProjectPlanner={() => setIsProjectPlannerOpen(true)}
          />
        </div>

        <div className="scroll-reveal">
          <AboutSection lang={lang} />
        </div>

        <div className="scroll-reveal">
          <Suspense fallback={null}>
            <Interactive3DViewer lang={lang} />
          </Suspense>
        </div>

        <div className="scroll-reveal">
          <WorksBentoGrid
            lang={lang}
            onSelectProject={(project) => setSelectedCaseStudy(project)}
          />
        </div>

        <div className="scroll-reveal">
          <ExperienceTimeline lang={lang} />
        </div>

        <div className="scroll-reveal">
          <StatsAndMilestones lang={lang} />
        </div>

        <div className="scroll-reveal">
          <ContactSection
            lang={lang}
            onOpenProjectPlanner={() => setIsProjectPlannerOpen(true)}
          />
        </div>
      </main>

      {/* Studio Kinetic Footer */}
      <Footer />

      <Suspense fallback={null}>
        {/* Interactive Case Study Detail Modal */}
        <CaseStudyModal
          project={selectedCaseStudy}
          lang={lang}
          onClose={() => setSelectedCaseStudy(null)}
          onOpenProjectPlanner={() => {
            setSelectedCaseStudy(null);
            setIsProjectPlannerOpen(true);
          }}
        />

        {/* Interactive Project Estimator & Scope Builder Modal */}
        <ProjectPlannerModal
          isOpen={isProjectPlannerOpen}
          lang={lang}
          onClose={() => setIsProjectPlannerOpen(false)}
        />

        {/* Structured CV / Resume Viewer Modal */}
        <CVViewerModal
          isOpen={isCVModalOpen}
          lang={lang}
          onClose={() => setIsCVModalOpen(false)}
        />
      </Suspense>
    </div>
  );
}
