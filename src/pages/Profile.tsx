import React from 'react';
import Layout from '../components/Layout';
import { campaigns } from '../data/campaigns';
import { certificates, userSkills, userStats } from '../data/profile';

const Profile: React.FC = () => {
  const campaignHistory = [
    {
      ...campaigns[0],
      hours: '8 hours volunteered',
      statusLabel: 'Completed',
    },
    {
      ...campaigns[1],
      hours: '12 hours volunteered',
      statusLabel: 'Ongoing',
    },
    {
      ...campaigns[3],
      hours: '16 hours volunteered',
      statusLabel: 'Completed',
    },
  ];

  const statusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'badge badge-green';
      case 'Ongoing':
        return 'badge badge-yellow';
      default:
        return 'badge badge-gray';
    }
  };

  const categoryBadge = (category: string) => {
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

  return (
    <Layout variant="dashboard">
      <section className="pt-28 pb-8 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-teal-600 text-5xl font-bold shadow-xl">
              J
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">John Doe</h1>
              <p className="text-teal-100 text-lg mb-3">Gold Volunteer • Computer Science Dept</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="badge-light">Photography</span>
                <span className="badge-light">First Aid</span>
                <span className="badge-light">Public Speaking</span>
                <span className="badge-light">Teaching</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition flex items-center">
                <span className="material-icons mr-2">edit</span>
                Edit Profile
              </button>
              <button className="bg-white bg-opacity-20 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition flex items-center">
                <span className="material-icons mr-2">download</span>
                Download CV
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-teal-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                        <span className="material-icons text-teal-600 text-sm">schedule</span>
                      </div>
                      <span className="text-gray-700">Total Hours</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{userStats.totalHours}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                        <span className="material-icons text-blue-600 text-sm">campaign</span>
                      </div>
                      <span className="text-gray-700">Campaigns</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{userStats.campaigns}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                        <span className="material-icons text-purple-600 text-sm">star</span>
                      </div>
                      <span className="text-gray-700">Points</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{userStats.points}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                        <span className="material-icons text-orange-600 text-sm">workspace_premium</span>
                      </div>
                      <span className="text-gray-700">Certificates</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">{userStats.certificates}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Earned Badges</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: 'workspace_premium', from: 'from-yellow-400 to-orange-500', label: 'Gold Level' },
                    { icon: 'camera_alt', from: 'from-blue-400 to-blue-600', label: 'Photo Pro' },
                    { icon: 'eco', from: 'from-green-400 to-green-600', label: 'Eco Warrior' },
                    { icon: 'favorite', from: 'from-red-400 to-red-600', label: 'First Aid' },
                    { icon: 'school', from: 'from-purple-400 to-purple-600', label: 'Teacher' },
                    { icon: 'volunteer_activism', from: 'from-pink-400 to-pink-600', label: 'Volunteer' },
                  ].map((badge) => (
                    <div key={badge.label} className="text-center">
                      <div
                        className={`bg-gradient-to-br ${badge.from} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2`}
                      >
                        <span className="material-icons text-white text-2xl">{badge.icon}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-700">{badge.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Skills</h3>
                <div className="space-y-3">
                  {userSkills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{skill.name}</span>
                        <span className="font-semibold text-gray-800">{skill.level}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${skill.progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Campaign History</h3>
                <div className="space-y-4">
                  {campaignHistory.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-teal-500 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={statusBadge(campaign.statusLabel)}>{campaign.statusLabel}</span>
                            <span className={categoryBadge(campaign.category)}>{campaign.category}</span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-800 mb-2">{campaign.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <span className="material-icons text-teal-600 text-sm mr-1">business</span>
                              {campaign.organization}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="material-icons text-teal-600 text-sm mr-1">location_on</span>
                              {campaign.location}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="material-icons text-teal-600 text-sm mr-1">event</span>
                              {campaign.dateRange}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <span className="material-icons text-teal-600 text-sm mr-1">schedule</span>
                              {campaign.hours}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                            <span className="material-icons text-green-600">
                              {campaign.statusLabel === 'Completed' ? 'check_circle' : 'schedule'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Certificates</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className={`border-2 rounded-lg p-4 hover:shadow-sm transition ${cert.colorClass}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="material-icons text-4xl">workspace_premium</span>
                        <button className="text-current hover:opacity-80">
                          <span className="material-icons">download</span>
                        </button>
                      </div>
                      <h4 className="font-bold text-gray-800 mb-1">{cert.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{cert.org}</p>
                      <p className="text-xs text-gray-500">{cert.issued}</p>
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

export default Profile;
