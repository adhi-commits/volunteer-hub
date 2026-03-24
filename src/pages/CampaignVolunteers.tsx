import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';
import type { Campaign } from '../types';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import MessagingPanel from '../components/MessagingPanel';

interface VolunteerRegistration {
    registration_id: number;
    user_id: number;
    name: string;
    email: string;
    phone: string;
    skills?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    registered_at: string;
}

const CampaignVolunteers: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [volunteers, setVolunteers] = useState<VolunteerRegistration[]>([]);
    const [loading, setLoading] = useState(true);

    const [isMessagingOpen, setIsMessagingOpen] = useState(false);
    const [messageContactId, setMessageContactId] = useState<number | null>(null);

    const { toast, showToast } = useToast();

    const openContactMessage = (contactId: number) => {
        setMessageContactId(contactId);
        setIsMessagingOpen(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                // Fetch Campaign details
                const campRes = await fetch(api.campaigns.getDetails(id));
                const campData = await campRes.json();
                setCampaign(campData);

                // Fetch Volunteers list
                const volRes = await fetch(api.campaigns.getVolunteers(id));
                const volData = await volRes.json();
                setVolunteers(volData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                showToast('Failed to load campaign data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleStatusUpdate = async (regId: number, newStatus: 'Approved' | 'Rejected') => {
        try {
            const res = await fetch(api.campaigns.updateStatus(regId), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Update local state
                setVolunteers(prev =>
                    prev.map(v => v.registration_id === regId ? { ...v, status: newStatus } : v)
                );
                showToast(`Volunteer ${newStatus.toLowerCase()} successfully`, 'success');
            } else {
                showToast('Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            showToast('Error updating status', 'error');
        }
    };

    const handleIssueCertificate = async (userId: number, file: File) => {
        if (!campaign) {
            console.error('Campaign object is missing');
            showToast('Error: Campaign details missing', 'error');
            return;
        }

        console.log('Uploading certificate for:', { userId, campaignId: campaign.id, file: file.name });

        const formData = new FormData();
        formData.append('certificate', file);
        formData.append('user_id', userId.toString());
        formData.append('campaign_id', campaign.id.toString());

        try {
            showToast('Uploading certificate...', 'success'); // Using success for info as per limitations
            const res = await fetch(api.certificates.issue, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            console.log('Upload response:', data);

            if (res.ok) {
                showToast(`Certificate issued successfully!`, 'success');
            } else {
                showToast(data.message || 'Failed to issue certificate', 'error');
            }
        } catch (error) {
            console.error('Error issuing certificate:', error);
            showToast('Error uploading certificate', 'error');
        }
    };

    if (loading) {
        return (
            <Layout variant="dashboard">
                <div className="pt-28 pb-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading volunteers list...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout variant="dashboard">
            <Toast toast={toast} />
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
                                        <th className="px-6 py-4 font-semibold text-gray-600">Skills</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {volunteers.map((vol) => (
                                        <tr key={vol.registration_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800">{vol.name}</div>
                                                <div className="text-xs text-gray-500">Registered on {new Date(vol.registered_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600">{vol.email}</div>
                                                <div className="text-sm text-gray-600">{vol.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {(() => {
                                                    if (!vol.skills) return <span className="text-gray-400 italic text-sm">Not specified</span>;
                                                    try {
                                                        const skillsArray = JSON.parse(vol.skills);
                                                        if (Array.isArray(skillsArray) && skillsArray.length > 0) {
                                                            return (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {skillsArray.map((skill: string, idx: number) => (
                                                                        <span key={idx} className="bg-teal-50 border border-teal-200 text-teal-700 text-xs px-2 py-1 rounded-md">{skill}</span>
                                                                    ))}
                                                                </div>
                                                            );
                                                        }
                                                        return <span className="text-sm text-gray-600">{vol.skills}</span>;
                                                    } catch (e) {
                                                        return <span className="text-sm text-gray-600">{vol.skills}</span>;
                                                    }
                                                })()}
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
                                                    <button
                                                        className="text-teal-600 hover:bg-teal-50 p-2 rounded-full"
                                                        title="Message Volunteer"
                                                        onClick={() => openContactMessage(vol.user_id)}
                                                    >
                                                        <span className="material-icons">chat</span>
                                                    </button>
                                                    {vol.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                className="text-green-600 hover:bg-green-50 p-2 rounded-full"
                                                                title="Approve"
                                                                onClick={() => handleStatusUpdate(vol.registration_id, 'Approved')}
                                                            >
                                                                <span className="material-icons">check</span>
                                                            </button>
                                                            <button
                                                                className="text-red-600 hover:bg-red-50 p-2 rounded-full"
                                                                title="Reject"
                                                                onClick={() => handleStatusUpdate(vol.registration_id, 'Rejected')}
                                                            >
                                                                <span className="material-icons">close</span>
                                                            </button>
                                                        </>
                                                    )}
                                                    {vol.status === 'Approved' && (
                                                        <>
                                                            <input
                                                                type="file"
                                                                id={`cert-upload-${vol.user_id}`}
                                                                className="hidden"
                                                                accept="image/*,application/pdf"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        handleIssueCertificate(vol.user_id, file);
                                                                    }
                                                                }}
                                                            />
                                                            <label
                                                                htmlFor={`cert-upload-${vol.user_id}`}
                                                                className="text-orange-500 hover:bg-orange-50 p-2 rounded-full transition cursor-pointer"
                                                                title="Issue Certificate"
                                                            >
                                                                <span className="material-icons">card_membership</span>
                                                            </label>
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
            
            <MessagingPanel 
                isOpen={isMessagingOpen} 
                onClose={() => setIsMessagingOpen(false)} 
                initialContactId={messageContactId}
            />
        </Layout>
    );
};

export default CampaignVolunteers;
