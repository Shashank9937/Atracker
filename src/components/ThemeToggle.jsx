import { Moon, SunMedium } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const ThemeToggle = () => {
  const {
    data: { settings },
    updateSettings,
  } = useAppContext();

  const darkMode = settings.theme === 'dark';

  return (
    <button
      className="secondary-button !rounded-full !px-3"
      onClick={() => updateSettings({ theme: darkMode ? 'light' : 'dark' })}
      type="button"
    >
      {darkMode ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{darkMode ? 'Light' : 'Dark'}</span>
    </button>
  );
};
