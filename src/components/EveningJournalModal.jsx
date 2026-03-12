import { useEffect, useState } from 'react';
import { BookCheck } from 'lucide-react';
import { createEmptyEveningJournal } from '../utils/sampleData';
import { Button } from './Button';
import { Modal } from './Modal';

const prompts = [
  { key: 'progress', label: 'What progress did I make today?' },
  { key: 'problem', label: 'What problem did I explore?' },
  { key: 'insight', label: 'What insight did I discover?' },
  { key: 'waste', label: 'What did I waste time on?' },
  { key: 'tomorrow', label: 'What must I do tomorrow?' },
  { key: 'learning', label: 'What did I learn today?' },
  { key: 'gratitude', label: 'What am I grateful for?' },
];

export const EveningJournalModal = ({ open, onClose, onSave, todayKey }) => {
  const [form, setForm] = useState(createEmptyEveningJournal(todayKey));

  useEffect(() => {
    if (open) {
      setForm(createEmptyEveningJournal(todayKey));
    }
  }, [open, todayKey]);

  const handleChange = (key, value) => setForm((current) => ({ ...current, [key]: value, date: todayKey }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ ...form, date: todayKey });
    onClose();
  };

  return (
    <Modal
      description="Close the day with a deliberate founder reflection loop."
      onClose={onClose}
      open={open}
      title="Evening Journal"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {prompts.map((prompt) => (
          <div key={prompt.key}>
            <label className="mb-2 block text-sm font-medium text-slate-200">{prompt.label}</label>
            <textarea
              className="textarea-control !min-h-[96px] !border-slate-700 !bg-slate-900 !text-slate-100"
              onChange={(event) => handleChange(prompt.key, event.target.value)}
              value={form[prompt.key]}
            />
          </div>
        ))}
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            <BookCheck className="h-4 w-4" />
            Save Journal
          </Button>
        </div>
      </form>
    </Modal>
  );
};
