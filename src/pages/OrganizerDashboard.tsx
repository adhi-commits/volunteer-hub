import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../services/api";
import EditCampaignModal from '../components/EditCampaignModal';
import MessagingPanel from '../components/MessagingPanel';

const OrganizerDashboard: React.FC = () => {
  const [myCampaigns, setMyCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const filteredCampaigns = myCampaigns.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchCampaigns = async () => {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const res = await fetch(`${api.campaigns.list}?organizer_id=${userId}`);
          const data = await res.json();
          setMyCampaigns(data);
        } catch (err) {
          console.error("Failed to fetch campaigns", err);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchUnread = async () => {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const res = await fetch(api.messages.getUnreadCount(Number(userId)));
          const data = await res.json();
          setUnreadCount(data.unread_count || 0);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchCampaigns();
    fetchUnread();
    
    // Poll unread messages
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleEditSuccess = () => {
      setEditingCampaign(null);
      // We would ideally abstract fetchCampaigns out of useEffect, or just do a window.reload, or re-fetch some other way.
      // Easiest is to just reload page to ensure fresh data.
      window.location.reload();
  };
  const stats = {
    activeCampaigns: myCampaigns.length,
    totalVolunteers: myCampaigns.reduce(
      (acc, c) => acc + (c.volunteers_current || 0),
      0,
    ),
    totalImpact: Math.round(myCampaigns.reduce((acc, c) => {
      const start = new Date(c.start_date);
      const end = new Date(c.end_date);
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return acc + (Math.max(0, durationHours) * (c.volunteers_current || 0));
    }, 0)),
    pendingRequests: 0,
  };

  const userName = sessionStorage.getItem('userName') || 'Organizer';

  return (
    <Layout variant="dashboard">
      <section className="pt-28 pb-8 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {userName}!</h1>
              <p className="text-teal-100">
                Manage your campaigns and track impact.
              </p>
            </div>
            <div className="relative w-full md:w-1/2 lg:w-1/3">
              <span className="material-icons absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-700 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="text-gray-500 text-sm mb-1">Active Campaigns</div>
              <div className="text-3xl font-bold text-gray-800">
                {stats.activeCampaigns}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="text-gray-500 text-sm mb-1">Total Volunteers</div>
              <div className="text-3xl font-bold text-gray-800">
                {stats.totalVolunteers}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="text-gray-500 text-sm mb-1">Impact Hours</div>
              <div className="text-3xl font-bold text-gray-800">
                {stats.totalImpact}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="text-gray-500 text-sm mb-1">Pending Requests</div>
              <div className="text-3xl font-bold text-gray-800">
                {stats.pendingRequests}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* My Campaigns */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    My Campaigns
                  </h2>
                  <Link
                    to="/campaigns"
                    className="text-teal-600 text-sm font-semibold hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                      <p className="mt-4 text-gray-500">
                        Loading your campaigns...
                      </p>
                    </div>
                  ) : filteredCampaigns.length === 0 ? (
                    <div className="text-center py-20 px-6">
                      <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons text-gray-400 text-4xl">
                          {search ? "search_off" : "campaign"}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        {search ? "No matches found" : "No campaigns found"}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {search
                          ? `We couldn't find any campaigns matching "${search}"`
                          : "You haven't launched any campaigns yet. Start your journey today!"}
                      </p>
                      {!search && (
                        <Link
                          to="/create-campaign"
                          className="inline-flex items-center text-teal-600 font-semibold hover:underline"
                        >
                          Create your first campaign
                          <span className="material-icons text-sm ml-1">
                            arrow_forward
                          </span>
                        </Link>
                      )}
                    </div>
                  ) : (
                    filteredCampaigns.map((camp) => (
                      <div
                        key={camp.id}
                        className="p-6 hover:bg-gray-50 transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">
                              {camp.title}
                            </h3>
                            <div className="text-gray-500 text-sm flex items-center mt-1">
                              <span className="material-icons text-xs mr-1">
                                event
                              </span>
                              {new Date(camp.start_date).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - {new Date(camp.end_date).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              <span className="mx-2">•</span>
                              <span className="material-icons text-xs mr-1">
                                location_on
                              </span>
                              {camp.location}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${camp.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {camp.status}
                          </span>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">
                              Volunteers Joined
                            </span>
                            <span className="font-medium">
                              {camp.volunteers_current || 0} /{" "}
                              {camp.volunteers_target}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-500"
                              style={{
                                width: `${((camp.volunteers_current || 0) / camp.volunteers_target) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-3">
                          <button 
                            onClick={() => setEditingCampaign(camp)}
                            className="text-sm border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 transition"
                          >
                            Edit
                          </button>
                          <Link
                            to={`/campaign-volunteers/${camp.id}`}
                            className="text-sm border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 transition inline-flex items-center"
                          >
                            View Volunteers
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar / Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-orange-500">
                <h3 className="font-bold text-gray-800 mb-2 text-xl">
                  Create a New Campaign
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Ready to make a difference? Launch a new campaign to connect
                  with volunteers.
                </p>
                <Link
                  to="/create-campaign"
                  className="block w-full bg-orange-500 text-white text-center py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-md"
                >
                  <span className="material-icons align-middle mr-2">
                    add_circle
                  </span>
                  Post Campaign
                </Link>
              </div>

              <div className="bg-teal-50 rounded-xl shadow-sm p-6 border border-teal-100">
                <h3 className="font-bold text-teal-800 mb-2">Campaign Tips</h3>
                <ul className="space-y-2 text-sm text-teal-700">
                  <li className="flex items-start">
                    <span className="material-icons text-teal-500 text-sm mr-2 mt-0.5">
                      check_circle
                    </span>
                    Add clear, descriptive titles.
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-teal-500 text-sm mr-2 mt-0.5">
                      check_circle
                    </span>
                    Set realistic volunteer targets.
                  </li>
                  <li className="flex items-start">
                    <span className="material-icons text-teal-500 text-sm mr-2 mt-0.5">
                      check_circle
                    </span>
                    Keep volunteers updated.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {editingCampaign && (
        <EditCampaignModal 
            campaign={editingCampaign} 
            onClose={() => setEditingCampaign(null)} 
            onUpdateSuccess={handleEditSuccess}
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
      <MessagingPanel isOpen={isMessagingOpen} onClose={() => setIsMessagingOpen(false)} />
    </Layout>
  );
};

export default OrganizerDashboard;
