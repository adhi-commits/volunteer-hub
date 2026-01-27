import React, { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { campaigns } from '../data/campaigns';
import type { Campaign } from '../types';
import { Link } from 'react-router-dom';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

const statusBadgeClass = (status: Campaign['status']) => {
  switch (status) {
    case 'Active':
      return 'badge badge-green';
    case 'Upcoming':
      return 'badge badge-yellow';
    case 'Completed':
      return 'badge badge-gray';
    default:
      return 'badge badge-gray';
  }
};

const categoryBadgeClass = (category: Campaign['category']) => {
  switch (category) {
    case 'Environment':
      return 'badge badge-teal';
    case 'Education':
      return 'badge badge-blue';
    case 'Healthcare':
      return 'badge badge-red';
    case 'Poverty':
      return 'badge badge-orange';
    case 'Human Rights':
      return 'badge badge-purple';
    default:
      return 'badge badge-gray';
  }
};

const Campaigns: React.FC = () => {
  useAnimateOnScroll('.campaign-card');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const filtered = useMemo(
    () =>
      campaigns.filter((campaign) => {
        const matchesSearch =
          campaign.title.toLowerCase().includes(search.toLowerCase()) ||
          campaign.organization.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category ? campaign.category.toLowerCase() === category.toLowerCase() : true;
        const matchesStatus = status ? campaign.status.toLowerCase() === status.toLowerCase() : true;
        return matchesSearch && matchesCategory && matchesStatus;
      }),
    [search, category, status],
  );

  return (
    <Layout>
      {/* Header */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-teal-50 to-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Discover Campaigns</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find meaningful opportunities to contribute to causes you care about
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="material-icons absolute left-3 top-3 text-gray-400">search</span>
              <input
                type="text"
                id="searchCampaign"
                placeholder="Search campaigns or NGOs..."
                className="input-field pl-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              id="categoryFilter"
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Poverty">Poverty</option>
              <option value="Human Rights">Human Rights</option>
            </select>
            <select
              id="statusFilter"
              className="input-field"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </section>

      {/* Campaign Cards */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8" id="campaignGrid">
            {filtered.map((campaign) => {
              const progress = Math.min(
                100,
                Math.round((campaign.volunteersCurrent / campaign.volunteersTarget) * 100),
              );
              const isCompleted = campaign.status === 'Completed';
              return (
                <div key={campaign.id} className="campaign-card">
                  <div className="flex items-start justify-between mb-4">
                    <span className={statusBadgeClass(campaign.status)}>{campaign.status}</span>
                    <span className={categoryBadgeClass(campaign.category)}>{campaign.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{campaign.title}</h3>
                  <p className="text-gray-600 mb-4">{campaign.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="material-icons text-teal-600 text-sm mr-2">business</span>
                      <span className="font-medium">{campaign.organization}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="material-icons text-teal-600 text-sm mr-2">location_on</span>
                      {campaign.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="material-icons text-teal-600 text-sm mr-2">event</span>
                      {campaign.dateRange}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Volunteers</span>
                      <span className="font-semibold text-gray-800">
                        {campaign.volunteersCurrent}/{campaign.volunteersTarget}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${isCompleted ? 'bg-gray-500' : ''}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {isCompleted ? (
                    <button className="bg-gray-400 text-white px-6 py-3 rounded-lg w-full cursor-not-allowed" disabled>
                      Campaign Ended
                    </button>
                  ) : (
                    <Link to="/register" className="btn-primary w-full justify-center">
                      Register Now
                      <span className="material-icons ml-2 text-sm">arrow_forward</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Campaigns;
