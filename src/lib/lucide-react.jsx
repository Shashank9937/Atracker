import { forwardRef } from 'react';

const Icon = forwardRef(({ children, color = 'currentColor', size = 24, strokeWidth = 2, ...props }, ref) => (
  <svg
    ref={ref}
    fill="none"
    height={size}
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
    width={size}
    {...props}
  >
    {children}
  </svg>
));

const createIcon = (children) =>
  forwardRef((props, ref) => (
    <Icon ref={ref} {...props}>
      {children}
    </Icon>
  ));

export const X = createIcon(
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>,
);

export const Moon = createIcon(<path d="M12 3a7.5 7.5 0 1 0 9 9A9 9 0 1 1 12 3z" />);
export const SunMedium = createIcon(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </>,
);
export const CalendarDays = createIcon(
  <>
    <rect height="16" rx="2" width="18" x="3" y="5" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M3 11h18" />
    <path d="M8 15h.01" />
    <path d="M12 15h.01" />
    <path d="M16 15h.01" />
  </>,
);
export const CalendarClock = createIcon(
  <>
    <rect height="16" rx="2" width="18" x="3" y="5" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M3 11h10" />
    <circle cx="17" cy="17" r="4" />
    <path d="M17 15v2l1.5 1" />
  </>,
);
export const Menu = createIcon(
  <>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </>,
);
export const NotebookPen = createIcon(
  <>
    <path d="M4 5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <path d="M8 3v18" />
    <path d="m14 15 4-4 2 2-4 4-3 1z" />
  </>,
);
export const ScanSearch = createIcon(
  <>
    <path d="M4 8V5a1 1 0 0 1 1-1h3" />
    <path d="M16 4h3a1 1 0 0 1 1 1v3" />
    <path d="M4 16v3a1 1 0 0 0 1 1h3" />
    <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
    <circle cx="11" cy="11" r="3" />
    <path d="m16 16 3 3" />
  </>,
);
export const Activity = createIcon(<path d="M3 12h4l3-7 4 14 3-7h4" />);
export const BookOpen = createIcon(
  <>
    <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3H10a4 4 0 0 1 4 4v14a4 4 0 0 0-4-4H4.5A2.5 2.5 0 0 0 2 19.5z" />
    <path d="M22 5.5A2.5 2.5 0 0 0 19.5 3H14a4 4 0 0 0-4 4v14a4 4 0 0 1 4-4h5.5A2.5 2.5 0 0 1 22 19.5z" />
  </>,
);
export const BookCheck = createIcon(
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 17A2.5 2.5 0 0 0 4 19.5V5a2 2 0 0 1 2-2h10" />
    <path d="m14 9 2 2 4-4" />
  </>,
);
export const BookMarked = createIcon(
  <>
    <path d="M10 2H6a2 2 0 0 0-2 2v16.5A2.5 2.5 0 0 1 6.5 18H20" />
    <path d="M14 2h4a2 2 0 0 1 2 2v16l-4-2-4 2V4a2 2 0 0 1 2-2z" />
  </>,
);
export const BookOpenCheck = createIcon(
  <>
    <path d="M12 7v14a4 4 0 0 0-4-4H3" />
    <path d="M12 7v14a4 4 0 0 1 4-4h5" />
    <path d="M7 3h4a2 2 0 0 1 2 2v2" />
    <path d="m15 11 1.5 1.5L19 10" />
  </>,
);
export const Brain = createIcon(
  <>
    <path d="M9.5 3a3.5 3.5 0 0 0-3.5 3.5V8a2.5 2.5 0 0 0-2 2.5A2.5 2.5 0 0 0 6 13v1a3 3 0 0 0 3 3h1V3z" />
    <path d="M14.5 3A3.5 3.5 0 0 1 18 6.5V8a2.5 2.5 0 0 1 2 2.5A2.5 2.5 0 0 1 18 13v1a3 3 0 0 1-3 3h-1V3z" />
    <path d="M9 10H7" />
    <path d="M15 10h2" />
    <path d="M9 14H7.5" />
    <path d="M15 14h1.5" />
  </>,
);
export const Gauge = createIcon(
  <>
    <path d="M12 15 16 9" />
    <path d="M20 12a8 8 0 1 0-16 0" />
    <path d="M12 19v3" />
  </>,
);
export const Home = createIcon(
  <>
    <path d="m3 10 9-7 9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </>,
);
export const Landmark = createIcon(
  <>
    <path d="m3 10 9-5 9 5" />
    <path d="M4 10h16" />
    <path d="M6 10v8" />
    <path d="M10 10v8" />
    <path d="M14 10v8" />
    <path d="M18 10v8" />
    <path d="M3 20h18" />
  </>,
);
export const Lightbulb = createIcon(
  <>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M8 14a6 6 0 1 1 8 0c-1 1-1.5 2-1.5 3h-5C9.5 16 9 15 8 14z" />
  </>,
);
export const Network = createIcon(
  <>
    <circle cx="5" cy="12" r="2" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="19" cy="19" r="2" />
    <path d="m7 12 10-7" />
    <path d="m7 12 10 7" />
  </>,
);
export const Radar = createIcon(
  <>
    <path d="M12 12 19 5" />
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </>,
);
export const Settings = createIcon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2H9a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1V9a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6z" />
  </>,
);
export const ChevronLeft = createIcon(<path d="m15 18-6-6 6-6" />);
export const ChevronRight = createIcon(<path d="m9 18 6-6-6-6" />);
export const Pause = createIcon(
  <>
    <path d="M10 4H6v16h4z" />
    <path d="M18 4h-4v16h4z" />
  </>,
);
export const Play = createIcon(<path d="m8 5 11 7-11 7z" />);
export const RotateCcw = createIcon(
  <>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 3v6h6" />
  </>,
);
export const RefreshCcw = createIcon(
  <>
    <path d="M3 2v6h6" />
    <path d="M21 12a9 9 0 0 0-15-6.7L3 8" />
    <path d="M21 22v-6h-6" />
    <path d="M3 12a9 9 0 0 0 15 6.7L21 16" />
  </>,
);
export const TimerReset = createIcon(
  <>
    <path d="M10 2h4" />
    <path d="M12 14a4 4 0 1 0-4-4" />
    <path d="M12 6v4l2 2" />
    <path d="M4 8V4h4" />
  </>,
);
export const Sparkles = createIcon(
  <>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
    <path d="m5 16 .8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8z" />
    <path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z" />
  </>,
);
export const ArrowUpRight = createIcon(
  <>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </>,
);
export const Dumbbell = createIcon(
  <>
    <path d="m6 6 12 12" />
    <path d="m4 8 2-2" />
    <path d="m18 20 2-2" />
    <path d="m2 10 4-4" />
    <path d="m18 6 4 4" />
    <path d="m16 4 2 2" />
    <path d="m6 18-4 4" />
  </>,
);
export const HeartPulse = createIcon(
  <>
    <path d="M19.5 13.6 12 21l-7.5-7.4A4.8 4.8 0 0 1 12 7.6a4.8 4.8 0 0 1 7.5 6z" />
    <path d="M3 12h4l2-3 3 6 2-3h7" />
  </>,
);
export const Plus = createIcon(
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>,
);
export const Zap = createIcon(<path d="M13 2 4 14h6l-1 8 9-12h-6z" />);
export const Save = createIcon(
  <>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </>,
);
export const FlaskConical = createIcon(
  <>
    <path d="M10 2v6l-6 10a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 20 18L14 8V2" />
    <path d="M8.5 13h7" />
  </>,
);
export const ArrowDownWideNarrow = createIcon(
  <>
    <path d="M3 5h12" />
    <path d="M3 10h8" />
    <path d="M3 15h4" />
    <path d="m17 17 4 4 4-4" transform="translate(-2 -3)" />
    <path d="M19 6v12" />
  </>,
);
export const Trash2 = createIcon(
  <>
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </>,
);
export const UserPlus = createIcon(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="4" />
    <path d="M19 8v6" />
    <path d="M16 11h6" />
  </>,
);
export const Archive = createIcon(
  <>
    <rect height="5" rx="1" width="18" x="3" y="3" />
    <path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </>,
);
export const Tag = createIcon(
  <>
    <path d="M20 10 10 20 3 13V4h9z" />
    <circle cx="7.5" cy="7.5" r="1" />
  </>,
);
export const ChartNoAxesCombined = createIcon(
  <>
    <path d="M5 5v14h14" />
    <path d="m7 16 4-5 3 2 5-7" />
    <path d="m16 6 3 .5-.5 3" />
  </>,
);
export const Users = createIcon(
  <>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.9" />
    <path d="M16 3.1a4 4 0 0 1 0 7.8" />
  </>,
);
export const Download = createIcon(
  <>
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 21h14" />
  </>,
);
export const UploadCloud = createIcon(
  <>
    <path d="M16 16.5a4.5 4.5 0 1 0-.8-8.9A5.5 5.5 0 0 0 4 9.5a4 4 0 0 0 1 7.9H16z" />
    <path d="M12 12v9" />
    <path d="m8 16 4-4 4 4" />
  </>,
);
export const Keyboard = createIcon(
  <>
    <rect height="12" rx="2" width="20" x="2" y="6" />
    <path d="M6 10h.01" />
    <path d="M10 10h.01" />
    <path d="M14 10h.01" />
    <path d="M18 10h.01" />
    <path d="M6 14h8" />
    <path d="M16 14h2" />
  </>,
);

