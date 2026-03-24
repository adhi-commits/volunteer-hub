import React, { useMemo, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import type { Campaign } from '../types';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { api } from '../services/api';

import CampaignModal from '../components/CampaignModal';
import MessagingPanel from '../components/MessagingPanel';

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
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Messaging state
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [messageContactId, setMessageContactId] = useState<number | null>(null);

  const handleMessageOrganizer = (contactId: number) => {
    setMessageContactId(contactId);
    setIsMessagingOpen(true);
    setSelectedCampaign(null); // Optional: close modal when messaging
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(api.campaigns.list);
        const data = await response.json();

        // Map API response to Campaign type
        const mappedCampaigns: Campaign[] = data.map((camp: any) => ({
          id: camp.id,
          title: camp.title,
          description: camp.description,
          organization: `Organizer #${camp.organizer_id}`, // We'll need to fetch organizer name separately if needed
          organizerId: camp.organizer_id,
          category: camp.category as Campaign['category'],
          location: camp.location,
          dateRange: `${new Date(camp.start_date).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - ${new Date(camp.end_date).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
          volunteersTarget: camp.volunteers_target,
          volunteersCurrent: camp.volunteers_current || 0,
          status: camp.status as Campaign['status'],
        }));

        setCampaigns(mappedCampaigns);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

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
    [search, category, status, campaigns],
  );

  /* Check for logged in user to show correct nav */
  const userRole = localStorage.getItem('userRole');
  const layoutVariant = userRole ? 'dashboard' : 'public';

  return (
    <Layout variant={layoutVariant}>
      {/* Header */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-teal-50 to-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Discover Campaigns</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find meaningful opportunities to contribute to causes you care about
          </p>

          <div className="flex flex-col gap-6">
            <div className="relative w-full">
              <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                id="searchCampaign"
                placeholder="Search campaigns or Organizers..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-lg text-gray-800 bg-white shadow-lg border-2 border-transparent focus:border-teal-500 focus:outline-none transition-all placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <select
                id="categoryFilter"
                className="input-field flex-1 min-w-[200px] bg-white text-gray-700 font-medium py-3"
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
                className="input-field flex-1 min-w-[200px] bg-white text-gray-700 font-medium py-3"
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
        </div>
      </section>

      {/* Campaign Cards */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading campaigns...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No campaigns found matching your criteria.</p>
            </div>
          ) : (
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

                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        {campaign.volunteersTarget - campaign.volunteersCurrent} Slots Left
                      </span>
                      <span className="font-semibold text-gray-800">
                        {campaign.volunteersCurrent}/{campaign.volunteersTarget} Joined
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${isCompleted ? 'bg-gray-500' : ''}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    {isCompleted ? (
                      <button className="bg-gray-400 text-white px-6 py-3 rounded-lg w-full cursor-not-allowed mt-4" disabled>
                        Campaign Ended
                      </button>
                    ) : campaign.volunteersCurrent >= campaign.volunteersTarget ? (
                      <button className="bg-red-100 text-red-600 px-6 py-3 rounded-lg w-full cursor-not-allowed mt-4 font-bold flex items-center justify-center" disabled>
                        <span className="material-icons mr-2 text-sm">block</span>
                        Slots Filled
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="btn-primary w-full justify-center mt-4"
                      >
                        Join Now
                        <span className="material-icons ml-2 text-sm">arrow_forward</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {
        selectedCampaign && (
          <CampaignModal
            campaign={selectedCampaign}
            onClose={() => setSelectedCampaign(null)}
            onMessageOrganizer={handleMessageOrganizer}
          />
        )
      }
      
      {/* Messaging Panel for non-dashboard pages (only for logged-in users) */}
      {userRole && (
        <>
          {!isMessagingOpen && (
            <button 
              onClick={() => setIsMessagingOpen(true)}
              className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40 transition transform hover:scale-105"
            >
              <span className="material-icons">chat</span>
            </button>
          )}
          <MessagingPanel 
            isOpen={isMessagingOpen} 
            onClose={() => setIsMessagingOpen(false)} 
            initialContactId={messageContactId}
          />
        </>
      )}
    </Layout>
  );
};

export default Campaigns;
