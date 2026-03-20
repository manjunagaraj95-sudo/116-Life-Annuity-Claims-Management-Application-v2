import { useState, useCallback } from "react";
import './App.css';

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const ROLES = {
  EXEC: { label: 'Executive', icon: '👔', color: 'avatar-purple' },
  SUPERVISOR: { label: 'Supervisor', icon: '🧑‍💼', color: 'avatar-blue' },
  EXAMINER: { label: 'Claims Examiner', icon: '🔍', color: 'avatar-teal' },
  INTAKE: { label: 'Intake Specialist', icon: '📥', color: 'avatar-green' },
  FINANCE: { label: 'Finance Officer', icon: '💰', color: 'avatar-orange' },
  COMPLIANCE: { label: 'Compliance Reviewer', icon: '🛡️', color: 'avatar-red' },
  AGENT: { label: 'Call Center Agent', icon: '📞', color: 'avatar-blue' },
  ADMIN: { label: 'Operations Admin', icon: '⚙️', color: 'avatar-purple' },
};

const CLAIM_STATUSES = {
  DRAFT: { label: 'Draft', chip: 'chip-gray' },
  SUBMITTED: { label: 'Submitted', chip: 'chip-blue' },
  INTAKE_REVIEW: { label: 'Intake Review', chip: 'chip-blue' },
  DOCS_PENDING: { label: 'Docs Pending', chip: 'chip-orange' },
  UNDER_REVIEW: { label: 'Under Review', chip: 'chip-blue' },
  ADJUDICATION: { label: 'Adjudication', chip: 'chip-purple' },
  PENDING_APPROVAL: { label: 'Pending Approval', chip: 'chip-orange' },
  COMPLIANCE_REVIEW: { label: 'Compliance Review', chip: 'chip-purple' },
  APPROVED: { label: 'Approved', chip: 'chip-green' },
  PAYMENT_PENDING: { label: 'Payment Pending', chip: 'chip-orange' },
  PAID: { label: 'Paid', chip: 'chip-green' },
  REJECTED: { label: 'Rejected', chip: 'chip-red' },
  ON_HOLD: { label: 'On Hold', chip: 'chip-orange' },
  REOPENED: { label: 'Reopened', chip: 'chip-purple' },
  CLOSED: { label: 'Closed', chip: 'chip-gray' },
};

const CLAIMS = [
  { id: 'CLM-2024-00891', policy: 'POL-LI-448291', type: 'Life Death Claim', insured: 'Margaret T. Williams', claimant: 'Robert Williams', amount: 500000, status: 'PENDING_APPROVAL', risk: 'HIGH', sla: 'WARN', examiner: 'Sarah Chen', submitted: '2024-11-12', daysOpen: 18, state: 'TX', product: 'Term Life 20', channel: 'Portal', flagged: true, priority: 'HIGH' },
  { id: 'CLM-2024-00892', policy: 'POL-ANN-221087', type: 'Annuity Withdrawal', insured: 'James A. Foster', claimant: 'James A. Foster', amount: 75000, status: 'UNDER_REVIEW', risk: 'LOW', sla: 'OK', examiner: 'David Kim', submitted: '2024-11-20', daysOpen: 10, state: 'CA', product: 'Fixed Annuity Plus', channel: 'Agent', flagged: false, priority: 'MED' },
  { id: 'CLM-2024-00893', policy: 'POL-LI-391045', type: 'Accidental Death Benefit', insured: 'Priya N. Sharma', claimant: 'Anish Sharma', amount: 1000000, status: 'COMPLIANCE_REVIEW', risk: 'HIGH', sla: 'BREACH', examiner: 'Mike Torres', submitted: '2024-11-05', daysOpen: 25, state: 'NY', product: 'Whole Life Premier', channel: 'Portal', flagged: true, priority: 'HIGH' },
  { id: 'CLM-2024-00894', policy: 'POL-ANN-118734', type: 'Annuity Maturity Payout', insured: 'Harold R. Simmons', claimant: 'Harold R. Simmons', amount: 245000, status: 'PAYMENT_PENDING', risk: 'LOW', sla: 'OK', examiner: 'Lisa Wang', submitted: '2024-11-15', daysOpen: 15, state: 'FL', product: 'Deferred Annuity Classic', channel: 'Agent', flagged: false, priority: 'LOW' },
  { id: 'CLM-2024-00895', policy: 'POL-LI-507612', type: 'Terminal Illness Benefit', insured: 'Dorothy K. Nguyen', claimant: 'Dorothy K. Nguyen', amount: 125000, status: 'DOCS_PENDING', risk: 'MED', sla: 'WARN', examiner: 'Sarah Chen', submitted: '2024-11-18', daysOpen: 12, state: 'WA', product: 'Universal Life Gold', channel: 'Phone', flagged: false, priority: 'MED' },
  { id: 'CLM-2024-00896', policy: 'POL-LI-334891', type: 'Beneficiary Claim', insured: 'Carlos E. Martinez', claimant: 'Elena Martinez', amount: 300000, status: 'APPROVED', risk: 'LOW', sla: 'OK', examiner: 'David Kim', submitted: '2024-11-01', daysOpen: 29, state: 'AZ', product: 'Term Life 30', channel: 'Portal', flagged: false, priority: 'LOW' },
  { id: 'CLM-2024-00897', policy: 'POL-ANN-445023', type: 'Surrender Claim', insured: 'Patricia L. Johnson', claimant: 'Patricia L. Johnson', amount: 88000, status: 'ADJUDICATION', risk: 'MED', sla: 'WARN', examiner: 'Mike Torres', submitted: '2024-11-22', daysOpen: 8, state: 'GA', product: 'Variable Annuity Pro', channel: 'Agent', flagged: false, priority: 'MED' },
  { id: 'CLM-2024-00898', policy: 'POL-LI-219945', type: 'Rider Benefit Claim', insured: 'Thomas B. Clark', claimant: 'Susan Clark', amount: 50000, status: 'REJECTED', risk: 'MED', sla: 'OK', examiner: 'Lisa Wang', submitted: '2024-10-28', daysOpen: 33, state: 'OH', product: 'Term Life 20', channel: 'Portal', flagged: false, priority: 'LOW' },
  { id: 'CLM-2024-00899', policy: 'POL-LI-671234', type: 'Life Death Claim', insured: 'Angela M. Brooks', claimant: 'Marcus Brooks', amount: 750000, status: 'INTAKE_REVIEW', risk: 'HIGH', sla: 'OK', examiner: 'Sarah Chen', submitted: '2024-11-28', daysOpen: 2, state: 'IL', product: 'Whole Life Premier', channel: 'Portal', flagged: true, priority: 'HIGH' },
  { id: 'CLM-2024-00900', policy: 'POL-ANN-091234', type: 'Annuity Withdrawal', insured: 'Richard F. Patel', claimant: 'Richard F. Patel', amount: 42000, status: 'PAID', risk: 'LOW', sla: 'OK', examiner: 'David Kim', submitted: '2024-10-20', daysOpen: 40, state: 'NJ', product: 'Fixed Annuity Plus', channel: 'Online', flagged: false, priority: 'LOW' },
];

const DOCUMENTS = [
  { id: 'doc1', name: 'Death Certificate', category: 'Primary', status: 'ACCEPTED', format: 'PDF', size: '2.1 MB', uploaded: '2024-11-13', icon: '📄' },
  { id: 'doc2', name: 'Claimant ID Proof', category: 'Identity', status: 'ACCEPTED', format: 'JPG', size: '850 KB', uploaded: '2024-11-13', icon: '🪪' },
  { id: 'doc3', name: 'Policy Document Copy', category: 'Policy', status: 'ACCEPTED', format: 'PDF', size: '3.4 MB', uploaded: '2024-11-14', icon: '📋' },
  { id: 'doc4', name: 'Bank Account Proof', category: 'Payment', status: 'PENDING', format: 'PDF', size: '1.2 MB', uploaded: '2024-11-15', icon: '🏦' },
  { id: 'doc5', name: 'Beneficiary Proof', category: 'Beneficiary', status: 'REJECTED', format: 'PDF', size: '0.9 MB', uploaded: '2024-11-14', icon: '👥' },
  { id: 'doc6', name: 'Medical Report', category: 'Medical', status: 'PENDING', format: 'PDF', size: '5.7 MB', uploaded: null, icon: '🏥' },
];

const AUDIT_TRAIL = [
  { id: 'a1', action: 'Claim Submitted via Customer Portal', user: 'Robert Williams (Claimant)', role: 'External', time: 'Nov 12, 2024 09:14 AM', icon: '📤', color: 'chip-blue', note: 'Initial submission with 3 documents uploaded.' },
  { id: 'a2', action: 'Claim Assigned to Intake Queue', user: 'System Auto-Router', role: 'System', time: 'Nov 12, 2024 09:14 AM', icon: '🤖', color: 'chip-gray' },
  { id: 'a3', action: 'Intake Review Started', user: 'Jennifer Adams', role: 'Intake Specialist', time: 'Nov 12, 2024 10:30 AM', icon: '👁️', color: 'chip-blue' },
  { id: 'a4', action: 'AML/Sanctions Check Triggered', user: 'Compliance System', role: 'System', time: 'Nov 12, 2024 10:32 AM', icon: '🛡️', color: 'chip-orange', note: 'High-value claim >$250K — mandatory AML screening initiated.' },
  { id: 'a5', action: 'Assigned to Senior Examiner', user: 'Jennifer Adams', role: 'Intake Specialist', time: 'Nov 12, 2024 02:15 PM', icon: '👤', color: 'chip-blue', note: 'Assigned to Sarah Chen due to high-value flag and complex beneficiary structure.' },
  { id: 'a6', action: 'Additional Documents Requested', user: 'Sarah Chen', role: 'Claims Examiner', time: 'Nov 14, 2024 11:00 AM', icon: '📎', color: 'chip-orange', note: 'Requested updated beneficiary proof and original bank statement.' },
  { id: 'a7', action: 'Risk Score Updated to HIGH', user: 'Risk Engine v2.1', role: 'System', time: 'Nov 15, 2024 08:00 AM', icon: '⚠️', color: 'chip-red', note: 'Fraud indicators detected: beneficiary address mismatch, contestability period check.' },
  { id: 'a8', action: 'Escalated to Compliance Review', user: 'Sarah Chen', role: 'Claims Examiner', time: 'Nov 16, 2024 03:45 PM', icon: '📈', color: 'chip-purple', note: 'Escalated per protocol for high-value claims with fraud risk score >70.' },
  { id: 'a9', action: 'Compliance Review In Progress', user: 'Mark Ellison', role: 'Compliance Reviewer', time: 'Nov 18, 2024 09:00 AM', icon: '🔬', color: 'chip-purple' },
  { id: 'a10', action: 'Pending L3 Approval', user: 'Mark Ellison', role: 'Compliance Reviewer', time: 'Nov 28, 2024 04:30 PM', icon: '⏳', color: 'chip-orange', note: 'All checks cleared. Forwarded for Senior Manager approval.' },
];

const NOTIFICATIONS = [
  { id: 'n1', title: 'SLA Breach Alert', body: 'CLM-2024-00893 has breached 25-day SLA. Immediate action required.', time: '10 min ago', icon: '🚨', bg: 'accent-red-light', unread: true },
  { id: 'n2', title: 'New Claim Assigned', body: 'CLM-2024-00899 assigned to your queue — High value Life Death Claim.', time: '1 hr ago', icon: '📋', bg: 'accent-blue-light', unread: true },
  { id: 'n3', title: 'Document Received', body: 'Claimant Robert Williams uploaded Bank Proof for CLM-2024-00891.', time: '2 hrs ago', icon: '📎', bg: 'accent-green-light', unread: true },
  { id: 'n4', title: 'Approval Pending', body: 'CLM-2024-00891 awaiting your L3 approval. 48hr deadline approaching.', time: '3 hrs ago', icon: '✅', bg: 'accent-orange-light', unread: false },
  { id: 'n5', title: 'Compliance Cleared', body: 'CLM-2024-00896 passed all AML checks and is approved for payout.', time: 'Yesterday', icon: '🛡️', bg: 'accent-purple-light', unread: false },
  { id: 'n6', title: 'Payment Processed', body: '$245,000 disbursed for CLM-2024-00894 to account ending 4521.', time: 'Yesterday', icon: '💳', bg: 'accent-teal-light', unread: false },
];

