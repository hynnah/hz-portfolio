import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { uploadAsset } from '../lib/uploadAsset';
import ImagePlate from '../components/ImagePlate';
import { useToast } from './ToastContext';

export default function ProfileEditor({ profile, reload }) {
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const showToast = useToast();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleUpload = (key, prefix) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(key);
    try {
      const url = await uploadAsset(file, prefix);
      setForm((f) => ({ ...f, [key]: url }));
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    // eslint-disable-next-line no-unused-vars
    const { id: _id, updated_at: _updatedAt, ...rest } = form;
    const { error } = await supabase.from('profile').upsert({ id: 1, ...rest });
    setSaving(false);
    if (error) {
      showToast(error.message, false);
      return;
    }
    showToast('Profile saved.');
    reload();
  };

  return (
    <section>
      <h2 className="admin__panel-title">About &amp; Résumé</h2>
      <p className="admin__panel-hint">Everything on the Home, About and Contact sections.</p>

      <form className="admin__form" onSubmit={save}>
        <div className="admin__card">
          <span className="admin__card-title">Hero</span>
          <label className="field">
            <span>Opening line</span>
            <input className="input" value={form.story_line} onChange={set('story_line')} />
          </label>
          <label className="field">
            <span>Full name (as shown after the hz. split animation)</span>
            <input className="input" value={form.name} onChange={set('name')} />
          </label>
          <label className="field">
            <span>Subtitle</span>
            <input className="input" value={form.subtitle} onChange={set('subtitle')} />
          </label>
        </div>

        <div className="admin__card">
          <span className="admin__card-title">About</span>
          <div className="admin__row">
            <div className="admin__thumb">
              <ImagePlate src={form.portrait_url} placeholder="No photo" />
            </div>
            <label className="field" style={{ flex: '1 1 240px' }}>
              <span>{uploading === 'portrait_url' ? 'Uploading…' : 'Portrait photo'}</span>
              <input className="input" type="file" accept="image/*" onChange={handleUpload('portrait_url', 'portrait')} />
            </label>
            {form.portrait_url && (
              <div className="admin__image-actions">
                <button type="button" className="admin__remove-btn" onClick={() => setForm((f) => ({ ...f, portrait_url: null }))}>
                  Remove photo
                </button>
              </div>
            )}
          </div>
          <label className="field">
            <span>About paragraph</span>
            <textarea className="input" rows={6} value={form.about_paragraph} onChange={set('about_paragraph')} />
          </label>
          <label className="field">
            <span>Location</span>
            <input className="input" value={form.location} onChange={set('location')} />
          </label>
        </div>

        <div className="admin__card">
          <span className="admin__card-title">Contact</span>
          <div className="admin__row">
            <label className="field">
              <span>Email</span>
              <input className="input" type="email" value={form.email} onChange={set('email')} />
            </label>
            <label className="field">
              <span>GitHub URL</span>
              <input className="input" value={form.github_url} onChange={set('github_url')} />
            </label>
            <label className="field">
              <span>LinkedIn URL</span>
              <input className="input" value={form.linkedin_url} onChange={set('linkedin_url')} />
            </label>
          </div>
          <label className="field">
            <span>{uploading === 'resume_url' ? 'Uploading…' : 'Résumé PDF'}</span>
            <input className="input" type="file" accept="application/pdf" onChange={handleUpload('resume_url', 'resume')} />
          </label>
          {form.resume_url && (
            <div className="admin__row" style={{ alignItems: 'center' }}>
              <a href={form.resume_url} target="_blank" rel="noopener noreferrer" className="admin__status" style={{ flex: '0 1 auto' }}>
                Current résumé →
              </a>
              <button type="button" className="admin__remove-btn" style={{ flex: '0 1 auto' }} onClick={() => setForm((f) => ({ ...f, resume_url: null }))}>
                Remove résumé
              </button>
            </div>
          )}
        </div>

        <div className="admin__toolbar">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}
