import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useToast } from './ToastContext';

function blankGroup(sortOrder) {
  return { id: null, label: '', items: [], sort_order: sortOrder, _itemsText: '' };
}

export default function SkillsEditor({ skillGroups, reload }) {
  const [rows, setRows] = useState(
    skillGroups.map((g) => ({ ...g, _itemsText: g.items.join(', ') }))
  );
  const [busyId, setBusyId] = useState(null);
  const [savingAll, setSavingAll] = useState(false);
  const showToast = useToast();

  const update = (idx, patch) => {
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  };

  const addGroup = () => {
    setRows((r) => [...r, blankGroup(r.length ? Math.max(...r.map((x) => x.sort_order)) + 1 : 1)]);
  };

  const saveRow = async (idx) => {
    const row = rows[idx];
    const items = row._itemsText.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = { label: row.label, items, sort_order: row.sort_order };
    const query = row.id
      ? supabase.from('skill_groups').update(payload).eq('id', row.id)
      : supabase.from('skill_groups').insert(payload).select().single();
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
    showToast(result.ok ? 'Skill group saved.' : result.message, result.ok);
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
    if (!row.id) {
      setRows((r) => r.filter((_, i) => i !== idx));
      return;
    }
    setBusyId(row.id);
    const { error } = await supabase.from('skill_groups').delete().eq('id', row.id);
    setBusyId(null);
    if (error) return showToast(error.message, false);
    setRows((r) => r.filter((_, i) => i !== idx));
    showToast('Skill group deleted.');
    reload();
  };

  return (
    <section>
      <div className="admin__panel-toolbar">
        <div>
          <h2 className="admin__panel-title">Skills</h2>
          <p className="admin__panel-hint">Grouped under the About section's "Stack" heading. Items are comma-separated.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={saveAll} disabled={savingAll || !rows.length}>
          {savingAll ? 'Saving all…' : 'Save all changes'}
        </button>
      </div>

      <div className="admin__list">
        {rows.map((row, idx) => (
          <div key={row.id ?? `new-${idx}`} className="admin__card">
            <div className="admin__row">
              <label className="field">
                <span>Group label</span>
                <input className="input" value={row.label} onChange={(e) => update(idx, { label: e.target.value })} />
              </label>
              <label className="field" style={{ flex: '2 1 260px' }}>
                <span>Items (comma-separated)</span>
                <input className="input" value={row._itemsText} onChange={(e) => update(idx, { _itemsText: e.target.value })} />
              </label>
              <label className="field" style={{ flex: '0 1 100px' }}>
                <span>Order</span>
                <input className="input" type="number" value={row.sort_order} onChange={(e) => update(idx, { sort_order: Number(e.target.value) })} />
              </label>
            </div>
            <div className="admin__toolbar">
              <button type="button" className="btn btn-danger" onClick={() => remove(idx)} disabled={busyId === (row.id ?? `new-${idx}`)}>Delete</button>
              <button type="button" className="btn btn-primary" onClick={() => save(idx)} disabled={busyId === (row.id ?? `new-${idx}`)}>
                {busyId === (row.id ?? `new-${idx}`) ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="admin__toolbar" style={{ justifyContent: 'flex-start', marginTop: 16 }}>
        <button type="button" className="btn btn-secondary admin__add-btn" onClick={addGroup}>+ Add group</button>
      </div>
    </section>
  );
}
