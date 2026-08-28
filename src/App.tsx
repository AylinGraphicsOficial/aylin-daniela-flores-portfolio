/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Language, Project } from './types';
import { WelcomeCurtain } from './components/WelcomeCurtain';
import { WebGLFluidShader } from './components/WebGLFluidShader';
import { CustomCursor } from './components/CustomCursor';
import { GradualBlur } from './components/GradualBlur';
import { TopNavBar } from './components/TopNavBar';
import { HeroSection } from './components/HeroSection';
import { WorksBentoGrid } from './components/WorksBentoGrid';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { AboutSection } from './components/AboutSection';
import { DiplomadosSection } from './components/DiplomadosSection';
import { BrandsSection } from './components/BrandsSection';
import { ContactSection } from './components/ContactSection';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/dashboard/AdminLoginModal';
import { AdminDashboardModal } from './components/dashboard/AdminDashboardModal';
import {
  getStoredProjects,
  subscribeToPortfolioChanges,
} from './utils/portfolioStorage';

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
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'project-detail'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#proyecto/') || hash.startsWith('#project/')) {
        const id = hash.replace(/^#(proyecto|project)\//, '');
        const allProjects = getStoredProjects();
        const found = allProjects.find((p) => p.id.toLowerCase() === id.toLowerCase());
        if (found) {
          return 'project-detail';
        }
      }
    }
    return 'home';
  });

  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aylin_portfolio_lang');
      if (saved === 'en' || saved === 'es') return saved;
    }
    return 'es'; // Initial default: Spanish
  });

  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [isProjectPlannerOpen, setIsProjectPlannerOpen] = useState<boolean>(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState<boolean>(false);

  // Admin Dashboard and Login States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('aylin_admin_auth') === 'true';
    }
    return false;
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);

  // Sync with browser URL hash and stored projects
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#proyecto/') || hash.startsWith('#project/')) {
        const id = hash.replace(/^#(proyecto|project)\//, '');
        const allProjects = getStoredProjects();
        const found = allProjects.find((p) => p.id.toLowerCase() === id.toLowerCase());
        if (found) {
          setActiveProject(found);
          setCurrentView('project-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      setCurrentView('home');
    };
    window.addEventListener('hashchange', handleHashChange);

    const unsubscribe = subscribeToPortfolioChanges(() => {
      // Re-sync active project if edited
      if (activeProject) {
        const allProjects = getStoredProjects();
        const refreshed = allProjects.find((p) => p.id === activeProject.id);
        if (refreshed) setActiveProject(refreshed);
      }
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      unsubscribe();
    };
  }, [activeProject]);

  const openProjectDetail = (project: Project) => {
    setActiveProject(project);
    setCurrentView('project-detail');
    window.location.hash = `#proyecto/${project.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateHome = () => {
    setCurrentView('home');
    if (
      window.location.hash.includes('proyect') ||
      window.location.hash.includes('project')
    ) {
      history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle language between ES and EN
  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'es' ? 'en' : 'es';
      if (typeof window !== 'undefined') {
        localStorage.setItem('aylin_portfolio_lang', next);
      }
      return next;
    });
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCaseStudy(null);
        setIsProjectPlannerOpen(false);
        setIsCVModalOpen(false);
        setIsAdminLoginModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth Scroll Reveal Intersection Observer
  useEffect(() => {
    if (currentView !== 'home') return;
    document.body.classList.add('js-reveal-active');
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
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      document.body.classList.remove('js-reveal-active');
    };
  }, [currentView]);

  return (
    <div className="relative min-h-screen bg-[#050B05] text-white selection:bg-[#76FF03] selection:text-[#050B05]">
      {/* 3-Second 8-Bit Cyber Intro Welcome Curtain */}
      <WelcomeCurtain />

      {/* Dynamic Background GLSL Liquid WebGL Shader */}
      <WebGLFluidShader interactive={true} />

      {/* Kinetic Fluid Custom Mouse Cursor */}
      <CustomCursor />

      {/* Fixed Sticky Header Navigation */}
      <TopNavBar
        lang={lang}
        onLanguageToggle={toggleLanguage}
        onOpenProjectPlanner={() => setIsProjectPlannerOpen(true)}
        currentView={currentView}
        onNavigateHome={navigateHome}
      />

      {/* Bottom Scroll Gradual Blur Overlay (React Bits) */}
      <GradualBlur
        target="page"
        position="bottom"
        height="5rem"
        strength={1.5}
        divCount={6}
        curve="bezier"
        exponential={true}
        opacity={0.92}
        zIndex={40}
      />

      {/* Main Content Layout with Smooth Transitions */}
      {currentView === 'project-detail' && activeProject ? (
        <main className="relative z-10">
          <ProjectDetailPage
            project={activeProject}
            lang={lang}
            onBackToPortfolio={navigateHome}
            onSelectProject={openProjectDetail}
            onOpenProjectPlanner={() => setIsProjectPlannerOpen(true)}
          />
        </main>
      ) : (
        <main className="relative z-10 flex flex-col space-y-4">
          <div className="scroll-reveal is-visible">
            <HeroSection
              lang={lang}
              onOpenCVModal={() => setIsCVModalOpen(true)}
              onOpenProjectPlanner={() => setIsProjectPlannerOpen(true)}
              onSelectProject={openProjectDetail}
            />
          </div>

          <div className="scroll-reveal">
            <WorksBentoGrid
              lang={lang}
              onSelectProject={openProjectDetail}
            />
          </div>

          <div className="scroll-reveal">
            <Suspense fallback={null}>
              <Interactive3DViewer lang={lang} />
            </Suspense>
          </div>

          <div className="scroll-reveal">
            <ExperienceTimeline lang={lang} />
          </div>

          <div className="scroll-reveal">
            <AboutSection lang={lang} />
          </div>

          <div className="scroll-reveal">
            <DiplomadosSection lang={lang} />
          </div>

          <div className="scroll-reveal">
            <BrandsSection lang={lang} />
          </div>

          <div className="scroll-reveal">
            <ContactSection
              lang={lang}
              onOpenProjectPlanner={() => setIsProjectPlannerOpen(true)}
            />
          </div>
        </main>
      )}

      {/* Studio Kinetic Footer with Admin Login Trigger */}
      <Footer
        onOpenAdminLogin={() => {
          if (isAdminLoggedIn) {
            setIsDashboardOpen(true);
          } else {
            setIsAdminLoginModalOpen(true);
          }
        }}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsAdminLoginModalOpen(false);
          setIsDashboardOpen(true);
        }}
      />

      {/* Full Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        onLogout={() => {
          sessionStorage.removeItem('aylin_admin_auth');
          setIsAdminLoggedIn(false);
          setIsDashboardOpen(false);
        }}
      />

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
