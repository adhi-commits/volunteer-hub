import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { campaigns } from "../data/campaigns";

const OrganizerDashboard: React.FC = () => {
  // Mock data for organizer stats
  const stats = {
    activeCampaigns: 3,
    totalVolunteers: 145,
    totalImpact: 520, // hours or some metric
    pendingRequests: 5,
  };

  const myCampaigns = campaigns.slice(0, 3); // Just mock with existing campaigns for now

  return (
    <Layout variant="dashboard">
      <section className="pt-28 pb-8 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Organizer Dashboard</h1>
              <p className="text-teal-100">
                Manage your campaigns and track impact.
              </p>
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
                  {myCampaigns.map((camp) => (
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
                            {camp.dateRange}
                            <span className="mx-2">•</span>
                            <span className="material-icons text-xs mr-1">
                              location_on
                            </span>
                            {camp.location}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            camp.status === "Active"
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
                            {camp.volunteersCurrent} / {camp.volunteersTarget}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500"
                            style={{
                              width: `${(camp.volunteersCurrent / camp.volunteersTarget) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button className="text-sm border border-gray-300 rounded px-3 py-1 hover:bg-gray-100">
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
                  ))}
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
    </Layout>
  );
};

export default OrganizerDashboard;
