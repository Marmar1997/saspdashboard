// Line icons — slightly rounded, currentColor
const Icon = ({ d, size=18, stroke=1.6, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={stroke}
       strokeLinecap="round" strokeLinejoin="round" {...props}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const Icons = {
  Logo: (p) => (
    <svg width={p.size||22} height={p.size||22} viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8 14.5c1.2 1.2 2.6 1.7 4 1.7 2.5 0 4-1.4 4-3 0-3.4-7.6-1.6-7.6-5 0-1.5 1.4-2.7 3.6-2.7 1.4 0 2.7.5 3.6 1.4"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Sources:    (p) => <Icon {...p} d={<><path d="M4 7c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"/><path d="M4 17c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v0Z"/><circle cx="8" cy="8.5" r="1"/><circle cx="8" cy="17" r="1"/></>} />,
  Portfolio: (p) => <Icon {...p} d={<><rect x="3.5" y="6.5" width="17" height="13" rx="2"/><path d="M9 6.5V5.2A1.7 1.7 0 0 1 10.7 3.5h2.6A1.7 1.7 0 0 1 15 5.2v1.3"/><path d="M3.5 11.5h17"/></>} />,
  Audiences: (p) => <Icon {...p} d={<><circle cx="9" cy="9" r="3.2"/><circle cx="17" cy="11" r="2.4"/><path d="M3 19c.5-2.5 3-4 6-4s5.5 1.5 6 4"/><path d="M14 17.5c.4-1.6 1.8-2.5 3.5-2.5 1.5 0 2.7.7 3.2 2"/></>} />,
  Simulator: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="8"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/><path d="M12 12 15.5 8.5"/></>} />,
  Refresh:   (p) => <Icon {...p} d={<><path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/></>} />,
  Plus:      (p) => <Icon {...p} d="M12 5v14M5 12h14" />,
  Check:     (p) => <Icon {...p} d="M5 12.5l4.5 4.5L19 7" />,
  X:         (p) => <Icon {...p} d="M6 6l12 12M18 6L6 18" />,
  Chevron:   (p) => <Icon {...p} d="M6 9l6 6 6-6" />,
  ArrowRight:(p) => <Icon {...p} d="M5 12h14M13 6l6 6-6 6" />,
  Search:    (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/></>} />,
  Filter:    (p) => <Icon {...p} d="M4 5h16M7 12h10M10 19h4" />,
  Spark:     (p) => <Icon {...p} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />,
  External:  (p) => <Icon {...p} d={<><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></>} />,
  Reddit:    (p) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="13" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="9.2" cy="13.4" r="1.1"/>
      <circle cx="14.8" cy="13.4" r="1.1"/>
      <path d="M8.5 16.2c1 .9 2.2 1.3 3.5 1.3s2.5-.4 3.5-1.3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="17.5" cy="6.5" r="1.4"/>
      <path d="M12 9.5l1.5-3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  X_logo:    (p) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 3H21l-6.522 7.452L22 21h-6.063l-4.747-6.21L5.7 21H3l7-7.99L2.5 3h6.21l4.29 5.67L18.244 3Zm-1.063 16.2h1.49L7.91 4.7H6.31l10.871 14.5Z"/>
    </svg>
  ),
  LinkedIn:  (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.4 9h2.6v9.2H5.4V9Zm1.3-4.1a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 0 1 0-3.1ZM10.2 9h2.5v1.26h.04c.35-.66 1.2-1.36 2.47-1.36 2.64 0 3.13 1.74 3.13 4v5.3H15.8v-4.7c0-1.12-.02-2.56-1.56-2.56-1.56 0-1.8 1.22-1.8 2.48v4.78H10.2V9Z"/>
    </svg>
  ),
  Drive:     (p) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M9 3h6l6 10-3 5H6L3 13 9 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 3 3 13M15 3l6 10M6 18l3-5h12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  Globe:     (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>} />,
  Cloud:     (p) => <Icon {...p} d="M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 8.5 4 4 0 0 1 17 18H7Z" />,
  Upload:    (p) => <Icon {...p} d={<><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 20h14"/></>} />,
  Bolt:      (p) => <Icon {...p} d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />,
  Eye:       (p) => <Icon {...p} d={<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>} />,
  EyeOff:    (p) => <Icon {...p} d={<><path d="m3 3 18 18"/><path d="M10.6 6.1A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a14 14 0 0 1-3.4 4.1M6.6 6.6A14 14 0 0 0 2 12s3.5 6 10 6c1.4 0 2.7-.3 3.9-.7"/></>} />,
  Pin:       (p) => <Icon {...p} d="M12 2v6l3 4-3 4-3-4 3-4V2zM12 16v6" />,
};

window.Icons = Icons;