const USERS = [
  { id: 'u1', name: 'Sarah Chen', role: 'EXAMINER', avatar: 'SC', queue: 8, resolved: 42, color: 'avatar-teal' },
  { id: 'u2', name: 'David Kim', role: 'EXAMINER', avatar: 'DK', queue: 6, resolved: 38, color: 'avatar-blue' },
  { id: 'u3', name: 'Mike Torres', role: 'EXAMINER', avatar: 'MT', queue: 10, resolved: 29, color: 'avatar-orange' },
  { id: 'u4', name: 'Lisa Wang', role: 'EXAMINER', avatar: 'LW', queue: 5, resolved: 55, color: 'avatar-green' },
  { id: 'u5', name: 'Jennifer Adams', role: 'INTAKE', avatar: 'JA', queue: 12, resolved: 67, color: 'avatar-purple' },
  { id: 'u6', name: 'Mark Ellison', role: 'COMPLIANCE', avatar: 'ME', queue: 4, resolved: 18, color: 'avatar-red' },
];

const DOC_CHECKLIST = {
  'Life Death Claim': ['Death Certificate', 'Claimant ID Proof', 'Policy Document Copy', 'Bank Account Proof', 'Beneficiary Proof', 'Legal Heir Certificate'],
  'Annuity Withdrawal': ['Withdrawal Request Form', 'Claimant ID Proof', 'Bank Account Proof', 'Annuity Contract'],
  'Accidental Death Benefit': ['Death Certificate', 'Police/Accident Report', 'Post-Mortem Report', 'Claimant ID Proof', 'Policy Document Copy', 'Bank Account Proof'],
  'Terminal Illness Benefit': ['Medical Diagnosis Report', 'Physician Statement', 'Claimant ID Proof', 'Policy Document Copy'],
  'Surrender Claim': ['Surrender Request Form', 'Claimant ID Proof', 'Policy Document Copy', 'Bank Account Proof', 'Tax Declaration Form'],
};

const APPROVAL_MATRIX = [
  { level: 1, role: 'Claims Examiner', threshold: 'Up to $50,000', user: 'Sarah Chen', status: 'approved', time: 'Nov 27, 2024 02:00 PM', note: 'Documentation complete, eligibility confirmed.' },
  { level: 2, role: 'Supervisor', threshold: '$50K – $500K', user: 'Rachel Park', status: 'approved', time: 'Nov 27, 2024 05:30 PM', note: 'Reviewed and endorsed. No exceptions noted.' },
  { level: 3, role: 'Senior Manager', threshold: '$500K+', user: 'James Thornton', status: 'pending', time: null, note: null },
  { level: 4, role: 'Finance / Compliance', threshold: 'High-Risk / Exception', user: 'Mark Ellison', status: 'waiting', time: null, note: null },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => n?.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
const getStatusChip = (s) => CLAIM_STATUSES[s] || { label: s, chip: 'chip-gray' };
const getRiskChip = (r) => ({ HIGH: 'chip-red', MED: 'chip-orange', LOW: 'chip-green' })[r] || 'chip-gray';
const getSlaChip = (s) => ({ OK: 'sla-ok', WARN: 'sla-warn', BREACH: 'sla-breach' })[s] || 'sla-ok';
const getSlaLabel = (s) => ({ OK: '✓ On Track', WARN: '⚡ Nearing SLA', BREACH: '🔴 SLA Breached' })[s];
const getPriorityClass = (p) => ({ HIGH: 'priority-high', MED: 'priority-med', LOW: 'priority-low' })[p];
const getDocStatusChip = (s) => ({ ACCEPTED: 'chip-green', PENDING: 'chip-orange', REJECTED: 'chip-red' })[s] || 'chip-gray';

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
const Chip = ({ label, cls, dot = true }) => (
  <span className={`chip ${cls}`}>{dot && <span className="chip-dot" />}{label}</span>
);

const KpiCard = ({ icon, label, value, trend, trendLabel, accent, iconBg, onClick }) => (
  <div className="kpi-card card-clickable" onClick={onClick}>
    <div className="kpi-card-accent accent-line" style={{ background: accent }} />
    <div className="kpi-card-icon" style={{ background: iconBg + '22' }}>{icon}</div>
    <div className="kpi-card-label">{label}</div>
    <div className="kpi-card-value">{value}</div>
    <div className="kpi-card-meta">
      <span className={`kpi-card-trend ${trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-neutral'}`}>
        {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendLabel}
      </span>
    </div>
  </div>
);

const Topbar = ({ breadcrumb, onNotif, notifCount, currentUser }) => (
  <div className="topbar">
    <div className="topbar-breadcrumb">
      {breadcrumb.map((b, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <span className="topbar-breadcrumb-sep">›</span>}
          <span className={i === breadcrumb.length - 1 ? 'topbar-breadcrumb-active' : ''}>{b}</span>
        </span>
      ))}
    </div>
    <div className="topbar-actions">
      <div className="topbar-search">
        <span>🔍</span>
        <input placeholder="Search claims, policies, claimants..." />
      </div>
      <button className="btn btn-secondary btn-icon" style={{ position: 'relative' }} onClick={onNotif}>
        🔔
        {notifCount > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, background: '#DC2626', color: '#FFF', fontSize: 9, fontWeight: 700, borderRadius: 999, minWidth: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>{notifCount}</span>
        )}
      </button>
      <div className={`avatar avatar-md ${ROLES[currentUser]?.color || 'avatar-blue'}`} title={ROLES[currentUser]?.label}>
        {ROLES[currentUser]?.icon}
      </div>
    </div>
  </div>
);

const Sidebar = ({ currentUser, view, setView }) => {
  const navItems = [
    { section: 'Main', items: [
      { key: 'DASHBOARD', icon: '🏠', label: 'Dashboard' },
      { key: 'CLAIMS_LIST', icon: '📋', label: 'All Claims', badge: CLAIMS.filter(c => c.status !== 'CLOSED' && c.status !== 'PAID').length },
      { key: 'NEW_CLAIM', icon: '➕', label: 'New Claim' },
      { key: 'WORK_QUEUE', icon: '📥', label: 'Work Queue', badge: 14 },
    ]},
    { section: 'Review', items: [
      { key: 'APPROVAL_QUEUE', icon: '✅', label: 'Approvals', badge: 3 },
      { key: 'DOCUMENTS', icon: '📂', label: 'Documents' },
      { key: 'COMPLIANCE', icon: '🛡️', label: 'Compliance' },
      { key: 'EXCEPTIONS', icon: '⚠️', label: 'Exceptions', badge: 5 },
    ]},
    { section: 'Finance', items: [
      { key: 'DISBURSEMENTS', icon: '💳', label: 'Disbursements' },
      { key: 'BENEFIT_CALC', icon: '🧮', label: 'Benefit Calculator' },
    ]},
    { section: 'Analytics', items: [
      { key: 'ANALYTICS', icon: '📊', label: 'Reports & Analytics' },
      { key: 'SLA_MONITOR', icon: '⏱️', label: 'SLA Monitor' },
      { key: 'AUDIT_LOG', icon: '📜', label: 'Audit Log' },
    ]},
    { section: 'Admin', items: [
      { key: 'NOTIFICATIONS', icon: '🔔', label: 'Notifications', badge: NOTIFICATIONS.filter(n => n.unread).length },
      { key: 'CONFIG', icon: '⚙️', label: 'Configuration' },
      { key: 'USER_MGMT', icon: '👥', label: 'User Management' },
    ]},
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🛡️</div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-title">LifeShield Claims</div>
          <div className="sidebar-logo-sub">Enterprise Platform</div>
        </div>
      </div>
      {navItems.map(section => (
        <div className="sidebar-section" key={section.section}>
          <div className="sidebar-section-label">{section.section}</div>
          {section.items.map(item => (
            <button key={item.key} className={`sidebar-item ${view.screen === item.key || (item.key === 'CLAIMS_LIST' && view.screen === 'CLAIM_DETAIL') ? 'active' : ''}`}
              onClick={() => setView({ screen: item.key, params: {} })}>
              <span className="sidebar-item-icon">{item.icon}</span>
              {item.label}
              {item.badge ? <span className={`sidebar-item-badge ${item.key === 'WORK_QUEUE' ? 'sidebar-badge-blue' : ''}`}>{item.badge}</span> : null}
            </button>
          ))}
        </div>
      ))}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className={`sidebar-avatar ${ROLES[currentUser]?.color || 'avatar-blue'}`}>{ROLES[currentUser]?.icon}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser === 'EXEC' ? 'Alexandra Stone' : currentUser === 'EXAMINER' ? 'Sarah Chen' : 'Admin User'}</div>
            <div className="sidebar-user-role">{ROLES[currentUser]?.label}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
const DonutChart = ({ data, size = 160 }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 60, cx = size / 2, cy = size / 2, circ = 2 * Math.PI * r;
  const segments = data.map(d => {
    const pct = d.value / total;
    const len = pct * circ;
    const seg = { ...d, offset: offset * circ, len };
    offset += pct;
    return seg;
  });
  return (
    <div className="chart-donut" style={{ position: 'relative', display: 'inline-flex' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-svg">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E2E8F0" strokeWidth="20" />
        {segments.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color}
            strokeWidth="20" strokeDasharray={`${s.len} ${circ - s.len}`}
            strokeDashoffset={-s.offset} strokeLinecap="butt" />
        ))}
      </svg>
      <div className="donut-center">
        <div className="donut-value">{total}</div>
        <div className="donut-label">Total</div>
      </div>
    </div>
  );
};

