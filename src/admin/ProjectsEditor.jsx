import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { uploadAsset } from '../lib/uploadAsset';
import ImagePlate from '../components/ImagePlate';
import { useToast } from './ToastContext';

function isValidUrl(value) {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateProject(row) {
  if (!row.title.trim()) return 'Title is required.';
  if (!row.num.trim()) return 'Project number is required.';
  if (row.demo_url && !isValidUrl(row.demo_url)) return 'Live demo URL must be a valid http(s) link.';
  if (row.repo_url && !isValidUrl(row.repo_url)) return 'Repository URL must be a valid http(s) link.';
  return null;
}

function blankProject(sortOrder) {
  return {
    id: null,
    num: String(sortOrder).padStart(2, '0'),
    title: '',
    kind: '',
    dates: '',
    blurb: '',
    stack: '',
    full: '',
    repo_url: '',
    demo_url: '',
    private_note: '',
    image_url: null,
    preview_url: null,
    sort_order: sortOrder,
    _tagsText: '',
  };
}

export default function ProjectsEditor({ projects, reload }) {
  const [rows, setRows] = useState(projects.map((p) => ({ ...p, _tagsText: (p.tags ?? []).join(', ') })));
  const [busyId, setBusyId] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadingPreviewId, setUploadingPreviewId] = useState(null);
  const [savingAll, setSavingAll] = useState(false);
  const showToast = useToast();

  const update = (idx, patch) => setRows((r) => r.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  const addRow = () => setRows((r) => [...r, blankProject(r.length ? Math.max(...r.map((x) => x.sort_order)) + 1 : 1)]);

  const handleUpload = (idx) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = rows[idx].id ?? `new-${idx}`;
    setUploadingId(key);
    try {
      const url = await uploadAsset(file, 'projects');
      update(idx, { image_url: url });
      showToast('Screenshot uploaded — click Save to publish it.');
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setUploadingId(null);
      e.target.value = '';
    }
  };

  const handlePreviewUpload = (idx) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = rows[idx].id ?? `new-${idx}`;
    setUploadingPreviewId(key);
    try {
      const url = await uploadAsset(file, 'projects-preview');
      update(idx, { preview_url: url });
      showToast('Preview screenshot uploaded — click Save to publish it.');
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setUploadingPreviewId(null);
      e.target.value = '';
    }
  };

  const saveRow = async (idx) => {
    const row = rows[idx];
    const validationError = validateProject(row);
    if (validationError) return { ok: false, message: validationError };
    const tags = row._tagsText.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = {
      num: row.num,
      title: row.title,
      kind: row.kind,
      dates: row.dates,
      blurb: row.blurb,
      stack: row.stack,
      tags,
      full_description: row.full,
      repo_url: row.repo_url || null,
      demo_url: row.demo_url || null,
      private_note: row.private_note || null,
      image_url: row.image_url || null,
      preview_url: row.preview_url || null,
      sort_order: row.sort_order,
    };
    const query = row.id
      ? supabase.from('projects').update(payload).eq('id', row.id)
      : supabase.from('projects').insert(payload).select().single();
    const { data, error } = await query;
    if (error) return { ok: false, message: error.message };
    if (!row.id && data) update(idx, { id: data.id });
    return { ok: true };
  };

  const save = async (idx) => {
    const key = rows[idx].id ?? `new-${idx}`;
    setBusyId(key);
    const result = await saveRow(idx);
    setBusyId(null);
    showToast(result.ok ? 'Project saved.' : result.message, result.ok);
    if (result.ok) reload();
  };

  const saveAll = async () => {
    setSavingAll(true);
    let failed = 0;
    for (let i = 0; i < rows.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const result = await saveRow(i);
      if (!result.ok) failed++;
    }
    setSavingAll(false);
    showToast(failed ? `Saved with ${failed} error(s).` : 'All changes saved.', failed === 0);
    reload();
  };

  const remove = async (idx) => {
    const row = rows[idx];
    if (!row.id) return setRows((r) => r.filter((_, i) => i !== idx));
    setBusyId(row.id);
    const { error } = await supabase.from('projects').delete().eq('id', row.id);
    setBusyId(null);
    if (error) return showToast(error.message, false);
    setRows((r) => r.filter((_, i) => i !== idx));
    showToast('Project deleted.');
    reload();
  };

  return (
    <section>
      <div className="admin__panel-toolbar">
        <div>
          <h2 className="admin__panel-title">Projects</h2>
          <p className="admin__panel-hint">The Work section's carousel and case-study panels. Add up to as many as you like.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={saveAll} disabled={savingAll || !rows.length}>
          {savingAll ? 'Saving all…' : 'Save all changes'}
        </button>
      </div>

      <div className="admin__list">
        {rows.map((row, idx) => {
          const key = row.id ?? `new-${idx}`;
          return (
            <div key={key} className="admin__card">
              <div className="admin__card-head">
                <span className="admin__card-title">{row.title || 'New project'}</span>
              </div>

              <div className="admin__row">
                <div className="admin__thumb">
                  <ImagePlate src={row.image_url} placeholder="No image" />
                </div>
                <label className="field" style={{ flex: '1 1 240px' }}>
                  <span>{uploadingId === key ? 'Uploading…' : 'Screenshot (card thumbnail)'}</span>
                  <input className="input" type="file" accept="image/*" onChange={handleUpload(idx)} />
                </label>
                {row.image_url && (
                  <div className="admin__image-actions">
                    <button type="button" className="admin__remove-btn" onClick={() => update(idx, { image_url: null })}>
                      Remove image
                    </button>
                  </div>
                )}
              </div>

              <div className="admin__row">
                <div className="admin__thumb">
                  <ImagePlate src={row.preview_url} placeholder="No image" />
                </div>
                <label className="field" style={{ flex: '1 1 240px' }}>
                  <span>{uploadingPreviewId === key ? 'Uploading…' : 'System preview screenshot (case-study panel)'}</span>
                  <input className="input" type="file" accept="image/*" onChange={handlePreviewUpload(idx)} />
                </label>
                {row.preview_url && (
                  <div className="admin__image-actions">
                    <button type="button" className="admin__remove-btn" onClick={() => update(idx, { preview_url: null })}>
                      Remove image
                    </button>
                  </div>
                )}
              </div>

              <div className="admin__row">
                <label className="field" style={{ flex: '0 1 90px' }}>
                  <span>№</span>
                  <input className="input" value={row.num} onChange={(e) => update(idx, { num: e.target.value })} />
                </label>
                <label className="field" style={{ flex: '2 1 260px' }}>
                  <span>Title</span>
                  <input className="input" value={row.title} onChange={(e) => update(idx, { title: e.target.value })} />
                </label>
                <label className="field" style={{ flex: '0 1 100px' }}>
                  <span>Order</span>
                  <input className="input" type="number" value={row.sort_order} onChange={(e) => update(idx, { sort_order: Number(e.target.value) })} />
                </label>
              </div>

              <div className="admin__row">
                <label className="field">
                  <span>Kind</span>
                  <input className="input" value={row.kind} onChange={(e) => update(idx, { kind: e.target.value })} placeholder="Capstone Project" />
                </label>
                <label className="field">
                  <span>Dates</span>
                  <input className="input" value={row.dates} onChange={(e) => update(idx, { dates: e.target.value })} placeholder="June 2026 — Present" />
                </label>
              </div>

              <label className="field">
                <span>Blurb (short, shown on the card)</span>
                <input className="input" value={row.blurb} onChange={(e) => update(idx, { blurb: e.target.value })} />
              </label>

              <label className="field">
                <span>Stack line (shown under the title on the card)</span>
                <input className="input" value={row.stack} onChange={(e) => update(idx, { stack: e.target.value })} placeholder="HTML · CSS · JavaScript" />
              </label>

              <label className="field">
                <span>Tags (comma-separated, shown in the case-study panel)</span>
                <input className="input" value={row._tagsText} onChange={(e) => update(idx, { _tagsText: e.target.value })} />
              </label>

              <label className="field">
                <span>Full description (case-study panel)</span>
                <textarea className="input" rows={5} value={row.full} onChange={(e) => update(idx, { full: e.target.value })} />
              </label>

              <div className="admin__row">
                <label className="field">
                  <span>Live demo URL (optional)</span>
                  <input className="input" value={row.demo_url ?? ''} onChange={(e) => update(idx, { demo_url: e.target.value })} />
                </label>
                <label className="field">
                  <span>Repository URL (optional)</span>
                  <input className="input" value={row.repo_url ?? ''} onChange={(e) => update(idx, { repo_url: e.target.value })} />
                </label>
              </div>

              <label className="field">
                <span>Private note (shown instead of links, e.g. while unfinished)</span>
                <input className="input" value={row.private_note ?? ''} onChange={(e) => update(idx, { private_note: e.target.value })} />
              </label>

              <div className="admin__toolbar">
                <button type="button" className="btn btn-danger" onClick={() => remove(idx)} disabled={busyId === key}>Delete</button>
                <button type="button" className="btn btn-primary" onClick={() => save(idx)} disabled={busyId === key}>
                  {busyId === key ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin__toolbar" style={{ justifyContent: 'flex-start', marginTop: 16 }}>
        <button type="button" className="btn btn-secondary admin__add-btn" onClick={addRow}>+ Add project</button>
      </div>
    </section>
  );
}
