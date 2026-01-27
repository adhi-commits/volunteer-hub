import React from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

interface Props {
  children: React.ReactNode;
  variant?: 'public' | 'dashboard';
}

const Layout: React.FC<Props> = ({ children, variant = 'public' }) => {
  return (
    <div className="font-inter bg-gray-50 min-h-screen">
      <NavBar variant={variant} />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
