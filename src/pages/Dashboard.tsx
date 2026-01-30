import React from 'react';
import Layout from '../components/Layout';
import { campaigns } from '../data/campaigns';
import { leaderboard, recentActivity, userStats } from '../data/profile';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  useAnimateOnScroll('.campaign-card');

  const joinedIds = JSON.parse(sessionStorage.getItem('joinedCampaigns') || '[]');
  const joinedCampaignsList = campaigns.filter(c => joinedIds.includes(c.id));
  const recommended = campaigns.filter(c => !joinedIds.includes(c.id)).slice(0, 2);

  return (
    <Layout variant="dashboard">
      <section className="pt-28 pb-8 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, John! 👋</h1>
              <p className="text-teal-100 text-lg">Ready to make a difference today?</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg px-6 py-3 text-center">
                <div className="text-2xl font-bold">{userStats.totalHours}</div>
                <div className="text-sm text-teal-100">Total Hours</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg px-6 py-3 text-center">
                <div className="text-2xl font-bold">{userStats.campaigns}</div>
                <div className="text-sm text-teal-100">Campaigns</div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg px-6 py-3 text-center">
                <div className="text-2xl font-bold">{userStats.points}</div>
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
                  <h3 className="text-3xl font-bold text-gray-800">8</h3>
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
                  <h3 className="text-3xl font-bold text-gray-800">12h</h3>
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
                  <h3 className="text-3xl font-bold text-gray-800">87</h3>
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
                  <h3 className="text-3xl font-bold text-gray-800">{userStats.certificates}</h3>
                </div>
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-orange-600">workspace_premium</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2">
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Active Campaigns</h2>
                {joinedCampaignsList.length === 0 ? (
                  <div className="bg-white rounded-xl shadow p-8 text-center">
                    <p className="text-gray-500 mb-4">You haven't joined any campaigns yet.</p>
                    <Link to="/campaigns" className="btn-primary">Browse Campaigns</Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {joinedCampaignsList.map(campaign => (
                      <Link to={`/campaigns/${campaign.id}/register`} key={campaign.id} className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-teal-500">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="badge badge-yellow">Status: Pending</span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{campaign.category}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{campaign.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{campaign.organization}</p>
                          </div>
                          <span className="material-icons text-teal-600">arrow_forward_ios</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Recommended Campaigns</h2>
                <Link
                  to="/campaigns"
                  className="text-teal-600 hover:text-teal-700 font-semibold text-sm flex items-center"
                >
                  View All
                  <span className="material-icons text-sm ml-1">arrow_forward</span>
                </Link>
              </div>

              <div className="space-y-6">
                {recommended.map((campaign) => {
                  const progress = Math.min(
                    100,
                    Math.round((campaign.volunteersCurrent / campaign.volunteersTarget) * 100),
                  );
                  const statusClass =
                    campaign.status === 'Active'
                      ? 'badge badge-green'
                      : campaign.status === 'Upcoming'
                        ? 'badge badge-yellow'
                        : 'badge badge-gray';
                  const categoryClass =
                    campaign.category === 'Environment'
                      ? 'badge badge-teal'
                      : campaign.category === 'Education'
                        ? 'badge badge-blue'
                        : campaign.category === 'Healthcare'
                          ? 'badge badge-red'
                          : campaign.category === 'Poverty'
                            ? 'badge badge-orange'
                            : 'badge badge-purple';

                  return (
                    <div key={campaign.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition campaign-card">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={statusClass}>{campaign.status}</span>
                            <span className={categoryClass}>{campaign.category}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{campaign.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{campaign.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <span className="material-icons text-teal-600 text-sm mr-1">business</span>
                              {campaign.organization}
                            </span>
                            <span className="flex items-center">
                              <span className="material-icons text-teal-600 text-sm mr-1">location_on</span>
                              {campaign.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              {campaign.volunteersCurrent}/{campaign.volunteersTarget} Volunteers
                            </span>
                            <span className="font-semibold text-gray-800">{progress}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                        <Link to="/register" className="btn-primary">
                          Join Now
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Your Level</h3>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-3">
                    <span className="material-icons text-white text-4xl">workspace_premium</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800">{userStats.level}</h4>
                  <p className="text-sm text-gray-600">Level {userStats.levelNumber}</p>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress to Platinum</span>
                    <span className="font-semibold text-gray-800">450/600 pts</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.title} className="flex items-start">
                      <div className={`${activity.iconBg} w-10 h-10 rounded-lg flex items-center justify-center mr-3`}>
                        <span className={`material-icons ${activity.iconColor} text-sm`}>{activity.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.subtitle}</p>
                        <p className="text-xs text-gray-400">{activity.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Top Volunteers</h3>
                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.position}
                      className={`flex items-center justify-between ${entry.isCurrentUser ? 'bg-teal-50 rounded-lg p-2' : ''
                        }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`${entry.colorClass} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3`}
                        >
                          {entry.position}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{entry.name}</p>
                          <p className="text-xs text-gray-600">{entry.points} points</p>
                        </div>
                      </div>
                      <span className={`material-icons ${entry.iconColor || 'text-yellow-500'}`}>
                        emoji_events
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
