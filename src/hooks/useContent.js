import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  defaultProfile,
  defaultSkillGroups,
  defaultEducation,
  defaultCertifications,
  defaultProjects,
} from '../data/defaultContent';

function normalizeProject(row) {
  return {
    id: row.id,
    num: row.num,
    title: row.title,
    kind: row.kind,
    dates: row.dates,
    blurb: row.blurb,
    stack: row.stack,
    tags: row.tags ?? [],
    full: row.full_description,
    repo_url: row.repo_url,
    demo_url: row.demo_url,
    private_note: row.private_note,
    image_url: row.image_url,
    preview_url: row.preview_url,
    sort_order: row.sort_order,
  };
}

/**
 * Loads all portfolio content from Supabase, falling back to the built-in
 * defaults if Supabase isn't configured, unreachable, or a table is empty
 * (e.g. schema.sql was run but seed.sql wasn't yet). Exposes `reload` so the
 * admin panel can refresh the public view after a save.
 */
export function useContent() {
  const [state, setState] = useState({
    loading: true,
    profile: defaultProfile,
    skillGroups: defaultSkillGroups,
    education: defaultEducation,
    certifications: defaultCertifications,
    projects: defaultProjects,
    usingFallback: true,
  });

  const reload = useCallback(async () => {
    if (!supabase) {
      setState((s) => ({ ...s, loading: false, usingFallback: true }));
      return;
    }

    try {
      const [profileRes, skillsRes, eduRes, certsRes, projectsRes] = await Promise.all([
        supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
        supabase.from('skill_groups').select('*').order('sort_order').order('id'),
        supabase.from('education').select('*').order('sort_order').order('id'),
        supabase.from('certifications').select('*').order('sort_order').order('id'),
        supabase.from('projects').select('*').order('sort_order').order('id'),
      ]);

      const hasError =
        profileRes.error || skillsRes.error || eduRes.error || certsRes.error || projectsRes.error;
      if (hasError) throw hasError;

      const projects = (projectsRes.data ?? []).map(normalizeProject);

      setState({
        loading: false,
        usingFallback: false,
        profile: profileRes.data ?? defaultProfile,
        skillGroups: skillsRes.data?.length ? skillsRes.data : defaultSkillGroups,
        education: eduRes.data?.length ? eduRes.data : defaultEducation,
        certifications: certsRes.data?.length ? certsRes.data : defaultCertifications,
        projects: projects.length ? projects : defaultProjects,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Falling back to default content — Supabase fetch failed:', err.message ?? err);
      setState((s) => ({ ...s, loading: false, usingFallback: true }));
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}
