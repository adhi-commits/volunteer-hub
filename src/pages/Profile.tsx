import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { campaigns } from '../data/campaigns';
import { certificates, userSkills, userStats } from '../data/profile';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { api } from '../services/api';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const userRole = sessionStorage.getItem('userRole');

  const handleLogout = () => {
    sessionStorage.removeItem('userRole');
    showToast('Logged out successfully', 'success');
    setTimeout(() => navigate('/'), 1000);
  };

  // Organizer Mock Data
  const hostedCampaigns = campaigns.slice(0, 3).map(c => ({
    ...c,
    volunteers: Math.floor(Math.random() * 50) + 10,
    statusLabel: c.status
  }));

  const [issuedCertificates, setIssuedCertificates] = React.useState<any[]>([]);

  // Fetch certificates from backend
  React.useEffect(() => {
    const fetchCertificates = async () => {
      // For organizers, we might want to see certificates they issued (not implemented yet in backend for specific organizer, but we can reuse the user one if needed or skip)
      // For volunteers, we fetch their received certificates
      // The current backend route is /api/certificates/user/:userId

      const userId = sessionStorage.getItem('userId'); // We need to ensure userId is stored in session
      if (!userId) return; // Or handle appropriately

      try {
        const res = await fetch(api.certificates.getUserCertificates(userId));
        if (res.ok) {
          const data = await res.json();
          // Map backend data to frontend structure
          const mappedCerts = data.map((c: any) => ({
            id: c.id,
            title: c.campaign_title || 'Certificate of Appreciation',
            recipient: sessionStorage.getItem('userName') || 'Volunteer', // In a real app the cert would have this
            date: new Date(c.issued_at).toLocaleDateString(),
            org: c.campaign_org || 'Volunteer Hub',
            full_image_url: c.full_image_url,
            colorClass: 'border-teal-500 bg-teal-50' // Default styling
          }));
          setIssuedCertificates(mappedCerts);
        }
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      }
    };

    if (userRole === 'volunteer') {
      fetchCertificates();
    }
  }, [userRole]);




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
      <Toast toast={toast} />
      <section className="pt-28 pb-8 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-teal-600 text-5xl font-bold shadow-xl">
              {(sessionStorage.getItem('userName') || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">{sessionStorage.getItem('userName') || 'User'}</h1>
              <p className="text-teal-100 text-lg mb-3">
                {userRole === 'organizer' ? 'Organizer • Community Leader' : 'Gold Volunteer • Computer Science Dept'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {userRole === 'organizer' ? (
                  <>
                    <span className="badge-light">Community Building</span>
                    <span className="badge-light">Social Service</span>
                    <span className="badge-light">Event Management</span>
                    <span className="badge-light">Mentorship</span>
                  </>
                ) : (
                  <>
                    <span className="badge-light">Photography</span>
                    <span className="badge-light">First Aid</span>
                    <span className="badge-light">Public Speaking</span>
                    <span className="badge-light">Teaching</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-4">

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center shadow-lg"
              >
                <span className="material-icons mr-2">logout</span>
                Logout
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
                <h3 className="text-xl font-bold text-gray-800 mb-4">{userRole === 'organizer' ? 'Organizer Stats' : 'Statistics'}</h3>
                <div className="space-y-4">
                  {userRole === 'organizer' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-teal-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                            <span className="material-icons text-teal-600 text-sm">campaign</span>
                          </div>
                          <span className="text-gray-700">Hosted Campaigns</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{hostedCampaigns.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                            <span className="material-icons text-orange-600 text-sm">workspace_premium</span>
                          </div>
                          <span className="text-gray-700">Certificates Issued</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{issuedCertificates.length}</span>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              {userRole !== 'organizer' && (
                <>
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
                </>
              )}
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{userRole === 'organizer' ? 'Campaigns Hosted' : 'Campaign History'}</h3>
                <div className="space-y-4">
                  {(userRole === 'organizer' ? hostedCampaigns : campaignHistory).map((campaign) => (
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
                            {userRole !== 'organizer' && (
                              <div className="flex items-center text-gray-600">
                                <span className="material-icons text-teal-600 text-sm mr-1">schedule</span>
                                {/* @ts-ignore - campaignHistory has hours prop */}
                                {campaign.hours}
                              </div>
                            )}
                            {userRole === 'organizer' && (
                              <div className="flex items-center text-gray-600">
                                <span className="material-icons text-teal-600 text-sm mr-1">group</span>
                                {/* @ts-ignore - hostedCampaigns has volunteers prop */}
                                {campaign.volunteers} Volunteers
                              </div>
                            )}
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
                <h3 className="text-xl font-bold text-gray-800 mb-4">{userRole === 'organizer' ? 'Certificates Issued' : 'Certificates'}</h3>
                {userRole === 'organizer' ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                        <tr>
                          <th className="py-3 px-4">Certificate Name</th>
                          <th className="py-3 px-4">Recipient</th>
                          <th className="py-3 px-4">Issued On</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {issuedCertificates.map((cert) => (
                          <tr key={cert.id} className="hover:bg-gray-50 transition">
                            <td className="py-3 px-4 font-medium text-gray-800">{cert.title}</td>
                            <td className="py-3 px-4 text-gray-600">{cert.recipient}</td>
                            <td className="py-3 px-4 text-gray-500">{cert.date}</td>
                            <td className="py-3 px-4 text-right">
                              <button className="text-teal-600 hover:text-teal-800 font-semibold text-xs">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {issuedCertificates.length > 0 ? (
                      issuedCertificates.map((cert) => (
                        <div
                          key={cert.id}
                          className={`border-2 rounded-lg p-4 hover:shadow-md transition ${cert.colorClass} relative group`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            {/* Show image if available, else icon */}
                            {cert.full_image_url ? (
                              <div className="h-32 w-full mb-2 bg-gray-100 rounded overflow-hidden">
                                <img src={cert.full_image_url} alt={cert.title} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <span className="material-icons text-4xl">workspace_premium</span>
                            )}
                          </div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-gray-800 mb-1">{cert.title}</h4>
                              <p className="text-sm text-gray-600 mb-2">{cert.org}</p>
                              <p className="text-xs text-gray-500">{cert.date}</p>
                            </div>
                            {cert.full_image_url && (
                              <a
                                href={cert.full_image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:bg-teal-50 p-2 rounded-full"
                                title="Download/View"
                              >
                                <span className="material-icons">download</span>
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 col-span-2 text-center py-8">No certificates earned yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
