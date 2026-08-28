import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProfileEditor from './ProfileEditor';
import SkillsEditor from './SkillsEditor';
import EducationEditor from './EducationEditor';
import CertificationsEditor from './CertificationsEditor';
import ProjectsEditor from './ProjectsEditor';
import { ToastProvider } from './ToastContext';
import './admin.css';

const TABS = [
  { id: 'profile', label: 'About & Résumé' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects' },
];

export default function AdminApp({ content, onExit }) {
  const [tab, setTab] = useState('profile');

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    onExit();
  };

  return (
    <ToastProvider>
      <div className="admin">
        <div className="admin__bar">
          <span className="admin__brand">hz. admin</span>
          <div className="admin__tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`admin__tab ${tab === t.id ? 'is-active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-secondary" onClick={onExit}>View live site</button>
          <button type="button" className="btn btn-ghost" onClick={signOut}>Sign out</button>
        </div>

        <div className="admin__main">
          {tab === 'profile' && <ProfileEditor profile={content.profile} reload={content.reload} />}
          {tab === 'skills' && <SkillsEditor skillGroups={content.skillGroups} reload={content.reload} />}
          {tab === 'education' && <EducationEditor education={content.education} reload={content.reload} />}
          {tab === 'certifications' && <CertificationsEditor certifications={content.certifications} reload={content.reload} />}
          {tab === 'projects' && <ProjectsEditor projects={content.projects} reload={content.reload} />}
        </div>
      </div>
    </ToastProvider>
  );
}
