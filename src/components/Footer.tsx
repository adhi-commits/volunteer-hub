import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="material-icons text-teal-500 text-3xl">volunteer_activism</span>
              <span className="text-xl font-bold text-white">VolunteerCollab</span>
            </div>
            <p className="text-sm mb-4">
              Connecting NGOs, volunteers, and donors to create meaningful change together.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-teal-400 transition">
                  Campaigns
                </Link>
              </li>
              <li>
                <Link to="/ngos" className="hover:text-teal-400 transition">
                  NGOs
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-400 transition">
                  Volunteers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-teal-400 transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="material-icons text-teal-500 mr-2 text-sm">email</span>
                support@volunteercollab.org
              </li>
              <li className="flex items-center">
                <span className="material-icons text-teal-500 mr-2 text-sm">phone</span>
                +1 (555) 123-4567
              </li>
              <li className="flex items-center">
                <span className="material-icons text-teal-500 mr-2 text-sm">location_on</span>
                123 Charity Lane, New York, NY 10001
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            © 2026 VolunteerCollab. All rights reserved. Made with <span className="text-red-500">♥</span> for a better world.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