// ─── MILESTONE TRACKER ───────────────────────────────────────────────────────
const MilestoneTracker = ({ steps, currentStep }) => (
  <div className="milestone-track">
    {steps.map((s, i) => {
      const isDone = i < currentStep;
      const isActive = i === currentStep;
      return (
        <div key={i} className={`milestone-step ${isDone ? 'done' : isActive ? 'active' : ''}`}>
          <div className={`milestone-dot ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
            {isDone ? '✓' : i + 1}
          </div>
          <div className={`milestone-label ${isDone ? 'done' : isActive ? 'active' : ''}`}>{s}</div>
        </div>
      );
    })}
  </div>
);

// ─── SCREENS ──────────────────────────────────────────────────────────────────

// LOGIN
const LoginScreen = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('EXEC');
  const roles = Object.entries(ROLES);
  return (
    <div className="login-bg">
      <div className="login-card animate-in">
        <div className="login-logo">
          <div className="login-logo-icon">🛡️</div>
          <div className="login-title">LifeShield Claims Portal</div>
          <div className="login-sub">Enterprise Life & Annuity Claims Management</div>
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" defaultValue="admin@lifeshield.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" defaultValue="••••••••••" />
        </div>
        <div className="form-group">
          <label className="form-label">Sign in as</label>
          <div className="role-grid">
            {roles.map(([key, r]) => (
              <div key={key} className={`role-option ${selectedRole === key ? 'selected' : ''}`}
                onClick={() => setSelectedRole(key)}>
                {r.icon} {r.label}
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-primary w-full btn-lg" onClick={() => onLogin(selectedRole)}>
          Sign In to Portal →
        </button>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#94A3B8' }}>
          SSO / SAML 2.0 supported · MFA enabled · v4.2.1-prod
        </div>
      </div>
    </div>
  );
};

// EXECUTIVE DASHBOARD
const ExecDashboard = ({ setView }) => {
  const claimsByType = [
    { label: 'Life Death', value: 38, color: '#1D4ED8' },
    { label: 'Annuity Withdrawal', value: 25, color: '#059669' },
    { label: 'ADB Claim', value: 12, color: '#DC2626' },
    { label: 'Maturity Payout', value: 18, color: '#D97706' },
    { label: 'Surrender', value: 7, color: '#7C3AED' },
  ];
  return (
    <div className="animate-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <div className="page-title">Executive Overview</div>
          <div className="page-subtitle">Life & Annuity Claims · November 2024 · All Regions</div>
        </div>
        <div className="flex gap-sm">
          <button className="btn btn-secondary">📅 Date Range</button>
          <button className="btn btn-secondary">⬇ Export</button>
          <button className="btn btn-primary">🔄 Refresh</button>
        </div>
      </div>

      <div className="kpi-grid kpi-grid-4 mb-lg">
        <KpiCard icon="📋" label="Total Claims (MTD)" value="1,247" trend="up" trendLabel="+8.2% vs Oct" accent="#1D4ED8" iconBg="#1D4ED8" onClick={() => setView({ screen: 'CLAIMS_LIST', params: {} })} />
        <KpiCard icon="⏳" label="Open Claims" value="389" trend="down" trendLabel="-3.1% vs Oct" accent="#D97706" iconBg="#D97706" onClick={() => setView({ screen: 'CLAIMS_LIST', params: { statusFilter: 'open' } })} />
        <KpiCard icon="✅" label="Approved Claims" value="742" trend="up" trendLabel="+12.4% vs Oct" accent="#059669" iconBg="#059669" onClick={() => setView({ screen: 'CLAIMS_LIST', params: {} })} />
        <KpiCard icon="💰" label="Total Payout (MTD)" value="$84.2M" trend="up" trendLabel="+6.7% vs Oct" accent="#7C3AED" iconBg="#7C3AED" onClick={() => setView({ screen: 'DISBURSEMENTS', params: {} })} />
      </div>

      <div className="kpi-grid kpi-grid-4 mb-xl">
        <KpiCard icon="⚡" label="Avg TAT (Days)" value="11.4" trend="down" trendLabel="Target: 15d" accent="#0D9488" iconBg="#0D9488" onClick={() => setView({ screen: 'ANALYTICS', params: {} })} />
        <KpiCard icon="🤖" label="STP Rate" value="62%" trend="up" trendLabel="+4pts vs Oct" accent="#4338CA" iconBg="#4338CA" onClick={() => setView({ screen: 'ANALYTICS', params: {} })} />
        <KpiCard icon="🚨" label="SLA Breaches" value="8" trend="up" trendLabel="+2 this week" accent="#DC2626" iconBg="#DC2626" onClick={() => setView({ screen: 'SLA_MONITOR', params: {} })} />
        <KpiCard icon="🛡️" label="Flagged / Fraud" value="23" trend="up" trendLabel="Under review" accent="#DB2777" iconBg="#DB2777" onClick={() => setView({ screen: 'COMPLIANCE', params: {} })} />
      </div>

      <div className="two-col mb-xl">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Claims by Type</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setView({ screen: 'ANALYTICS', params: {} })}>View Report →</button>
          </div>
          <div className="card-body flex gap-xl items-center">
            <DonutChart data={claimsByType} size={160} />
            <div className="flex-1">
              <div className="legend flex-col gap-sm">
                {claimsByType.map((d, i) => (
                  <div key={i} className="bar-chart-row">
                    <div className="bar-chart-label flex items-center gap-sm"><span className="legend-dot" style={{ background: d.color }} />{d.label}</div>
                    <div className="bar-chart-track"><div className="bar-chart-fill" style={{ width: `${(d.value / 100) * 100}%`, background: d.color }} /></div>
                    <div className="bar-chart-val">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Payout by Amount Band</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setView({ screen: 'DISBURSEMENTS', params: {} })}>Finance View →</button>
          </div>
          <div className="card-body">
            {[
              { label: '<$50K', count: 312, pct: 75, color: '#059669' },
              { label: '$50K–$250K', count: 198, pct: 58, color: '#1D4ED8' },
              { label: '$250K–$1M', count: 87, pct: 34, color: '#D97706' },
              { label: '$1M+', count: 23, pct: 12, color: '#DC2626' },
            ].map((b, i) => (
              <div key={i} className="bar-chart-row" style={{ marginBottom: 14 }}>
                <div className="bar-chart-label">{b.label}</div>
                <div className="bar-chart-track" style={{ height: 12 }}><div className="bar-chart-fill" style={{ width: `${b.pct}%`, background: b.color, height: 12, borderRadius: 6 }} /></div>
                <div className="bar-chart-val">{b.count}</div>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 12 }}>
              {[['Approved', '742', '#059669'], ['Rejected', '116', '#DC2626'], ['Pending', '389', '#D97706'], ['On Hold', '0', '#94A3B8']].map(([l, v, c]) => (
                <div key={l} className="stat-mini">
                  <div className="stat-mini-value" style={{ color: c }}>{v}</div>
                  <div className="stat-mini-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-xl">
        <div className="card-header">
          <div className="card-title">SLA Performance by Region</div>
          <div className="flex gap-sm">
            <span className="chip chip-green"><span className="chip-dot" />On Track (89%)</span>
            <span className="chip chip-orange"><span className="chip-dot" />At Risk (7%)</span>
            <span className="chip chip-red"><span className="chip-dot" />Breached (4%)</span>
          </div>
        </div>
        <div className="card-body">
          {[['TX – Southwest', 96, '#059669'], ['CA – Pacific', 91, '#059669'], ['NY – Northeast', 87, '#1D4ED8'], ['FL – Southeast', 94, '#059669'], ['IL – Midwest', 78, '#D97706']].map(([r, v, c]) => (
            <div key={r} className="bar-chart-row" style={{ marginBottom: 12 }}>
              <div className="bar-chart-label">{r}</div>
              <div className="bar-chart-track"><div className="bar-chart-fill" style={{ width: `${v}%`, background: c }} /></div>
              <div className="bar-chart-val">{v}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent High-Value Claims</div>
          <button className="btn btn-primary btn-sm" onClick={() => setView({ screen: 'CLAIMS_LIST', params: {} })}>View All Claims</button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>Claim ID</th><th>Insured</th><th>Type</th><th>Amount</th><th>Status</th><th>Risk</th><th>SLA</th><th>Examiner</th></tr>
            </thead>
            <tbody>
              {CLAIMS.filter(c => c.amount >= 75000).slice(0, 6).map(c => (
                <tr key={c.id} className="clickable-row" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } })}>
                  <td><span className="table-claim-id">{c.id}</span></td>
                  <td><span className="table-name">{c.insured}</span></td>
                  <td>{c.type}</td>
                  <td><span className="table-amount">{fmt(c.amount)}</span></td>
                  <td><Chip label={getStatusChip(c.status).label} cls={getStatusChip(c.status).chip} /></td>
                  <td><Chip label={c.risk} cls={getRiskChip(c.risk)} /></td>
                  <td><span className={`sla-pill ${getSlaChip(c.sla)}`}>{getSlaLabel(c.sla)}</span></td>
                  <td>{c.examiner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// SUPERVISOR DASHBOARD
const SupervisorDashboard = ({ setView }) => (
  <div className="animate-in">
    <div className="page-header flex items-center justify-between">
      <div>
        <div className="page-title">Supervisor Dashboard</div>
        <div className="page-subtitle">Team Performance & Queue Management</div>
      </div>
      <button className="btn btn-primary" onClick={() => setView({ screen: 'WORK_QUEUE', params: {} })}>📥 Manage Queue</button>
    </div>
    <div className="kpi-grid kpi-grid-4 mb-lg">
      <KpiCard icon="👥" label="Team Open Claims" value="39" trend="neutral" trendLabel="4 examiners" accent="#1D4ED8" iconBg="#1D4ED8" />
      <KpiCard icon="⏳" label="Pending Approvals" value="7" trend="up" trendLabel="+3 today" accent="#D97706" iconBg="#D97706" onClick={() => setView({ screen: 'APPROVAL_QUEUE', params: {} })} />
      <KpiCard icon="🚨" label="Escalated Cases" value="3" trend="up" trendLabel="Needs action" accent="#DC2626" iconBg="#DC2626" />
      <KpiCard icon="📈" label="Avg Resolution" value="9.2d" trend="down" trendLabel="vs 11.4d target" accent="#059669" iconBg="#059669" />
    </div>
    <div className="col-8-4">
      <div className="card">
        <div className="card-header"><div className="card-title">Examiner Workload</div></div>
        <table className="data-table">
          <thead><tr><th>Examiner</th><th>Active Queue</th><th>Resolved MTD</th><th>Avg Days</th><th>SLA Health</th></tr></thead>
          <tbody>
            {USERS.filter(u => u.role === 'EXAMINER').map(u => (
              <tr key={u.id}>
                <td><div className="flex items-center gap-sm"><div className={`avatar avatar-sm ${u.color}`}>{u.avatar}</div>{u.name}</div></td>
                <td><span className="font-semibold">{u.queue}</span></td>
                <td>{u.resolved}</td>
                <td>{(Math.random() * 5 + 7).toFixed(1)}d</td>
                <td><span className="sla-pill sla-ok">✓ Good</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Aging Buckets</div></div>
        <div className="card-body">
          {[['0–5 days', 12, '#059669'], ['6–15 days', 18, '#1D4ED8'], ['16–30 days', 7, '#D97706'], ['>30 days', 2, '#DC2626']].map(([l, v, c]) => (
            <div key={l} className="bar-chart-row" style={{ marginBottom: 14 }}>
              <div className="bar-chart-label">{l}</div>
              <div className="bar-chart-track"><div className="bar-chart-fill" style={{ width: `${(v / 20) * 100}%`, background: c, height: 10, borderRadius: 5 }} /></div>
              <div className="bar-chart-val">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// EXAMINER DASHBOARD
const ExaminerDashboard = ({ setView }) => (
  <div className="animate-in">
    <div className="page-header flex items-center justify-between">
      <div>
        <div className="page-title">My Work Dashboard</div>
        <div className="page-subtitle">Sarah Chen · Claims Examiner · Level II</div>
      </div>
      <button className="btn btn-primary" onClick={() => setView({ screen: 'WORK_QUEUE', params: {} })}>View My Queue →</button>
    </div>
    <div className="kpi-grid kpi-grid-4 mb-lg">
      <KpiCard icon="📥" label="My Queue" value="8" trend="up" trendLabel="+2 assigned today" accent="#1D4ED8" iconBg="#1D4ED8" onClick={() => setView({ screen: 'WORK_QUEUE', params: {} })} />
      <KpiCard icon="📄" label="Docs Pending" value="3" trend="neutral" trendLabel="Awaiting upload" accent="#D97706" iconBg="#D97706" onClick={() => setView({ screen: 'DOCUMENTS', params: {} })} />
      <KpiCard icon="⚡" label="Nearing SLA" value="2" trend="up" trendLabel="Action needed" accent="#DC2626" iconBg="#DC2626" onClick={() => setView({ screen: 'SLA_MONITOR', params: {} })} />
      <KpiCard icon="✅" label="Resolved This Month" value="42" trend="up" trendLabel="+6 vs last month" accent="#059669" iconBg="#059669" />
    </div>
    <div className="quick-actions mb-xl">
      {[['📋', 'Review Claim', 'Open examiner view', 'WORK_QUEUE'], ['📎', 'Request Docs', 'Send deficiency notice', 'DOCUMENTS'], ['✅', 'Approve Claim', 'Submit recommendation', 'APPROVAL_QUEUE'], ['📝', 'Add Note', 'Internal collaboration', 'WORK_QUEUE'], ['🔍', 'Policy Lookup', 'Validate policy status', 'CLAIMS_LIST'], ['⚠️', 'Escalate', 'Flag for senior review', 'EXCEPTIONS']].map(([icon, label, sub, target]) => (
        <div key={label} className="quick-action-card" onClick={() => setView({ screen: target, params: {} })}>
          <div className="quick-action-icon">{icon}</div>
          <div className="quick-action-label">{label}</div>
          <div className="quick-action-sub">{sub}</div>
        </div>
      ))}
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">My Active Claims</div></div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Claim ID</th><th>Claimant</th><th>Type</th><th>Amount</th><th>Status</th><th>SLA</th><th>Days Open</th><th>Action</th></tr></thead>
          <tbody>
            {CLAIMS.filter(c => c.examiner === 'Sarah Chen').map(c => (
              <tr key={c.id} className="clickable-row" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } })}>
                <td><span className="table-claim-id">{c.id}</span></td>
                <td>{c.claimant}</td>
                <td>{c.type}</td>
                <td><span className="table-amount">{fmt(c.amount)}</span></td>
                <td><Chip label={getStatusChip(c.status).label} cls={getStatusChip(c.status).chip} /></td>
                <td><span className={`sla-pill ${getSlaChip(c.sla)}`}>{getSlaLabel(c.sla)}</span></td>
                <td>{c.daysOpen}d</td>
                <td><button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } }); }}>Review</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// CLAIMS LIST
const ClaimsList = ({ setView }) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const filters = ['ALL', 'PENDING_APPROVAL', 'UNDER_REVIEW', 'DOCS_PENDING', 'COMPLIANCE_REVIEW', 'APPROVED', 'REJECTED'];
  const filtered = CLAIMS.filter(c => {
    if (filter !== 'ALL' && c.status !== filter) return false;
    if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.insured.toLowerCase().includes(search.toLowerCase()) && !c.policy.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  return (
    <div className="animate-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <div className="page-title">Claims Registry</div>
          <div className="page-subtitle">{filtered.length} claims · All Types · All Regions</div>
        </div>
        <div className="flex gap-sm">
          <button className="btn btn-secondary">⬇ Export</button>
          <button className="btn btn-primary" onClick={() => setView({ screen: 'NEW_CLAIM', params: {} })}>➕ New Claim</button>
        </div>
      </div>
      <div className="card mb-md">
        <div className="card-body" style={{ padding: '12px 16px' }}>
          <div className="flex items-center gap-md flex-wrap">
            <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
              <span>🔍</span>
              <input placeholder="Search by Claim ID, Policy, Insured name..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: 160 }}><option>All Types</option>{Object.values(DOC_CHECKLIST).map((_, i) => <option key={i}>{Object.keys(DOC_CHECKLIST)[i]}</option>)}</select>
            <select className="form-select" style={{ width: 140 }}><option>All Examiners</option>{USERS.map(u => <option key={u.id}>{u.name}</option>)}</select>
            <select className="form-select" style={{ width: 120 }}><option>All Risk</option><option>HIGH</option><option>MED</option><option>LOW</option></select>
          </div>
        </div>
      </div>
      <div className="filter-bar">
        {filters.map(f => (
          <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'ALL' ? 'All Claims' : getStatusChip(f).label}
            {f === 'ALL' ? ` (${CLAIMS.length})` : ` (${CLAIMS.filter(c => c.status === f).length})`}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>Claim ID</th><th>Policy No.</th><th>Insured</th><th>Claimant</th><th>Type</th><th>Amount</th><th>Status</th><th>Risk</th><th>SLA</th><th>Days Open</th><th>Examiner</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="clickable-row" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } })}>
                  <td><div className="flex items-center gap-xs"><span className="table-claim-id">{c.id}</span>{c.flagged && <span title="Fraud Flagged">🚩</span>}</div></td>
                  <td><span className="font-mono text-sm">{c.policy}</span></td>
                  <td><span className="table-name">{c.insured}</span></td>
                  <td>{c.claimant}</td>
                  <td><span className="text-sm">{c.type}</span></td>
                  <td><span className="table-amount">{fmt(c.amount)}</span></td>
                  <td><Chip label={getStatusChip(c.status).label} cls={getStatusChip(c.status).chip} /></td>
                  <td><Chip label={c.risk} cls={getRiskChip(c.risk)} /></td>
                  <td><span className={`sla-pill ${getSlaChip(c.sla)}`}>{getSlaLabel(c.sla)}</span></td>
                  <td><span className={c.daysOpen > 20 ? 'text-accent font-semibold' : ''}>{c.daysOpen}d</span></td>
                  <td>{c.examiner}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="flex gap-xs">
                      <button className="btn btn-secondary btn-sm" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } })}>View</button>
                      <button className="btn btn-ghost btn-sm">⋮</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer flex items-center justify-between">
          <span className="text-sm text-muted">Showing {filtered.length} of {CLAIMS.length} claims</span>
          <div className="flex gap-sm">
            <button className="btn btn-secondary btn-sm">← Prev</button>
            <button className="btn btn-secondary btn-sm" style={{ background: 'var(--accent-blue)', color: '#fff' }}>1</button>
            <button className="btn btn-secondary btn-sm">2</button>
            <button className="btn btn-secondary btn-sm">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CLAIM DETAIL
const ClaimDetail = ({ claimId, setView }) => {
  const claim = CLAIMS.find(c => c.id === claimId) || CLAIMS[0];
  const [activeTab, setActiveTab] = useState('SUMMARY');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const milestoneSteps = ['Submission', 'Intake Review', 'Document Verification', 'Adjudication', 'Approval', 'Disbursement', 'Closed'];
  const currentMilestone = { SUBMITTED: 0, INTAKE_REVIEW: 1, DOCS_PENDING: 2, UNDER_REVIEW: 2, ADJUDICATION: 3, PENDING_APPROVAL: 4, COMPLIANCE_REVIEW: 4, APPROVED: 5, PAYMENT_PENDING: 5, PAID: 6, CLOSED: 6 }[claim.status] ?? 2;

  return (
    <div className="animate-in">
      {showApproveModal && (
        <div className="modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">✅ Approve Claim</div><button className="btn btn-ghost btn-icon" onClick={() => setShowApproveModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="alert alert-success mb-md"><div className="alert-icon">✅</div><div><div className="alert-title">Approving: {claim.id}</div>Payout of {fmt(claim.amount)} will be authorized for disbursement.</div></div>
              <div className="form-group"><label className="form-label">Approval Decision Reason</label><textarea className="form-textarea" defaultValue="Documentation verified. Policy is in force. Eligibility confirmed. No exclusions apply." /></div>
              <div className="form-group"><label className="form-label">Supporting Evidence Reference</label><input className="form-input" defaultValue="Medical report #MR-2024-0891, Death cert #DC-TX-44521" /></div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowApproveModal(false)}>Cancel</button><button className="btn btn-success" onClick={() => setShowApproveModal(false)}>✅ Confirm Approval</button></div>
          </div>
        </div>
      )}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><div className="modal-title">❌ Reject Claim</div><button className="btn btn-ghost btn-icon" onClick={() => setShowRejectModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="alert alert-error mb-md"><div className="alert-icon">❌</div><div><div className="alert-title">Rejecting: {claim.id}</div>This action will close the claim and notify the claimant.</div></div>
              <div className="form-group"><label className="form-label">Rejection Reason</label><select className="form-select"><option>Policy Exclusion Applies</option><option>Contestability Period Active</option><option>Fraud Suspected</option><option>Incomplete Documentation</option><option>Policy Lapsed / Not In Force</option><option>Duplicate Claim</option></select></div>
              <div className="form-group"><label className="form-label">Detailed Notes</label><textarea className="form-textarea" placeholder="Provide full rejection rationale for audit and appeal..." /></div>
            </div>
            <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>Cancel</button><button className="btn btn-danger" onClick={() => setShowRejectModal(false)}>❌ Confirm Rejection</button></div>
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <span className="table-claim-id" style={{ fontSize: 16 }}>{claim.id}</span>
              <Chip label={getStatusChip(claim.status).label} cls={getStatusChip(claim.status).chip} />
              <Chip label={claim.risk + ' RISK'} cls={getRiskChip(claim.risk)} />
              {claim.flagged && <span className="chip chip-red"><span className="chip-dot" />🚩 Fraud Flagged</span>}
              <span className={`sla-pill ${getSlaChip(claim.sla)}`}>{getSlaLabel(claim.sla)}</span>
            </div>
            <div className="page-title">{claim.type} — {claim.insured}</div>
            <div className="page-subtitle">Policy: {claim.policy} · {claim.product} · {claim.state} · Submitted: {claim.submitted} · {claim.daysOpen} days open</div>
          </div>
          <div className="flex gap-sm">
            <button className="btn btn-secondary">📝 Add Note</button>
            <button className="btn btn-warning">↩ Send Back</button>
            <button className="btn btn-danger" onClick={() => setShowRejectModal(true)}>❌ Reject</button>
            <button className="btn btn-success" onClick={() => setShowApproveModal(true)}>✅ Approve</button>
          </div>
        </div>
      </div>

      <div className="card mb-lg">
        <div className="card-body" style={{ padding: '16px 24px' }}>
          <div className="text-xs text-muted mb-sm font-semibold" style={{ letterSpacing: '0.08em', textTransform: 'uppercase' }}>Claim Progress</div>
          <MilestoneTracker steps={milestoneSteps} currentStep={currentMilestone} />
        </div>
      </div>

      <div className="tabs">
        {[['SUMMARY', 'Summary'], ['DOCUMENTS', 'Documents'], ['ADJUDICATION', 'Adjudication'], ['APPROVAL', 'Approval Chain'], ['ACTIVITY', 'Activity & Audit'], ['FINANCIALS', 'Financials'], ['COMPLIANCE', 'Compliance']].map(([key, label]) => (
          <button key={key} className={`tab-btn ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>
        ))}
      </div>

      {activeTab === 'SUMMARY' && (
        <div className="animate-in">
          {claim.flagged && (
            <div className="mb-lg">
              <div className="fraud-flag"><div className="fraud-flag-icon">🚨</div><div><div className="fraud-flag-label">Fraud Risk Indicator Detected</div><div className="fraud-flag-detail">Beneficiary address does not match policy records · Contestability window active (18 months) · AML screening in progress</div></div></div>
            </div>
          )}
          <div className="col-8-4">
            <div>
              <div className="card mb-lg">
                <div className="card-header"><div className="card-title">Policy & Insured Information</div></div>
                <div className="card-body">
                  <div className="detail-section">
                    <div className="detail-grid">
                      <div className="detail-field"><div className="detail-field-label">Policy Number</div><div className="detail-field-value mono">{claim.policy}</div></div>
                      <div className="detail-field"><div className="detail-field-label">Product</div><div className="detail-field-value">{claim.product}</div></div>
                      <div className="detail-field"><div className="detail-field-label">Policy Status</div><div className="detail-field-value"><span className="chip chip-green"><span className="chip-dot" />In Force</span></div></div>
                      <div className="detail-field"><div className="detail-field-label">Issue Date</div><div className="detail-field-value">Mar 15, 2019</div></div>
                      <div className="detail-field"><div className="detail-field-label">Face Amount</div><div className="detail-field-value amount">{fmt(claim.amount)}</div></div>
                      <div className="detail-field"><div className="detail-field-label">Premium Status</div><div className="detail-field-value"><span className="chip chip-green"><span className="chip-dot" />Current</span></div></div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="detail-section">
                    <div className="detail-section-title">Insured</div>
                    <div className="detail-grid">
                      <div className="detail-field"><div className="detail-field-label">Name</div><div className="detail-field-value">{claim.insured}</div></div>
                      <div className="detail-field"><div className="detail-field-label">Date of Birth</div><div className="detail-field-value">Jan 4, 1952</div></div>
                      <div className="detail-field"><div className="detail-field-label">Date of Death / Event</div><div className="detail-field-value">Nov 8, 2024</div></div>
                      <div className="detail-field"><div className="detail-field-label">Cause</div><div className="detail-field-value">Natural Causes</div></div>
                      <div className="detail-field"><div className="detail-field-label">State</div><div className="detail-field-value">{claim.state}</div></div>
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="detail-section">
                    <div className="detail-section-title">Claimant / Beneficiary</div>
                    <div className="detail-grid">
                      <div className="detail-field"><div className="detail-field-label">Name</div><div className="detail-field-value">{claim.claimant}</div></div>
                      <div className="detail-field"><div className="detail-field-label">Relationship</div><div className="detail-field-value">Spouse</div></div>
                      <div className="detail-field"><div className="detail-field-label">Beneficiary Type</div><div className="detail-field-value">Primary — 100%</div></div>
                      <div className="detail-field"><div className="detail-field-label">ID Verified</div><div className="detail-field-value"><span className="chip chip-green"><span className="chip-dot" />Verified</span></div></div>
                      <div className="detail-field"><div className="detail-field-label">Payout Preference</div><div className="detail-field-value">Electronic Transfer (ACH)</div></div>
                      <div className="detail-field"><div className="detail-field-label">Tax Election</div><div className="detail-field-value">W-9 Submitted — 20% Withholding</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="card mb-lg">
                <div className="card-header"><div className="card-title">Claim Snapshot</div></div>
                <div className="card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[['Type', claim.type], ['Channel', claim.channel], ['Assigned To', claim.examiner], ['Days Open', `${claim.daysOpen} days`], ['Priority', claim.priority], ['Jurisdiction', claim.state]].map(([l, v]) => (
                      <div key={l}><div className="detail-field-label">{l}</div><div className="detail-field-value">{v}</div></div>
                    ))}
                  </div>
                  <div className="divider" />
                  <div className="detail-field-label mb-sm">Risk Score</div>
                  <div className="risk-meter mb-sm">
                    {[...Array(5)].map((_, i) => <div key={i} className={`risk-bar ${claim.risk === 'HIGH' ? (i < 5 ? 'filled-high' : '') : claim.risk === 'MED' ? (i < 3 ? 'filled-med' : '') : (i < 1 ? 'filled-low' : '')}`} />)}
                  </div>
                  <div className="text-sm text-muted">{claim.risk} — Score: {claim.risk === 'HIGH' ? '78/100' : claim.risk === 'MED' ? '45/100' : '12/100'}</div>
                  <div className="divider" />
                  <div className="detail-field-label mb-sm">Document Completeness</div>
                  <div className="progress-bar mb-sm"><div className="progress-fill progress-orange" style={{ width: '67%' }} /></div>
                  <div className="text-sm text-muted">4 of 6 documents received</div>
                </div>
              </div>
              <div className="card">
                <div className="card-header"><div className="card-title">Quick Actions</div></div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['📎 Request Documents', 'btn-secondary'], ['💬 Send Claimant Message', 'btn-secondary'], ['🔄 Reassign Claim', 'btn-secondary'], ['⚠️ Flag Exception', 'btn-warning'], ['📈 Escalate to Senior', 'btn-purple']].map(([label, cls]) => (
                    <button key={label} className={`btn ${cls} w-full`}>{label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'DOCUMENTS' && (
        <div className="animate-in">
          <div className="alert alert-warning mb-lg"><div className="alert-icon">⚠️</div><div><div className="alert-title">2 Documents Pending</div>Bank Account Proof and Medical Report are outstanding. Claim cannot advance until received.</div></div>
          <div className="card mb-lg">
            <div className="card-header"><div className="card-title">Document Checklist — {claim.type}</div><button className="btn btn-primary btn-sm">📎 Request Missing Docs</button></div>
            <div className="card-body">
              <div className="doc-grid">
                {DOCUMENTS.map(doc => (
                  <div key={doc.id} className="doc-card">
                    <div className="doc-card-icon">{doc.icon}</div>
                    <div className="doc-card-name">{doc.name}</div>
                    <div className="doc-card-type">{doc.category} · {doc.format} {doc.size && `· ${doc.size}`}</div>
                    {doc.uploaded && <div className="text-xs text-muted">Uploaded: {doc.uploaded}</div>}
                    <div className="doc-card-status">
                      <Chip label={doc.status === 'ACCEPTED' ? '✓ Accepted' : doc.status === 'PENDING' ? '⏳ Pending Verification' : '✕ Rejected'} cls={getDocStatusChip(doc.status)} />
                    </div>
                    {doc.status === 'REJECTED' && <div className="text-xs" style={{ color: 'var(--accent-red)', marginTop: 4 }}>Deficiency: Document illegible / incomplete</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">Upload New Document</div></div>
            <div className="card-body">
              <div className="upload-zone">
                <div className="upload-zone-icon">📤</div>
                <div className="upload-zone-title">Drag & drop files here</div>
                <div className="upload-zone-hint">PDF, JPG, PNG, DOCX · Max 25MB per file</div>
                <button className="btn btn-primary" style={{ marginTop: 16 }}>Browse Files</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ADJUDICATION' && (
        <div className="animate-in">
          <div className="col-6-6">
            <div className="card">
              <div className="card-header"><div className="card-title">Eligibility & Validation Checks</div></div>
              <div className="card-body">
                {[
                  ['Policy In Force', true, 'Active as of event date'],
                  ['Premium Current', true, 'Last premium: Oct 2024'],
                  ['Contestability Period', false, '⚠ 18-month period active until Apr 2025'],
                  ['Beneficiary Match', true, 'Primary beneficiary confirmed'],
                  ['Exclusions Check', true, 'No applicable exclusions'],
                  ['AML / Sanctions', true, 'Cleared — no matches'],
                  ['Duplicate Claim', true, 'No duplicate detected'],
                  ['Fraud Score', false, '⚠ Score 78/100 — requires manual review'],
                ].map(([check, pass, note]) => (
                  <div key={check} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{pass ? '✅' : '⚠️'}</span>
                    <div style={{ flex: 1 }}>
                      <div className="font-semibold text-sm">{check}</div>
                      <div className="text-xs text-muted mt-xs">{note}</div>
                    </div>
                    <Chip label={pass ? 'PASS' : 'FLAG'} cls={pass ? 'chip-green' : 'chip-orange'} />
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Examiner Notes</div></div>
              <div className="card-body">
                <div className="form-group"><label className="form-label">Adjudication Notes</label><textarea className="form-textarea" style={{ minHeight: 120 }} defaultValue="Policy verified in force. Contestability period active — death certificate submitted, cause appears natural. Beneficiary verified against policy records. Awaiting clarification on bank proof. Escalated due to high-risk score from fraud engine." /></div>
                <div className="form-group"><label className="form-label">Recommendation</label>
                  <select className="form-select">
                    <option>Approve — Proceed to Payment</option>
                    <option>Pending — Request More Information</option>
                    <option>Escalate — Senior Review Required</option>
                    <option>Deny — Policy Exclusion</option>
                  </select>
                </div>
                <div className="flex justify-end gap-sm"><button className="btn btn-secondary">Save Draft</button><button className="btn btn-primary">Submit Recommendation →</button></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'APPROVAL' && (
        <div className="animate-in">
          <div className="card">
            <div className="card-header"><div className="card-title">Multi-Level Approval Chain</div><Chip label={`L3 Approval Pending`} cls="chip-orange" /></div>
            <div className="card-body">
              {APPROVAL_MATRIX.map((step, i) => (
                <div key={i} className="approval-step">
                  <div className={`approval-step-num ${step.status}`}>{step.status === 'approved' ? '✓' : step.status === 'pending' ? '⏳' : i + 1}</div>
                  <div className="approval-step-info">
                    <div className="approval-step-title">Level {step.level}: {step.role}</div>
                    <div className="approval-step-meta">Threshold: {step.threshold} · Assigned: {step.user}</div>
                    {step.time && <div className="approval-step-meta">Approved: {step.time}</div>}
                    {step.note && <div className="approval-step-note">"{step.note}"</div>}
                  </div>
                  <Chip label={step.status === 'approved' ? '✓ Approved' : step.status === 'pending' ? '⏳ Pending' : '⌛ Waiting'} cls={step.status === 'approved' ? 'chip-green' : step.status === 'pending' ? 'chip-orange' : 'chip-gray'} />
                </div>
              ))}
              <div className="divider" />
              <div className="flex gap-sm justify-end">
                <button className="btn btn-secondary">↩ Send Back</button>
                <button className="btn btn-secondary">👤 Delegate</button>
                <button className="btn btn-danger" onClick={() => setShowRejectModal(true)}>❌ Reject</button>
                <button className="btn btn-success" onClick={() => setShowApproveModal(true)}>✅ Approve at L3</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ACTIVITY' && (
        <div className="animate-in">
          <div className="card">
            <div className="card-header"><div className="card-title">Activity Timeline & Audit Trail</div><button className="btn btn-secondary btn-sm">⬇ Export Log</button></div>
            <div className="card-body">
              <div className="audit-feed">
                {AUDIT_TRAIL.map((entry, i) => (
                  <div key={entry.id} className="audit-item">
                    <div className="audit-timeline">
                      <div className={`audit-dot ${entry.color === 'chip-red' ? 'chip-red' : ''}`} style={{ background: entry.color === 'chip-red' ? '#FEF2F2' : entry.color === 'chip-orange' ? '#FFFBEB' : entry.color === 'chip-purple' ? '#F5F3FF' : entry.color === 'chip-green' ? '#ECFDF5' : '#F0F9FF', border: '2px solid var(--border-main)' }}>{entry.icon}</div>
                      {i < AUDIT_TRAIL.length - 1 && <div className="audit-line" />}
                    </div>
                    <div className="audit-content">
                      <div className="audit-action">{entry.action}</div>
                      <div className="audit-meta">{entry.user} · <span style={{ fontStyle: 'italic' }}>{entry.role}</span> · {entry.time}</div>
                      {entry.note && <div className="audit-note">{entry.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'FINANCIALS' && (
        <div className="animate-in">
          <div className="col-6-6">
            <div className="card">
              <div className="card-header"><div className="card-title">Benefit Calculation</div></div>
              <div className="card-body">
                <div className="calc-row"><span className="calc-label">Gross Death Benefit</span><span className="calc-value">{fmt(claim.amount)}</span></div>
                <div className="calc-row"><span className="calc-label">Accumulated Dividends</span><span className="calc-value">+$12,450</span></div>
                <div className="calc-row"><span className="calc-label">Outstanding Policy Loan</span><span className="calc-value deduction">-$18,200</span></div>
                <div className="calc-row"><span className="calc-label">Loan Interest Accrued</span><span className="calc-value deduction">-$1,840</span></div>
                <div className="calc-row"><span className="calc-label">Federal Tax Withholding (20%)</span><span className="calc-value deduction">-{fmt((claim.amount - 18200 - 1840 + 12450) * 0.2)}</span></div>
                <div className="calc-row"><span className="calc-label">State Tax (TX — None)</span><span className="calc-value">$0</span></div>
                <div className="calc-row total"><span className="calc-label">Net Payout to Beneficiary</span><span className="calc-value total-val">{fmt((claim.amount + 12450 - 18200 - 1840) * 0.8)}</span></div>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><div className="card-title">Payment Details</div></div>
              <div className="card-body">
                <div className="detail-grid">
                  {[['Payment Method', 'ACH Electronic Transfer'], ['Bank Name', 'Chase Bank, N.A.'], ['Account Type', 'Checking'], ['Account Ending', '••••4521'], ['Routing', '•••••0110'], ['Tax Form', 'W-9 Filed'], ['1099-R Required', 'Yes'], ['Estimated Dispatch', '3–5 Business Days']].map(([l, v]) => (
                    <div key={l} className="detail-field"><div className="detail-field-label">{l}</div><div className="detail-field-value">{v}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'COMPLIANCE' && (
        <div className="animate-in">
          <div className="card">
            <div className="card-header"><div className="card-title">Compliance & Fraud Review</div></div>
            <div className="card-body">
              <div className="fraud-flag mb-md"><div className="fraud-flag-icon">⚠️</div><div><div className="fraud-flag-label">Fraud Engine Alert — Score: 78/100</div><div className="fraud-flag-detail">3 indicators triggered: beneficiary address mismatch, contestability period active, unusual claim timing (8 months post-issue)</div></div></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['AML Screening', 'CLEARED', 'chip-green'], ['OFAC/Sanctions', 'CLEARED', 'chip-green'], ['Fraud Score', '78/100 HIGH', 'chip-red'], ['Contestability', 'ACTIVE — 18mo', 'chip-orange'], ['Duplicate Check', 'CLEARED', 'chip-green'], ['Investigation Status', 'Under Review', 'chip-purple']].map(([l, v, c]) => (
                  <div key={l} className="card" style={{ padding: 12 }}>
                    <div className="detail-field-label">{l}</div>
                    <Chip label={v} cls={c} />
                  </div>
                ))}
              </div>
              <div className="divider" />
              <div className="form-group mt-md"><label className="form-label">Compliance Reviewer Notes</label><textarea className="form-textarea" placeholder="Document your compliance assessment and findings..." /></div>
              <div className="flex gap-sm justify-end"><button className="btn btn-secondary">Save Notes</button><button className="btn btn-primary">Submit Compliance Decision</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// NEW CLAIM FORM
const NewClaim = ({ setView }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  return (
    <div className="animate-in">
      <div className="page-header">
        <div className="page-title">New Claim Registration</div>
        <div className="page-subtitle">Step {step} of {totalSteps} — Complete all required fields</div>
      </div>
      <div className="card mb-lg">
        <div className="card-body" style={{ padding: '12px 24px' }}>
          <MilestoneTracker steps={['Policy & Claimant', 'Claim Details', 'Documents', 'Review & Submit']} currentStep={step - 1} />
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">{['', 'Policy & Claimant Lookup', 'Claim Details', 'Document Upload', 'Review & Submit'][step]}</div></div>
        <div className="card-body">
          {step === 1 && (
            <div>
              <div className="alert alert-info mb-lg"><div className="alert-icon">ℹ️</div><div><div className="alert-title">Claim Intake</div>Search for the policy first to pre-fill insured details, then add claimant information.</div></div>
              <div className="form-row form-row-2 mb-md">
                <div className="form-group"><label className="form-label">Policy Number *</label><input className="form-input" placeholder="e.g. POL-LI-448291" /></div>
                <div className="form-group"><label className="form-label">SSN (Last 4) / Tax ID</label><input className="form-input" placeholder="••••" /></div>
              </div>
              <button className="btn btn-secondary mb-lg">🔍 Search & Validate Policy</button>
              <div className="divider" />
              <div className="form-row form-row-3">
                <div className="form-group"><label className="form-label">Claimant First Name *</label><input className="form-input" placeholder="First Name" /></div>
                <div className="form-group"><label className="form-label">Claimant Last Name *</label><input className="form-input" placeholder="Last Name" /></div>
                <div className="form-group"><label className="form-label">Relationship to Insured *</label><select className="form-select"><option>Select...</option><option>Spouse</option><option>Child</option><option>Parent</option><option>Trust</option><option>Estate</option><option>Other</option></select></div>
              </div>
              <div className="form-row form-row-2">
                <div className="form-group"><label className="form-label">Email Address *</label><input className="form-input" type="email" placeholder="claimant@email.com" /></div>
                <div className="form-group"><label className="form-label">Phone Number *</label><input className="form-input" placeholder="+1 (555) 000-0000" /></div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="form-row form-row-2 mb-md">
                <div className="form-group"><label className="form-label">Claim Type *</label><select className="form-select"><option>Life Death Claim</option><option>Accidental Death Benefit</option><option>Terminal Illness Benefit</option><option>Annuity Withdrawal</option><option>Annuity Maturity Payout</option><option>Beneficiary Claim</option><option>Surrender Claim</option><option>Rider Benefit Claim</option></select></div>
                <div className="form-group"><label className="form-label">Event / Incident Date *</label><input className="form-input" type="date" /></div>
              </div>
              <div className="form-row form-row-2 mb-md">
                <div className="form-group"><label className="form-label">Cause of Claim *</label><select className="form-select"><option>Natural Causes</option><option>Accidental Death</option><option>Terminal Illness</option><option>Policy Maturity</option><option>Voluntary Surrender</option></select></div>
                <div className="form-group"><label className="form-label">Claim Submission Channel</label><select className="form-select"><option>Online Portal</option><option>Agent-Assisted</option><option>Phone / Call Center</option><option>Mail</option></select></div>
              </div>
              <div className="form-row form-row-2 mb-md">
                <div className="form-group"><label className="form-label">Payout Preference *</label><select className="form-select"><option>ACH / Electronic Transfer</option><option>Check</option><option>Retained Asset Account</option></select></div>
                <div className="form-group"><label className="form-label">Tax Withholding Election</label><select className="form-select"><option>Federal — 20%</option><option>Federal — 10%</option><option>Opt Out / W-8</option></select></div>
              </div>
              <div className="form-group"><label className="form-label">Claim Description / Notes</label><textarea className="form-textarea" placeholder="Provide additional context, circumstances, or claimant notes..." /></div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="alert alert-info mb-md"><div className="alert-icon">📋</div><div><div className="alert-title">Required Documents for Life Death Claim</div>Upload all mandatory documents to proceed. Missing documents will trigger a deficiency notice.</div></div>
              <div className="upload-zone mb-lg">
                <div className="upload-zone-icon">📤</div>
                <div className="upload-zone-title">Drag & drop documents here</div>
                <div className="upload-zone-hint">PDF, JPG, PNG, DOCX · Max 25MB per file · Multiple files supported</div>
                <button className="btn btn-primary" style={{ marginTop: 16 }}>Browse Files</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(DOC_CHECKLIST['Life Death Claim'] || []).map((doc, i) => (
                  <div key={i} className="flex items-center gap-md" style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid var(--border-main)' }}>
                    <span style={{ fontSize: 18 }}>{i < 3 ? '✅' : '⬜'}</span>
                    <span className="flex-1 font-semibold text-sm">{doc}</span>
                    <span className={`chip ${i < 3 ? 'chip-green' : 'chip-gray'}`}>{i < 3 ? 'Uploaded' : 'Required'}</span>
                    <button className="btn btn-secondary btn-sm">{i < 3 ? 'Replace' : 'Upload'}</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <div className="alert alert-success mb-lg"><div className="alert-icon">✅</div><div><div className="alert-title">Ready to Submit</div>All required information has been collected. Review the summary and submit the claim.</div></div>
              <div className="highlight-card rounded p-lg mb-lg">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  {[['Policy', 'POL-LI-XXXXXX'], ['Claim Type', 'Life Death Claim'], ['Insured', 'John Doe'], ['Claimant', 'Jane Doe'], ['Relationship', 'Spouse'], ['Event Date', 'Nov 15, 2024'], ['Payout', 'ACH Transfer'], ['Tax', '20% Federal'], ['Documents', '3 of 6 Uploaded']].map(([l, v]) => (
                    <div key={l}><div className="detail-field-label">{l}</div><div className="detail-field-value">{v}</div></div>
                  ))}
                </div>
              </div>
              <div className="alert alert-warning"><div className="alert-icon">⚠️</div><div>3 documents still pending. Claim will be submitted in DOCS_PENDING status. You can upload remaining documents after submission.</div></div>
            </div>
          )}
        </div>
        <div className="card-footer flex justify-between">
          <button className="btn btn-secondary" onClick={() => step > 1 && setStep(s => s - 1)} disabled={step === 1}>← Back</button>
          <div className="flex gap-sm">
            <button className="btn btn-ghost" onClick={() => setView({ screen: 'CLAIMS_LIST', params: {} })}>Cancel</button>
            {step < totalSteps
              ? <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Next Step →</button>
              : <button className="btn btn-success" onClick={() => setView({ screen: 'CLAIMS_LIST', params: {} })}>🚀 Submit Claim</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// WORK QUEUE
const WorkQueue = ({ setView }) => {
  const [filter, setFilter] = useState('ALL');
  return (
    <div className="animate-in">
      <div className="page-header flex items-center justify-between">
        <div><div className="page-title">Work Queue & Task Inbox</div><div className="page-subtitle">14 items · Sorted by Priority & SLA</div></div>
        <div className="flex gap-sm">
          <button className="btn btn-secondary">🔄 Auto-Assign</button>
          <button className="btn btn-primary">📋 Bulk Action</button>
        </div>
      </div>
      <div className="filter-bar">
        {['ALL', 'HIGH', 'MED', 'LOW'].map(f => <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f === 'ALL' ? 'All Priority' : `${f} Priority`}</button>)}
        <button className="filter-chip">⏰ SLA Breach</button>
        <button className="filter-chip">📎 Docs Pending</button>
        <button className="filter-chip">🚨 Flagged</button>
      </div>
      <div className="col-8-4">
        <div>
          {CLAIMS.filter(c => filter === 'ALL' || c.priority === filter).map(c => (
            <div key={c.id} className="queue-item" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } })}>
              <div className={`queue-item-priority ${getPriorityClass(c.priority)}`} />
              <div className="queue-item-body">
                <div className="queue-item-title">{c.type} — {c.insured}</div>
                <div className="queue-item-meta">{c.id} · {c.policy} · {fmt(c.amount)} · {c.daysOpen} days open</div>
                <div className="queue-item-badges">
                  <Chip label={getStatusChip(c.status).label} cls={getStatusChip(c.status).chip} />
                  <Chip label={c.risk} cls={getRiskChip(c.risk)} />
                  <span className={`sla-pill ${getSlaChip(c.sla)}`}>{getSlaLabel(c.sla)}</span>
                  {c.flagged && <span className="chip chip-red"><span className="chip-dot" />Fraud Flag</span>}
                </div>
              </div>
              <div className="queue-item-actions" onClick={e => e.stopPropagation()}>
                <button className="btn btn-primary btn-sm" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } })}>Open</button>
                <button className="btn btn-ghost btn-sm">Assign</button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="card mb-md">
            <div className="card-header"><div className="card-title">Queue Summary</div></div>
            <div className="card-body">
              {[['🔴 High Priority', 3, '#DC2626'], ['🟠 Medium Priority', 6, '#D97706'], ['🟢 Low Priority', 5, '#059669']].map(([l, v, c]) => (
                <div key={l} className="flex items-center justify-between mb-md">
                  <span className="text-sm">{l}</span>
                  <span className="font-bold" style={{ color: c }}>{v}</span>
                </div>
              ))}
              <div className="divider" />
              <div className="flex items-center justify-between mt-md"><span className="text-sm text-muted">SLA Breaches</span><span className="chip chip-red"><span className="chip-dot" />2 Active</span></div>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><div className="card-title">My Tasks</div></div>
            <div className="card-body">
              {['Review CLM-00891 beneficiary proof', 'Request medical report for CLM-00895', 'Complete adjudication for CLM-00897', 'Escalate CLM-00893 to compliance'].map((t, i) => (
                <div key={i} className="flex items-center gap-sm mb-sm">
                  <input type="checkbox" style={{ flexShrink: 0 }} />
                  <span className="text-sm">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// APPROVAL QUEUE
const ApprovalQueue = ({ setView }) => (
  <div className="animate-in">
    <div className="page-header flex items-center justify-between">
      <div><div className="page-title">Approval Queue</div><div className="page-subtitle">3 claims pending your approval</div></div>
    </div>
    <div className="kpi-grid kpi-grid-3 mb-lg">
      <KpiCard icon="⏳" label="Pending L1 Approval" value="1" trend="neutral" trendLabel="Examiner review" accent="#1D4ED8" iconBg="#1D4ED8" />
      <KpiCard icon="✅" label="Pending L3 Approval" value="2" trend="up" trendLabel="Needs action today" accent="#D97706" iconBg="#D97706" />
      <KpiCard icon="💰" label="Total Payout Value" value="$1.625M" trend="neutral" trendLabel="Awaiting approval" accent="#7C3AED" iconBg="#7C3AED" />
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Pending Approvals</div></div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Claim ID</th><th>Type</th><th>Insured</th><th>Amount</th><th>Approval Level</th><th>Submitted By</th><th>SLA</th><th>Actions</th></tr></thead>
          <tbody>
            {CLAIMS.filter(c => c.status === 'PENDING_APPROVAL' || c.status === 'COMPLIANCE_REVIEW').map(c => (
              <tr key={c.id} className="clickable-row" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id, tab: 'APPROVAL' } })}>
                <td><span className="table-claim-id">{c.id}</span></td>
                <td>{c.type}</td>
                <td>{c.insured}</td>
                <td><span className="table-amount">{fmt(c.amount)}</span></td>
                <td><Chip label={c.amount > 500000 ? 'L3 – Sr. Manager' : 'L2 – Supervisor'} cls="chip-orange" /></td>
                <td>{c.examiner}</td>
                <td><span className={`sla-pill ${getSlaChip(c.sla)}`}>{getSlaLabel(c.sla)}</span></td>
                <td onClick={e => e.stopPropagation()}><div className="flex gap-sm"><button className="btn btn-success btn-sm">✅ Approve</button><button className="btn btn-danger btn-sm">❌ Reject</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// DISBURSEMENTS
const Disbursements = ({ setView }) => (
  <div className="animate-in">
    <div className="page-header flex items-center justify-between">
      <div><div className="page-title">Finance & Disbursements</div><div className="page-subtitle">Payment processing and settlement tracking</div></div>
      <button className="btn btn-primary">💳 Process Payments</button>
    </div>
    <div className="kpi-grid kpi-grid-4 mb-lg">
      <KpiCard icon="⏳" label="Approved Awaiting Payment" value="12" trend="neutral" trendLabel="$4.2M total" accent="#D97706" iconBg="#D97706" />
      <KpiCard icon="✅" label="Paid This Week" value="28" trend="up" trendLabel="$9.8M disbursed" accent="#059669" iconBg="#059669" />
      <KpiCard icon="❌" label="Failed Disbursements" value="2" trend="neutral" trendLabel="Needs correction" accent="#DC2626" iconBg="#DC2626" />
      <KpiCard icon="🧾" label="Tax Withholdings MTD" value="$1.2M" trend="neutral" trendLabel="W-9 filed: 94%" accent="#7C3AED" iconBg="#7C3AED" />
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Payment Queue</div></div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Claim ID</th><th>Claimant</th><th>Type</th><th>Gross</th><th>Net Payout</th><th>Method</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {CLAIMS.filter(c => c.status === 'PAYMENT_PENDING' || c.status === 'APPROVED' || c.status === 'PAID').map(c => (
              <tr key={c.id} className="clickable-row" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } })}>
                <td><span className="table-claim-id">{c.id}</span></td>
                <td>{c.claimant}</td>
                <td>{c.type}</td>
                <td><span className="table-amount">{fmt(c.amount)}</span></td>
                <td><span className="table-amount" style={{ color: 'var(--accent-green)' }}>{fmt(c.amount * 0.8)}</span></td>
                <td>ACH Transfer</td>
                <td><Chip label={getStatusChip(c.status).label} cls={getStatusChip(c.status).chip} /></td>
                <td onClick={e => e.stopPropagation()}><button className="btn btn-success btn-sm" disabled={c.status === 'PAID'}>💳 {c.status === 'PAID' ? 'Paid' : 'Disburse'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// BENEFIT CALCULATOR
const BenefitCalc = () => {
  const [gross, setGross] = useState(500000);
  const [loan, setLoan] = useState(18200);
  const [loanInt, setLoanInt] = useState(1840);
  const [divs, setDivs] = useState(12450);
  const [taxRate, setTaxRate] = useState(0.2);
  const net = (gross + divs - loan - loanInt) * (1 - taxRate);
  return (
    <div className="animate-in">
      <div className="page-header"><div className="page-title">Benefit Calculator</div><div className="page-subtitle">Calculate net payout including all deductions and taxes</div></div>
      <div className="col-6-6">
        <div className="card">
          <div className="card-header"><div className="card-title">Input Parameters</div></div>
          <div className="card-body">
            {[['Gross Death Benefit', gross, setGross, '+'], ['Accumulated Dividends', divs, setDivs, '+'], ['Policy Loan Balance', loan, setLoan, '-'], ['Loan Interest Accrued', loanInt, setLoanInt, '-']].map(([l, v, s, sign]) => (
              <div className="form-group" key={l}>
                <label className="form-label">{sign === '-' ? '(Deduction) ' : ''}{l}</label>
                <input className="form-input" type="number" value={v} onChange={e => s(Number(e.target.value))} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Federal Tax Withholding</label>
              <select className="form-select" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))}>
                <option value={0}>No Withholding</option>
                <option value={0.1}>10%</option>
                <option value={0.2}>20%</option>
                <option value={0.28}>28%</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Settlement Summary</div></div>
          <div className="card-body">
            <div className="calc-row"><span className="calc-label">Gross Benefit</span><span className="calc-value">{fmt(gross)}</span></div>
            <div className="calc-row"><span className="calc-label">+ Dividends</span><span className="calc-value" style={{ color: 'var(--accent-green)' }}>+{fmt(divs)}</span></div>
            <div className="calc-row"><span className="calc-label">— Policy Loan</span><span className="calc-value deduction">-{fmt(loan)}</span></div>
            <div className="calc-row"><span className="calc-label">— Loan Interest</span><span className="calc-value deduction">-{fmt(loanInt)}</span></div>
            <div className="calc-row"><span className="calc-label">Pre-Tax Subtotal</span><span className="calc-value font-bold">{fmt(gross + divs - loan - loanInt)}</span></div>
            <div className="calc-row"><span className="calc-label">— Federal Tax ({(taxRate * 100).toFixed(0)}%)</span><span className="calc-value deduction">-{fmt((gross + divs - loan - loanInt) * taxRate)}</span></div>
            <div className="calc-row total"><span className="calc-label">NET PAYOUT</span><span className="calc-value total-val">{fmt(net)}</span></div>
            <div className="divider" />
            <button className="btn btn-primary w-full mt-md">💾 Save & Apply to Claim</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// COMPLIANCE / FRAUD
const CompliancePage = ({ setView }) => (
  <div className="animate-in">
    <div className="page-header flex items-center justify-between">
      <div><div className="page-title">Compliance & Fraud Review</div><div className="page-subtitle">AML, Sanctions, Fraud Indicators & Investigations</div></div>
    </div>
    <div className="kpi-grid kpi-grid-4 mb-lg">
      <KpiCard icon="🛡️" label="AML / Sanctions Matches" value="2" trend="neutral" trendLabel="Under investigation" accent="#DC2626" iconBg="#DC2626" />
      <KpiCard icon="🚨" label="High Fraud Score" value="5" trend="up" trendLabel="Score > 70" accent="#D97706" iconBg="#D97706" />
      <KpiCard icon="⚖️" label="Contestability Active" value="8" trend="neutral" trendLabel="Requires review" accent="#7C3AED" iconBg="#7C3AED" />
      <KpiCard icon="🔍" label="Under Investigation" value="3" trend="neutral" trendLabel="Long-running" accent="#1D4ED8" iconBg="#1D4ED8" />
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Flagged Claims — Compliance Queue</div></div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Claim ID</th><th>Insured</th><th>Type</th><th>Amount</th><th>Flag Reason</th><th>Fraud Score</th><th>Reviewer</th><th>Action</th></tr></thead>
          <tbody>
            {CLAIMS.filter(c => c.flagged || c.status === 'COMPLIANCE_REVIEW').map(c => (
              <tr key={c.id} className="clickable-row" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } })}>
                <td><span className="table-claim-id">{c.id}</span></td>
                <td>{c.insured}</td>
                <td>{c.type}</td>
                <td><span className="table-amount">{fmt(c.amount)}</span></td>
                <td><span className="chip chip-red"><span className="chip-dot" />Fraud Indicator</span></td>
                <td><span className="font-bold" style={{ color: 'var(--accent-red)' }}>78/100</span></td>
                <td>Mark Ellison</td>
                <td onClick={e => e.stopPropagation()}><button className="btn btn-primary btn-sm" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } })}>Investigate</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// SLA MONITOR
const SLAMonitor = ({ setView }) => (
  <div className="animate-in">
    <div className="page-header"><div className="page-title">SLA Monitor & Aging Dashboard</div><div className="page-subtitle">Track claim processing timelines and escalation triggers</div></div>
    <div className="kpi-grid kpi-grid-4 mb-lg">
      <KpiCard icon="✅" label="On Track (< 15d)" value="21" trend="neutral" trendLabel="No action needed" accent="#059669" iconBg="#059669" />
      <KpiCard icon="⚡" label="At Risk (15–25d)" value="6" trend="up" trendLabel="Monitor closely" accent="#D97706" iconBg="#D97706" />
      <KpiCard icon="🔴" label="SLA Breached (> 25d)" value="2" trend="up" trendLabel="Immediate action" accent="#DC2626" iconBg="#DC2626" />
      <KpiCard icon="📊" label="Avg Processing" value="11.4d" trend="down" trendLabel="vs 15d target" accent="#1D4ED8" iconBg="#1D4ED8" />
    </div>
    <div className="card mb-lg">
      <div className="card-header"><div className="card-title">Claims by Aging Bucket</div></div>
      <div className="card-body">
        <div className="kpi-grid kpi-grid-4">
          {[['0–5 Days', 12, '#059669', '40%'], ['6–15 Days', 9, '#1D4ED8', '30%'], ['16–25 Days', 6, '#D97706', '20%'], ['>25 Days (Breached)', 2, '#DC2626', '10%']].map(([label, count, color, pct]) => (
            <div key={label} className="card-clickable card" style={{ padding: 16, borderTop: `3px solid ${color}` }} onClick={() => setView({ screen: 'CLAIMS_LIST', params: {} })}>
              <div style={{ fontSize: 28, fontWeight: 700, color }}>{count}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
              <div className="progress-bar mt-sm"><div className="progress-fill" style={{ width: pct, background: color }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Breached & At-Risk Claims</div></div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Claim ID</th><th>Type</th><th>Insured</th><th>Days Open</th><th>SLA Status</th><th>Current Stage</th><th>Examiner</th><th>Action</th></tr></thead>
          <tbody>
            {CLAIMS.filter(c => c.sla !== 'OK').map(c => (
              <tr key={c.id} className="clickable-row" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } })}>
                <td><span className="table-claim-id">{c.id}</span></td>
                <td>{c.type}</td>
                <td>{c.insured}</td>
                <td><span className="font-bold" style={{ color: c.sla === 'BREACH' ? 'var(--accent-red)' : 'var(--accent-orange)' }}>{c.daysOpen}d</span></td>
                <td><span className={`sla-pill ${getSlaChip(c.sla)}`}>{getSlaLabel(c.sla)}</span></td>
                <td><Chip label={getStatusChip(c.status).label} cls={getStatusChip(c.status).chip} /></td>
                <td>{c.examiner}</td>
                <td onClick={e => e.stopPropagation()}><button className="btn btn-warning btn-sm" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: c.id } })}>Escalate</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ANALYTICS
const Analytics = ({ setView }) => (
  <div className="animate-in">
    <div className="page-header flex items-center justify-between">
      <div><div className="page-title">Reports & Analytics</div><div className="page-subtitle">Enterprise insights across all claim lines · Nov 2024</div></div>
      <div className="flex gap-sm"><button className="btn btn-secondary">📅 Period</button><button className="btn btn-secondary">⬇ Export</button><button className="btn btn-primary">📊 Custom Report</button></div>
    </div>
    <div className="kpi-grid kpi-grid-4 mb-lg">
      <KpiCard icon="📋" label="Claims MTD" value="1,247" trend="up" trendLabel="+8.2%" accent="#1D4ED8" iconBg="#1D4ED8" />
      <KpiCard icon="✅" label="Approval Rate" value="84.3%" trend="up" trendLabel="+2.1pts" accent="#059669" iconBg="#059669" />
      <KpiCard icon="💰" label="Total Payout" value="$84.2M" trend="up" trendLabel="+6.7%" accent="#7C3AED" iconBg="#7C3AED" />
      <KpiCard icon="🤖" label="STP Rate" value="62%" trend="up" trendLabel="+4pts" accent="#D97706" iconBg="#D97706" />
    </div>
    <div className="two-col mb-lg">
      <div className="card">
        <div className="card-header"><div className="card-title">Claims by Status</div><button className="btn btn-ghost btn-sm" onClick={() => setView({ screen: 'CLAIMS_LIST', params: {} })}>Drill Down →</button></div>
        <div className="card-body flex gap-xl items-center">
          <DonutChart data={[{ value: 742, color: '#059669' }, { value: 116, color: '#DC2626' }, { value: 389, color: '#D97706' }]} size={150} />
          <div className="flex-1">
            {[['Approved', 742, '#059669', '59.5%'], ['Pending', 389, '#D97706', '31.2%'], ['Rejected', 116, '#DC2626', '9.3%']].map(([l, v, c, p]) => (
              <div key={l} className="flex items-center justify-between mb-sm">
                <div className="flex items-center gap-sm"><span className="legend-dot" style={{ background: c, width: 10, height: 10, borderRadius: '50%', display: 'inline-block' }} /><span className="text-sm">{l}</span></div>
                <div className="flex items-center gap-md"><span className="font-semibold">{v}</span><span className="text-muted text-sm">{p}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Payout by Product Line</div></div>
        <div className="card-body">
          {[['Term Life 20/30', '$28.4M', 64], ['Whole Life Premier', '$22.1M', 50], ['Fixed Annuity Plus', '$18.6M', 42], ['Universal Life Gold', '$9.3M', 22], ['Variable Annuity Pro', '$5.8M', 13]].map(([l, v, pct]) => (
            <div key={l} className="bar-chart-row" style={{ marginBottom: 14 }}>
              <div className="bar-chart-label" style={{ width: 160 }}>{l}</div>
              <div className="bar-chart-track"><div className="bar-chart-fill progress-blue" style={{ width: `${pct}%`, height: 8, borderRadius: 4 }} /></div>
              <div style={{ width: 60, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Monthly Claim Trend</div></div>
      <div className="card-body">
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 160 }}>
          {[['Jul', 98, 0.6], ['Aug', 115, 0.7], ['Sep', 102, 0.63], ['Oct', 128, 0.78], ['Nov', 142, 0.87]].map(([m, v, pct]) => (
            <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-main)' }}>{v}</span>
              <div style={{ width: '100%', height: `${pct * 140}px`, background: 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)', borderRadius: '4px 4px 0 0', transition: '0.3s' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// AUDIT LOG
const AuditLog = () => (
  <div className="animate-in">
    <div className="page-header flex items-center justify-between">
      <div><div className="page-title">Audit Log</div><div className="page-subtitle">Complete immutable record of all system actions</div></div>
      <div className="flex gap-sm"><button className="btn btn-secondary">⬇ Export</button><button className="btn btn-secondary">🔍 Filter</button></div>
    </div>
    <div className="card">
      <div className="card-header">
        <div className="flex gap-sm">
          <select className="form-select" style={{ width: 160 }}><option>All Users</option>{USERS.map(u => <option key={u.id}>{u.name}</option>)}</select>
          <select className="form-select" style={{ width: 160 }}><option>All Actions</option><option>Claim Created</option><option>Status Changed</option><option>Approved</option><option>Rejected</option><option>Document Uploaded</option></select>
          <input className="form-input" type="date" style={{ width: 160 }} />
        </div>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Entity</th><th>Details</th><th>IP Address</th></tr></thead>
          <tbody>
            {AUDIT_TRAIL.map((a, i) => (
              <tr key={a.id}>
                <td><span className="font-mono text-xs">{a.time}</span></td>
                <td>{a.user.split('(')[0].trim()}</td>
                <td><Chip label={a.role} cls={a.role === 'System' ? 'chip-gray' : 'chip-blue'} /></td>
                <td className="font-semibold text-sm">{a.action}</td>
                <td><span className="table-claim-id">CLM-2024-00891</span></td>
                <td className="text-muted text-sm">{a.note || '—'}</td>
                <td className="font-mono text-xs text-muted">192.168.{i}.{100 + i}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// NOTIFICATIONS
const NotificationsPage = () => (
  <div className="animate-in">
    <div className="page-header flex items-center justify-between">
      <div><div className="page-title">Notification Center</div><div className="page-subtitle">3 unread notifications</div></div>
      <button className="btn btn-secondary">✓ Mark All Read</button>
    </div>
    <div className="card">
      <div className="notif-list">
        {NOTIFICATIONS.map(n => (
          <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
            <div className={`notif-icon`} style={{ background: `var(--${n.bg})` }}>{n.icon}</div>
            <div className="notif-content">
              <div className="notif-title">{n.title}</div>
              <div className="notif-body">{n.body}</div>
              <div className="notif-time">{n.time}</div>
            </div>
            {n.unread && <div className="notif-unread-dot" />}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// EXCEPTIONS
const ExceptionsPage = ({ setView }) => (
  <div className="animate-in">
    <div className="page-header"><div className="page-title">Exception Management</div><div className="page-subtitle">Claims requiring special handling outside standard workflow</div></div>
    <div className="kpi-grid kpi-grid-3 mb-lg">
      <KpiCard icon="⚠️" label="Active Exceptions" value="5" trend="up" trendLabel="+2 this week" accent="#D97706" iconBg="#D97706" />
      <KpiCard icon="⏰" label="Awaiting Decision" value="3" trend="neutral" trendLabel="Avg 4.2 days pending" accent="#1D4ED8" iconBg="#1D4ED8" />
      <KpiCard icon="✅" label="Resolved (MTD)" value="18" trend="up" trendLabel="+6 vs last month" accent="#059669" iconBg="#059669" />
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Open Exceptions</div><button className="btn btn-primary btn-sm">➕ Log Exception</button></div>
      <div className="card-body">
        {[
          { claim: 'CLM-2024-00893', type: 'Contestability Override', desc: 'Claimant requesting waiver of 18-month contestability review.', severity: 'HIGH', owner: 'Legal Counsel' },
          { claim: 'CLM-2024-00891', type: 'Beneficiary Dispute', desc: 'Secondary beneficiary contesting primary allocation.', severity: 'HIGH', owner: 'Mark Ellison' },
          { claim: 'CLM-2024-00897', type: 'Surrender Penalty Waiver', desc: 'Claimant requesting waiver of 5% surrender penalty due to hardship.', severity: 'MED', owner: 'Rachel Park' },
        ].map((ex, i) => (
          <div key={i} className="queue-item" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: ex.claim } })}>
            <div className={`queue-item-priority ${ex.severity === 'HIGH' ? 'priority-high' : 'priority-med'}`} />
            <div className="queue-item-body">
              <div className="queue-item-title">{ex.type}</div>
              <div className="queue-item-meta">{ex.claim} · Owner: {ex.owner}</div>
              <div className="text-sm text-secondary mt-xs">{ex.desc}</div>
            </div>
            <div className="queue-item-actions" onClick={e => e.stopPropagation()}>
              <Chip label={ex.severity} cls={ex.severity === 'HIGH' ? 'chip-red' : 'chip-orange'} />
              <button className="btn btn-primary btn-sm" onClick={() => setView({ screen: 'CLAIM_DETAIL', params: { claimId: ex.claim } })}>Resolve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// DOCUMENTS PAGE
const DocumentsPage = () => (
  <div className="animate-in">
    <div className="page-header flex items-center justify-between">
      <div><div className="page-title">Document Management</div><div className="page-subtitle">All claim documents · Verification status · Deficiency tracking</div></div>
      <button className="btn btn-primary">📤 Upload Documents</button>
    </div>
    <div className="kpi-grid kpi-grid-4 mb-lg">
      <KpiCard icon="📂" label="Total Documents" value="847" trend="neutral" trendLabel="All claims" accent="#1D4ED8" iconBg="#1D4ED8" />
      <KpiCard icon="✅" label="Verified" value="712" trend="up" trendLabel="84.1%" accent="#059669" iconBg="#059669" />
      <KpiCard icon="⏳" label="Pending Verification" value="98" trend="neutral" trendLabel="In queue" accent="#D97706" iconBg="#D97706" />
      <KpiCard icon="❌" label="Rejected / Deficient" value="37" trend="down" trendLabel="Needs re-upload" accent="#DC2626" iconBg="#DC2626" />
    </div>
    <div className="card">
      <div className="card-header"><div className="card-title">Recent Documents</div></div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>Document Name</th><th>Claim ID</th><th>Category</th><th>Format</th><th>Size</th><th>Uploaded</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {DOCUMENTS.map(doc => (
              <tr key={doc.id}>
                <td><div className="flex items-center gap-sm">{doc.icon}<span className="font-semibold">{doc.name}</span></div></td>
                <td><span className="table-claim-id">CLM-2024-00891</span></td>
                <td>{doc.category}</td>
                <td>{doc.format}</td>
                <td>{doc.size}</td>
                <td>{doc.uploaded || '—'}</td>
                <td><Chip label={doc.status} cls={getDocStatusChip(doc.status)} /></td>
                <td><div className="flex gap-sm"><button className="btn btn-secondary btn-sm">👁 Preview</button><button className="btn btn-ghost btn-sm">⬇</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// CONFIG
const ConfigPage = () => (
  <div className="animate-in">
    <div className="page-header"><div className="page-title">System Configuration</div><div className="page-subtitle">Business rules, thresholds, SLA targets, and workflow settings</div></div>
    <div className="two-col">
      <div className="card">
        <div className="card-header"><div className="card-title">SLA Thresholds</div></div>
        <div className="card-body">
          {[['Life Death Claim', '15 days'], ['Annuity Withdrawal', '10 days'], ['ADB Claim', '20 days'], ['Maturity Payout', '7 days'], ['Surrender Claim', '12 days']].map(([r, v]) => (
            <div key={r} className="rule-row">
              <div className="rule-name">{r}</div>
              <div className="rule-value">{v}</div>
              <button className="btn btn-secondary btn-sm">Edit</button>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Approval Thresholds</div></div>
        <div className="card-body">
          {[['L1 — Examiner Approval', '≤ $50,000'], ['L2 — Supervisor Approval', '$50K – $500K'], ['L3 — Senior Manager', '$500K – $2M'], ['L4 — Finance / Compliance', '> $2M or High-Risk']].map(([r, v]) => (
            <div key={r} className="rule-row">
              <div className="rule-name">{r}</div>
              <div className="rule-value">{v}</div>
              <button className="btn btn-secondary btn-sm">Edit</button>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Auto-Processing Rules</div></div>
        <div className="card-body">
          {[['Enable Straight-Through Processing', true], ['Auto-route on low-risk score', true], ['Fraud score auto-escalation', true], ['AML check for claims > $10K', true], ['Duplicate claim detection', true], ['Contestability auto-flag', true]].map(([r, v]) => (
            <div key={r} className="rule-row">
              <div className="rule-name">{r}</div>
              <label className="toggle"><input type="checkbox" defaultChecked={v} /><span className="toggle-slider" /></label>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-header"><div className="card-title">Fraud Risk Weights</div></div>
        <div className="card-body">
          {[['Beneficiary Address Mismatch', '25 pts'], ['Contestability Period Active', '20 pts'], ['Claim Filed < 1yr Policy Issue', '30 pts'], ['Suspicious Cause of Death', '40 pts'], ['Previous Claim on Same Policy', '15 pts']].map(([r, v]) => (
            <div key={r} className="rule-row">
              <div className="rule-name">{r}</div>
              <div className="rule-value">{v}</div>
              <button className="btn btn-secondary btn-sm">Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// USER MANAGEMENT
const UserMgmt = () => (
  <div className="animate-in">
    <div className="page-header flex items-center justify-between">
      <div><div className="page-title">User & Role Management</div><div className="page-subtitle">RBAC configuration, team management, and access control</div></div>
      <button className="btn btn-primary">➕ Add User</button>
    </div>
    <div className="card">
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr><th>User</th><th>Role</th><th>Email</th><th>Queue</th><th>Resolved MTD</th><th>Status</th><th>Last Active</th><th>Actions</th></tr></thead>
          <tbody>
            {USERS.map(u => (
              <tr key={u.id}>
                <td><div className="flex items-center gap-sm"><div className={`avatar avatar-sm ${u.color}`}>{u.avatar}</div><span className="font-semibold">{u.name}</span></div></td>
                <td><Chip label={ROLES[u.role]?.label || u.role} cls="chip-blue" /></td>
                <td>{u.name.toLowerCase().replace(' ', '.')}@lifeshield.com</td>
                <td>{u.queue}</td>
                <td>{u.resolved}</td>
                <td><Chip label="Active" cls="chip-green" /></td>
                <td className="text-muted text-sm">2 hrs ago</td>
                <td><div className="flex gap-sm"><button className="btn btn-secondary btn-sm">Edit</button><button className="btn btn-ghost btn-sm">Deactivate</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('EXEC');
  const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
  const [showNotif, setShowNotif] = useState(false);

  const handleLogin = (role) => {
    setCurrentUser(role);
    setIsLoggedIn(true);
    const dashMap = { EXEC: 'DASHBOARD', SUPERVISOR: 'DASHBOARD', EXAMINER: 'WORK_QUEUE', INTAKE: 'WORK_QUEUE', FINANCE: 'DISBURSEMENTS', COMPLIANCE: 'COMPLIANCE', AGENT: 'NEW_CLAIM', ADMIN: 'CONFIG' };
    setView({ screen: dashMap[role] || 'DASHBOARD', params: {} });
  };

  const navigate = useCallback((screen, params = {}) => setView({ screen, params }), []);

  const getBreadcrumb = () => {
    const screenLabels = {
      DASHBOARD: ['Home', 'Dashboard'],
      CLAIMS_LIST: ['Home', 'Claims', 'All Claims'],
      CLAIM_DETAIL: ['Home', 'Claims', 'Claim Detail', view.params?.claimId || ''],
      NEW_CLAIM: ['Home', 'Claims', 'New Claim'],
      WORK_QUEUE: ['Home', 'Work Queue'],
      APPROVAL_QUEUE: ['Home', 'Approvals', 'Approval Queue'],
      DOCUMENTS: ['Home', 'Documents'],
      COMPLIANCE: ['Home', 'Compliance'],
      EXCEPTIONS: ['Home', 'Exceptions'],
      DISBURSEMENTS: ['Home', 'Finance', 'Disbursements'],
      BENEFIT_CALC: ['Home', 'Finance', 'Benefit Calculator'],
      ANALYTICS: ['Home', 'Analytics', 'Reports'],
      SLA_MONITOR: ['Home', 'Analytics', 'SLA Monitor'],
      AUDIT_LOG: ['Home', 'Compliance', 'Audit Log'],
      NOTIFICATIONS: ['Home', 'Notifications'],
      CONFIG: ['Home', 'Admin', 'Configuration'],
      USER_MGMT: ['Home', 'Admin', 'User Management'],
    };
    return screenLabels[view.screen] || ['Home'];
  };

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

  const renderDashboard = () => {
    if (view.screen === 'DASHBOARD') {
      if (currentUser === 'EXAMINER') return <ExaminerDashboard setView={navigate} />;
      if (currentUser === 'SUPERVISOR') return <SupervisorDashboard setView={navigate} />;
      return <ExecDashboard setView={navigate} />;
    }
    return null;
  };

  const renderScreen = () => {
    const dash = renderDashboard();
    if (dash) return dash;
    switch (view.screen) {
      case 'CLAIMS_LIST': return <ClaimsList setView={navigate} />;
      case 'CLAIM_DETAIL': return <ClaimDetail claimId={view.params?.claimId || CLAIMS[0].id} setView={navigate} />;
      case 'NEW_CLAIM': return <NewClaim setView={navigate} />;
      case 'WORK_QUEUE': return <WorkQueue setView={navigate} />;
      case 'APPROVAL_QUEUE': return <ApprovalQueue setView={navigate} />;
      case 'DOCUMENTS': return <DocumentsPage />;
      case 'COMPLIANCE': return <CompliancePage setView={navigate} />;
      case 'EXCEPTIONS': return <ExceptionsPage setView={navigate} />;
      case 'DISBURSEMENTS': return <Disbursements setView={navigate} />;
      case 'BENEFIT_CALC': return <BenefitCalc />;
      case 'ANALYTICS': return <Analytics setView={navigate} />;
      case 'SLA_MONITOR': return <SLAMonitor setView={navigate} />;
      case 'AUDIT_LOG': return <AuditLog />;
      case 'NOTIFICATIONS': return <NotificationsPage />;
      case 'CONFIG': return <ConfigPage />;
      case 'USER_MGMT': return <UserMgmt />;
      default: return <ExecDashboard setView={navigate} />;
    }
  };

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <div className="app-shell">
      <Sidebar currentUser={currentUser} view={view} setView={navigate} />
      <div className="main-content">
        <Topbar
          breadcrumb={getBreadcrumb()}
          onNotif={() => navigate('NOTIFICATIONS')}
          notifCount={unreadCount}
          currentUser={currentUser}
        />
        {showNotif && (
          <div className="modal-overlay" onClick={() => setShowNotif(false)}>
            <div className="modal" style={{ maxWidth: 420, position: 'absolute', top: 70, right: 24 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header"><div className="modal-title">Notifications</div><button className="btn btn-ghost btn-icon" onClick={() => setShowNotif(false)}>✕</button></div>
              <div className="notif-list" style={{ maxHeight: 400, overflow: 'auto' }}>
                {NOTIFICATIONS.slice(0, 4).map(n => (
                  <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                    <div className="notif-icon" style={{ background: `var(--${n.bg})` }}>{n.icon}</div>
                    <div className="notif-content"><div className="notif-title">{n.title}</div><div className="notif-time">{n.time}</div></div>
                  </div>
                ))}
              </div>
              <div className="modal-footer" style={{ justifyContent: 'center' }}><button className="btn btn-primary btn-sm" onClick={() => { setShowNotif(false); navigate('NOTIFICATIONS'); }}>View All Notifications</button></div>
            </div>
          </div>
        )}
        <div className="page-content">{renderScreen()}</div>
      </div>
    </div>
  );
}
