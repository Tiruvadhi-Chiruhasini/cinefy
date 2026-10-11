import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Film, LayoutDashboard, Menu, Sparkles, Users, X } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/movies', label: 'Movies', icon: Film },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/recommendations', label: 'Recommendations', icon: Sparkles },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

function NavList({ onNavigate }) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? 'bg-accent-soft text-accent-dark' : 'text-muted hover:bg-paper hover:text-ink'
            }`
          }
        >
          <Icon size={17} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div>
      <p className="font-serif text-2xl font-semibold tracking-tight">Cinefy</p>
      <p className="text-xs text-muted">Discover. Analyze. Recommend.</p>
    </div>
  );
}

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen lg:flex">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-8 border-r border-line bg-surface px-4 py-6 lg:flex">
        <Brand />
        <NavList />
        <p className="mt-auto text-xs text-muted">Demo build with sample data.</p>
      </aside>

      {/* Mobile / tablet top bar */}
      <div className="sticky top-0 z-30 border-b border-line bg-surface lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Brand />
          <button
            type="button"
            className="btn px-2"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
        {open && (
          <div id="mobile-nav" className="border-t border-line px-3 py-3">
            <NavList onNavigate={() => setOpen(false)} />
          </div>
        )}
      </div>

      <main id="main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
