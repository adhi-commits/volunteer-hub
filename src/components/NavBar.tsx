import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

type NavVariant = 'public' | 'dashboard';

interface Props {
  variant?: NavVariant;
}

const NavBar: React.FC<Props> = ({ variant = 'public' }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const publicLinks = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/campaigns', label: 'Campaigns', icon: 'campaign' },
    { to: '/login', label: 'Login', icon: 'login' },
  ];

  const userRole = sessionStorage.getItem('userRole');
  const dashboardTarget = userRole === 'organizer' ? '/organizer-dashboard' : '/dashboard';

  const dashboardLinks = [
    { to: dashboardTarget, label: 'Dashboard', icon: 'dashboard' },
    ...(userRole !== 'organizer' ? [{ to: '/campaigns', label: 'Campaigns', icon: 'campaign' }] : []),
    { to: '/profile', label: 'Profile', icon: 'person' },
  ];

  const links = variant === 'dashboard' ? dashboardLinks : publicLinks;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${variant === 'dashboard' ? 'nav-link' : 'flex items-center text-gray-700 hover:text-teal-600 transition'} ${isActive ? 'text-teal-600 font-medium' : ''
    }`;

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="material-icons text-teal-600 text-3xl">volunteer_activism</span>
            <span className="text-2xl font-bold text-gray-800">
              Volunteer<span className="text-teal-600">Collab</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <span className="material-icons text-sm mr-1">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            {variant === 'public' && (
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            )}
            {variant === 'dashboard' && (
              <div className="relative">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-teal-600 transition">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                    J
                  </div>
                  <span className="material-icons text-sm">arrow_drop_down</span>
                </button>
              </div>
            )}
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((open) => !open)}
            className="md:hidden text-gray-700"
          >
            <span className="material-icons text-3xl">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${mobileOpen ? 'block' : 'hidden'} md:hidden bg-white border-t`}>
        <div className="container mx-auto px-6 py-4 flex flex-col space-y-3">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `mobile-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <span className="material-icons mr-2">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          {variant === 'public' && (
            <Link
              to="/register"
              className="bg-teal-600 text-white px-6 py-2 rounded-lg text-center"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
