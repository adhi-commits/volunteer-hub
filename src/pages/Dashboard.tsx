import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CampaignModal from '../components/CampaignModal';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { useToast } from '../hooks/useToast';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Campaign } from '../types';
import MessagingPanel from '../components/MessagingPanel';

const Dashboard: React.FC = () => {
  useAnimateOnScroll('.campaign-card');

  const [joinedCampaignsList, setJoinedCampaignsList] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const { showToast } = useToast();
  const [stats, setStats] = useState({
    totalHours: 0,
    campaigns: 0,
    points: 0,
    certificates: 0,
    impactScore: 0
  });

  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [messageContactId, setMessageContactId] = useState<number | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchJoinedCampaigns = () => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      fetch(`${api.campaigns.joined}?user_id=${userId}`)
        .then(res => res.json())
        .then(data => {
          setJoinedCampaignsList(data);
          setStats(prev => ({ ...prev, campaigns: data.length }));
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      // Fetch Joined Campaigns
      fetchJoinedCampaigns();

      // Fetch Certificates Count
      fetch(api.certificates.getUserCertificates(userId))
        .then(res => res.json())
        .then(data => {
          setStats(prev => ({ ...prev, certificates: data.length }));
        })
        .catch(console.error);
    }

    const fetchUnread = async () => {
      const uId = sessionStorage.getItem('userId');
      if (uId) {
        try {
          const res = await fetch(api.messages.getUnreadCount(Number(uId)));
          const data = await res.json();
          setUnreadCount(data.unread_count || 0);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  const openContactMessage = (contactId: number) => {
    setMessageContactId(contactId);
    setIsMessagingOpen(true);
  };

  const handleCancelRegistration = async (e: React.MouseEvent, campaignId: number, campaignTitle: string) => {
    e.preventDefault(); // Prevent Link navigation
    
    if (!window.confirm(`Are you sure you want to cancel your registration for '${campaignTitle}'?`)) {
        return;
    }

    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    try {
        const response = await fetch(api.campaigns.cancel(campaignId), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: Number(userId) })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Registration cancelled successfully', 'success');
            fetchJoinedCampaigns(); // Refresh the list
        } else {
            showToast(data.error || 'Failed to cancel registration', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        showToast('You must be logged in to submit feedback', 'error');
        return;
    }

    setIsSubmittingFeedback(true);
    try {
        const response = await fetch(api.feedback.submit, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: Number(userId), message: feedbackMessage.trim() })
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Thank you for your feedback!', 'success');
            setFeedbackMessage(''); // Clear the form
        } else {
            showToast(data.error || 'Failed to submit feedback', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    } finally {
        setIsSubmittingFeedback(false);
    }
  };

  const userName = sessionStorage.getItem('userName') || 'Volunteer';

  return (
    <Layout variant="dashboard">
      <section className="pt-28 pb-8 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
              <p className="text-teal-100 text-lg">Ready to make a difference today?</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg px-6 py-3 text-center">
                <div className="text-2xl font-bold">{stats.totalHours}</div>
                <div className="text-sm text-teal-100">Total Hours</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg px-6 py-3 text-center">
                <div className="text-2xl font-bold">{stats.campaigns}</div>
                <div className="text-sm text-teal-100">Campaigns</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg px-6 py-3 text-center">
                <div className="text-2xl font-bold">{stats.points}</div>
                <div className="text-sm text-teal-100">Points</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Active Campaigns</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.campaigns}</h3>
                </div>
                <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-teal-600">campaign</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">This Month</p>
                  <h3 className="text-3xl font-bold text-gray-800">0h</h3>
                </div>
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-blue-600">schedule</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Impact Score</p>
                  <h3 className="text-3xl font-bold text-gray-800">0</h3>
                </div>
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-purple-600">star</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Certificates</p>
                  <h3 className="text-3xl font-bold text-gray-800">{stats.certificates}</h3>
                </div>
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-orange-600">workspace_premium</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Active Campaigns</h2>
            {joinedCampaignsList.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <p className="text-gray-500 mb-4">You haven't joined any campaigns yet.</p>
                <Link to="/campaigns" className="btn-primary">Browse Campaigns</Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {joinedCampaignsList.map(campaign => (
                  <Link to={`/campaigns/${campaign.id}/register`} key={campaign.id} className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-teal-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`badge ${campaign.registration_status === 'Approved' ? 'badge-green' :
                            campaign.registration_status === 'Rejected' ? 'badge-red' :
                              'badge-yellow'
                            }`}>
                            Status: {campaign.registration_status}
                          </span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{campaign.category}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{campaign.organization}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-3">
                        <span className="material-icons text-teal-600">arrow_forward_ios</span>
                        <div className="flex flex-col gap-2 mt-2">
                          <button
                            onClick={(e) => { e.preventDefault(); openContactMessage(campaign.organizer_id); }}
                            className="bg-teal-50 text-teal-700 hover:bg-teal-100 px-3 py-1.5 rounded text-sm font-semibold transition flex items-center justify-center border border-teal-100"
                            title="Message Organizer"
                          >
                            <span className="material-icons text-[16px] mr-1">chat</span> Message
                          </button>
                          <button
                            onClick={(e) => handleCancelRegistration(e, campaign.id, campaign.title)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded text-sm font-semibold transition flex items-center justify-center border border-red-100"
                            title="Cancel Registration"
                          >
                            <span className="material-icons text-[16px] mr-1">cancel</span> Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* Feedback Section */}
          <div className="mt-12">
            <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-teal-600">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Have Feedback?</h2>
              <p className="text-gray-600 mb-6">Let us know how we can improve the Volunteer Hub experience.</p>
              
              <form onSubmit={handleFeedbackSubmit} className="max-w-xl">
                <textarea
                  className="w-full text-gray-800 rounded-lg border-gray-300 focus:ring-teal-500 focus:border-teal-500 p-4 border block mb-4"
                  rows={4}
                  placeholder="Share your thoughts, suggestions, or report an issue..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  disabled={isSubmittingFeedback}
                ></textarea>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSubmittingFeedback || !feedbackMessage.trim()}
                >
                  {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Modal */}
      {selectedCampaign && (
        <CampaignModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}

      {/* Messaging Panel */}
      {!isMessagingOpen && (
        <button 
          onClick={() => setIsMessagingOpen(true)}
          className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-40 transition transform hover:scale-105"
        >
          <span className="material-icons">chat</span>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      )}
      <MessagingPanel 
        isOpen={isMessagingOpen} 
        onClose={() => setIsMessagingOpen(false)} 
        initialContactId={messageContactId} 
      />
    </Layout >
  );
};

export default Dashboard;