export const Calendar = createIcon(
  <>
    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </>,
);

export const CheckCircle2 = createIcon(
  <>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </>,
);

export const Clock = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>,
);

export const Flame = createIcon(
  <>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </>,
);

export const Layout = createIcon(
  <>
    <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
    <line x1="3" x2="21" y1="9" y2="9" />
    <line x1="9" x2="9" y1="21" y2="9" />
  </>,
);

export const MessageSquare = createIcon(
  <>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </>,
);

export const Rocket = createIcon(
  <>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.5-1 1-4c1.5 0 3 .5 3 .5L12 11c-1.1 1.1-3 1-3 1z" />
    <path d="M15 6s.5-3 1-4c1 .5 4 1.5 4 1.5l-2.5 3c-1.1 1.1-2.5 1-2.5 1z" />
    <circle cx="15" cy="9" r="2" />
  </>,
);

export const Target = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </>,
);

export const TrendingUp = createIcon(
  <>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </>,
);

export const Wand2 = createIcon(
  <>
    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z" />
    <path d="m14 7 3 3" />
    <path d="M5 6v1" />
    <path d="M11 2v2" />
    <path d="M10 9v2" />
    <path d="M2 11h2" />
    <path d="M14 2h1" />
    <path d="M18 9h2" />
  </>,
);

