import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { campaigns } from '../data/campaigns';

const CampaignVolunteers: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // In a real app, we would fetch volunteers for the specific campaign ID
    // For now, we'll mock some volunteers
    const campaign = campaigns.find(c => c.id === id);

    const volunteers = [
        { id: 1, name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '+1 234 567 8900', status: 'Approved' },
        { id: 2, name: 'Michael Chen', email: 'mike.c@example.com', phone: '+1 234 567 8901', status: 'Pending' },
        { id: 3, name: 'Emma Davis', email: 'emma.d@example.com', phone: '+1 234 567 8902', status: 'Approved' },
        { id: 4, name: 'James Wilson', email: 'james.w@example.com', phone: '+1 234 567 8903', status: 'Rejected' },
    ];

    return (
        <Layout variant="dashboard">
            <section className="pt-28 pb-12 bg-gray-50 min-h-screen">
                <div className="container mx-auto px-6">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <Link to="/organizer-dashboard" className="text-teal-600 font-semibold flex items-center mb-2 hover:underline">
                                <span className="material-icons text-sm mr-1">arrow_back</span>
                                Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Volunteers for {campaign ? campaign.title : 'Campaign'}
                            </h1>
                        </div>
                        <div className="flex gap-3">
                            <button className="btn-primary">
                                <span className="material-icons mr-2">download</span>
                                Export List
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Contact</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {volunteers.map((vol) => (
                                        <tr key={vol.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800">{vol.name}</div>
                                                <div className="text-xs text-gray-500">Registered 2 days ago</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{vol.email}</div>
                                                <div className="text-sm text-gray-600">{vol.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${vol.status === 'Approved'
                                                            ? 'bg-green-100 text-green-700'
                                                            : vol.status === 'Pending'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {vol.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {vol.status === 'Pending' && (
                                                        <>
                                                            <button className="text-green-600 hover:bg-green-50 p-2 rounded-full" title="Approve">
                                                                <span className="material-icons">check</span>
                                                            </button>
                                                            <button className="text-red-600 hover:bg-red-50 p-2 rounded-full" title="Reject">
                                                                <span className="material-icons">close</span>
                                                            </button>
                                                        </>
                                                    )}
                                                    <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full" title="More">
                                                        <span className="material-icons">more_vert</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 text-center text-sm text-gray-500">
                            Showing {volunteers.length} volunteers
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default CampaignVolunteers;
