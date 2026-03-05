'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  CalendarClock,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  NotebookTabs,
  ShieldCheck,
  UserRound,
  UsersRound
} from 'lucide-react';
import { useAuth } from './auth-provider';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, blurb: 'Realtime pulse' },
  { href: '/patients', label: 'Patients', icon: UsersRound, blurb: 'Clinical records' },
  { href: '/bookings', label: 'Bookings', icon: CalendarClock, blurb: 'Appointment flow' },
  { href: '/sessions', label: 'Sessions Editor', icon: ClipboardCheck, blurb: 'Manual notes workspace' },
  { href: '/notes', label: 'Note Library', icon: NotebookTabs, blurb: 'Session documentation' }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userName, logout } = useAuth();

  const active = navItems.find((item) => pathname.startsWith(item.href)) ?? navItems[0];

  return (
    <div className="shell-root">
      <aside className="shell-sidebar">
        <div className="brand">
          <div className="brand-mark">
            <img alt="Serenica logo" src="/serenica-logo.png" />
          </div>
          <div>
            <h1>Serenica</h1>
            <p>Clinical intelligence workspace</p>
          </div>
        </div>

        <div className="sidebar-state">
          <Activity size={15} />
          <span>System status: online</span>
        </div>

        <nav className="nav-list">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const activeItem = pathname.startsWith(item.href);
            return (
              <Link className={`nav-item ${activeItem ? 'active' : ''}`} href={item.href} key={item.href}>
                <div className="nav-index">{String(index + 1).padStart(2, '0')}</div>
                <div className="nav-icon-wrap">
                  <Icon size={16} />
                </div>
                <div>
                  <span>{item.label}</span>
                  <p>{item.blurb}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-row">
            <div className="user-icon"><UserRound size={16} /></div>
            <div>
              <strong>{userName}</strong>
              <p>Authenticated via Keycloak</p>
            </div>
            <ShieldCheck size={15} className="secure-icon" />
          </div>
          <button className="logout-btn" onClick={logout} type="button">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="shell-main">
        <header className="shell-topbar">
          <div>
            <p className="topbar-kicker">Workspace</p>
            <h2>{active.label}</h2>
          </div>
          <div className="topbar-badge">HIPAA-ready workflow</div>
        </header>
        {children}
      </main>
    </div>
  );
}