export const Cpu = createIcon(
  <>
    <rect height="16" rx="2" ry="2" width="16" x="4" y="4" />
    <rect height="6" width="6" x="9" y="9" />
    <line x1="9" x2="9" y1="1" y2="4" />
    <line x1="15" x2="15" y1="1" y2="4" />
    <line x1="9" x2="9" y1="20" y2="23" />
    <line x1="15" x2="15" y1="20" y2="23" />
    <line x1="20" x2="23" y1="9" y2="9" />
    <line x1="20" x2="23" y1="15" y2="15" />
    <line x1="1" x2="4" y1="9" y2="9" />
    <line x1="1" x2="4" y1="15" y2="15" />
  </>,
);

export const Layers = createIcon(
  <>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </>,
);

export const Microscope = createIcon(
  <>
    <path d="M6 18h8" />
    <path d="M3 22h18" />
    <path d="M14 22a7 7 0 1 0 0-14h-1" />
    <path d="M9 14h2" />
    <path d="M9 12a2 2 0 1 1-2-2V6h6v4.1" />
    <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
  </>,
);

export const Terminal = createIcon(
  <>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" x2="20" y1="19" y2="19" />
  </>,
);

export const Variable = createIcon(
  <>
    <path d="M8 21s-4-3-4-9 4-9 4-9" />
    <path d="M16 3s4 3 4 9-4 9-4 9" />
    <line x1="15" x2="9" y1="9" y2="15" />
    <line x1="9" x2="15" y1="9" y2="15" />
  </>,
);

export const Check = createIcon(<polyline points="20 6 9 17 4 12" />);

export const Search = createIcon(
  <>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </>,
);

export const Circle = createIcon(<circle cx="12" cy="12" r="10" />);

export const Trophy = createIcon(
  <>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </>,
);

export const ExternalLink = createIcon(
  <>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </>,
);

export const Globe = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </>,
);

export const Smartphone = createIcon(
  <>
    <rect height="20" rx="2" ry="2" width="14" x="5" y="2" />
    <line x1="12" x2="12" y1="18" y2="18" />
  </>,
);

export const Database = createIcon(
  <>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <path d="M3 12A9 3 0 0 0 21 12" />
  </>,
);
