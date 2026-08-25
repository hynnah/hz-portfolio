import { useEffect, useState } from 'react';
import Nav from './sections/Nav';
import Hero from './sections/Hero';
import About from './sections/About';
import Work from './sections/Work';
import Contact from './sections/Contact';
import ArchiveDialog from './components/ArchiveDialog';
import AdminApp from './admin/AdminApp';
import { useContent } from './hooks/useContent';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabaseClient';
import './App.css';

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (to) => {
    window.history.pushState({}, '', to);
    setPath(to);
  };
  return [path, navigate];
}

export default function App() {
  const content = useContent();
  const { isAdmin, ready } = useAuth();
  const [path, navigate] = useRoute();
  const [archiveOpen, setArchiveOpen] = useState(false);

  const isAdminRoute = path.startsWith('/admin');

  if (isAdminRoute) {
    if (!ready) return null;
    if (!isAdmin) {
      return (
        <ArchiveDialog
          onClose={() => navigate('/')}
          onSuccess={() => {}}
        />
      );
    }
    return <AdminApp content={content} onExit={() => navigate('/')} />;
  }

  return (
    <div className="site">
      <Nav />

      <Hero
        storyLine={content.profile.story_line}
        name={content.profile.name}
        subtitle={content.profile.subtitle}
      />

      <About
        profile={content.profile}
        skillGroups={content.skillGroups}
        education={content.education}
        certifications={content.certifications}
      />

      <Work projects={content.projects} />

      <Contact
        profile={content.profile}
        onRequestAdminLogin={() => setArchiveOpen(true)}
      />

      {archiveOpen && (
        <ArchiveDialog
          onClose={() => setArchiveOpen(false)}
          onSuccess={() => {
            setArchiveOpen(false);
            navigate('/admin');
          }}
        />
      )}

      {isAdmin && !archiveOpen && supabase && (
        <button type="button" className="admin-pill" onClick={() => navigate('/admin')}>
          Admin
        </button>
      )}
    </div>
  );
}
