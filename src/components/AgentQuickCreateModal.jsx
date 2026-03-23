import { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';
import { createEmptyAiAgent } from '../utils/aiData';
import { normalizeTagList } from '../utils/aiMetrics';
import { Button } from './Button';
import { Modal } from './Modal';

export const AgentQuickCreateModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState(createEmptyAiAgent());

  useEffect(() => {
    if (open) {
      setForm(createEmptyAiAgent());
    }
  }, [open]);

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal description="Create a new AI agent from anywhere in the app." onClose={onClose} open={open} title="New Agent">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            ...form,
            tags: normalizeTagList(form.tags),
          });
          onClose();
        }}
      >
        <input className="input-control !border-slate-700 !bg-slate-900 !text-slate-100" onChange={(event) => setField('agentName', event.target.value)} placeholder="Agent Name" required value={form.agentName} />
        <input className="input-control !border-slate-700 !bg-slate-900 !text-slate-100" onChange={(event) => setField('purpose', event.target.value)} placeholder="Purpose" required value={form.purpose} />
        <input className="input-control !border-slate-700 !bg-slate-900 !text-slate-100" onChange={(event) => setField('targetUser', event.target.value)} placeholder="Target User" value={form.targetUser} />
        <input className="input-control !border-slate-700 !bg-slate-900 !text-slate-100" onChange={(event) => setField('modelsUsed', event.target.value)} placeholder="Model(s) Used" value={form.modelsUsed} />
        <input className="input-control !border-slate-700 !bg-slate-900 !text-slate-100" onChange={(event) => setField('tags', event.target.value)} placeholder="Tags (comma separated)" value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} />
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            <Cpu className="h-4 w-4" />
            Create Agent
          </Button>
        </div>
      </form>
    </Modal>
  );
};
