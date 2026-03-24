import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

type NavVariant = 'public' | 'dashboard';

interface Props {
  variant?: NavVariant;
}

const NavBar: React.FC<Props> = ({ variant: manualVariant }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    setDropdownOpen(false);
    navigate('/login');
    window.location.reload(); // Force reload to update navbar state
  };

  // Determine user status
  const userRole = sessionStorage.getItem('userRole');

  // Logic: If userRole exists, always use 'dashboard' style unless explicitly told otherwise
  const activeVariant: NavVariant = userRole ? 'dashboard' : 'public';
  
  let dashboardTarget = '/dashboard';
  if (userRole === 'organizer') dashboardTarget = '/organizer-dashboard';
  if (userRole === 'admin') dashboardTarget = '/admin-dashboard';

  const publicLinks = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/campaigns', label: 'Campaigns', icon: 'campaign' },
    { to: '/login', label: 'Login', icon: 'login' },
  ];

  const dashboardLinks = [
    { to: dashboardTarget, label: 'Dashboard', icon: 'dashboard' },
    // Only volunteers get the Campaigns tab
    ...(userRole === 'volunteer' ? [{ to: '/campaigns', label: 'Campaigns', icon: 'campaign' }] : []),
    ...(userRole !== 'admin' ? [{ to: '/profile', label: 'Profile', icon: 'person' }] : []),
  ];

  const links = activeVariant === 'dashboard' ? dashboardLinks : publicLinks;

  const getLinkStyles = (isActive: boolean) => {
    const baseClasses = "flex items-center transition-all duration-200 rounded-lg px-4 py-2 text-sm font-semibold";

    if (activeVariant === 'dashboard') {
      return isActive
        ? `${baseClasses} bg-teal-600 text-white shadow-md` // Solid teal when active
        : `${baseClasses} text-gray-600 hover:bg-teal-50 hover:text-teal-600`;
    }

    return isActive
      ? `${baseClasses} text-teal-600 bg-teal-50`
      : `${baseClasses} text-gray-700 hover:text-teal-600 hover:bg-gray-50`;
  };

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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => getLinkStyles(isActive)}
              >
                <span className="material-icons text-lg mr-2">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}

            <div className="ml-4 pl-4 border-l border-gray-100 flex items-center">
              {activeVariant === 'public' ? (
                <Link to="/register" className="btn-primary ml-2">
                  Get Started
                </Link>
              ) : (
                <div className="relative ml-4">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 group focus:outline-none"
                  >
                    <div className="w-9 h-9 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold border-2 border-teal-600 transition-transform group-hover:scale-105">
                      {(sessionStorage.getItem('userName') || 'User').charAt(0).toUpperCase()}
                    </div>
                    <span className="material-icons text-gray-400 group-hover:text-teal-600 transition-transform duration-200" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>arrow_drop_down</span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 animate-fade-in-down">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">Signed in as</p>
                        <p className="text-xs text-gray-500 truncate">{sessionStorage.getItem('userName') || 'User'}</p>
                      </div>

                      {userRole !== 'admin' && (
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="material-icons text-sm mr-2">person</span>
                          Your Profile
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="material-icons text-sm mr-2">logout</span>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-700 p-2">
            <span className="material-icons text-3xl">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${mobileOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-100`}>
        <div className="container mx-auto px-6 py-6 flex flex-col space-y-2">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-600 hover:bg-teal-50'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <span className="material-icons mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;