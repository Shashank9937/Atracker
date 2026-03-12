import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { QUICK_CAPTURE_TYPES } from '../utils/constants';
import { Button } from './Button';
import { Modal } from './Modal';

const placeholders = {
  Note: 'Capture the thought before it disappears...',
  Idea: 'Name the startup idea or wedge...',
  Task: 'What must get done next?',
  Insight: 'What did you just notice or learn?',
  Contact: 'Who should be added to the CRM?',
};

export const QuickCaptureModal = ({ open, onClose, onSave }) => {
  const [type, setType] = useState('Note');
  const [text, setText] = useState('');

  useEffect(() => {
    if (open) {
      setType('Note');
      setText('');
    }
  }, [open]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    onSave({ type, text });
    onClose();
  };

  return (
    <Modal
      description="Quick capture turns fast inputs into notes, ideas, tasks, insights, or contact records."
      onClose={onClose}
      open={open}
      title="Quick Capture"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Capture Type</label>
          <select className="select-control !border-slate-700 !bg-slate-900 !text-slate-100" onChange={(event) => setType(event.target.value)} value={type}>
            {QUICK_CAPTURE_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Capture</label>
          <textarea
            className="textarea-control !border-slate-700 !bg-slate-900 !text-slate-100"
            onChange={(event) => setText(event.target.value)}
            placeholder={placeholders[type]}
            value={text}
          />
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">
            <Sparkles className="h-4 w-4" />
            Save Capture
          </Button>
        </div>
      </form>
    </Modal>
  );
};
