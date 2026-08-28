import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './ToastContext';

function blankRow(sortOrder) {
  return { id: null, school: '', degree: '', years: '', sort_order: sortOrder };
}

export default function EducationEditor({ education, reload }) {
  const [rows, setRows] = useState(education);
  const [busyId, setBusyId] = useState(null);
  const [savingAll, setSavingAll] = useState(false);
  const showToast = useToast();

  const update = (idx, patch) => setRows((r) => r.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  const addRow = () => setRows((r) => [...r, blankRow(r.length ? Math.max(...r.map((x) => x.sort_order)) + 1 : 1)]);

  const saveRow = async (idx) => {
    const row = rows[idx];
    const payload = { school: row.school, degree: row.degree, years: row.years, sort_order: row.sort_order };
    const query = row.id
      ? supabase.from('education').update(payload).eq('id', row.id)
      : supabase.from('education').insert(payload).select().single();
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
    showToast(result.ok ? 'Education entry saved.' : result.message, result.ok);
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
    const { error } = await supabase.from('education').delete().eq('id', row.id);
    setBusyId(null);
    if (error) return showToast(error.message, false);
    setRows((r) => r.filter((_, i) => i !== idx));
    showToast('Education entry deleted.');
    reload();
  };

  return (
    <section>
      <div className="admin__panel-toolbar">
        <div>
          <h2 className="admin__panel-title">Education</h2>
          <p className="admin__panel-hint">Shown as a timeline under About.</p>
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
              <div className="admin__row">
                <label className="field" style={{ flex: '2 1 260px' }}>
                  <span>School</span>
                  <input className="input" value={row.school} onChange={(e) => update(idx, { school: e.target.value })} />
                </label>
                <label className="field" style={{ flex: '2 1 260px' }}>
                  <span>Degree</span>
                  <input className="input" value={row.degree} onChange={(e) => update(idx, { degree: e.target.value })} />
                </label>
                <label className="field">
                  <span>Years</span>
                  <input className="input" value={row.years} onChange={(e) => update(idx, { years: e.target.value })} />
                </label>
                <label className="field" style={{ flex: '0 1 100px' }}>
                  <span>Order</span>
                  <input className="input" type="number" value={row.sort_order} onChange={(e) => update(idx, { sort_order: Number(e.target.value) })} />
                </label>
              </div>
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
        <button type="button" className="btn btn-secondary admin__add-btn" onClick={addRow}>+ Add entry</button>
      </div>
    </section>
  );
}
