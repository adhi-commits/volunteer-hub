import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { api, API_BASE_URL } from '../services/api';
import MessagingPanel from '../components/MessagingPanel';

interface Campaign {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    status: string;
    created_at: string;
}

interface Organizer {
    id: number;
    name: string;
    email: string;
    phone: string;
    organizer_id_url: string;
    created_at: string;
    organizer_status: string;
    campaigns?: Campaign[];
}

interface Feedback {
    id: number;
    message: string;
    status: 'New' | 'Reviewed' | 'Resolved';
    created_at: string;
    user_name: string;
    user_email: string;
}

const AdminDashboard: React.FC = () => {
    const { toast, showToast } = useToast();
    const [stats, setStats] = useState({ totalUsers: 0, totalOrganizers: 0, totalCampaigns: 0, unreadFeedback: 0 });
    const [statsUnreadMessages, setStatsUnreadMessages] = useState({ unread_count: 0 });
    const [pendingOrganizers, setPendingOrganizers] = useState<Organizer[]>([]);
    const [approvedOrganizers, setApprovedOrganizers] = useState<Organizer[]>([]);
    const [allCampaigns, setAllCampaigns] = useState<any[]>([]);
    const [unreadByContact, setUnreadByContact] = useState<Record<number, number>>({});
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'campaigns' | 'feedback'>('approved');

    // Messaging UI states
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [messageContactId, setMessageContactId] = useState<number | null>(null);

    const userId = Number(sessionStorage.getItem('userId'));

    const fetchStats = async () => {
        try {
            const res = await fetch(api.admin.getStats);
            const data = await res.json();
            if (res.ok) setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    const fetchUnreadMessages = async () => {
        if (!userId) return;
        try {
            const res = await fetch(api.messages.getUnreadCount(userId));
            const data = await res.json();
            if (res.ok) setStatsUnreadMessages(data);

            const res2 = await fetch(api.messages.getConversations(userId));
            const data2 = await res2.json();
            if (res2.ok && data2.existing_chats) {
                const map: Record<number, number> = {};
                data2.existing_chats.forEach((chat: any) => {
                    if (chat.unread_count > 0) {
                        map[chat.id] = chat.unread_count;
                    }
                });
                setUnreadByContact(map);
            }
        } catch (error) {
            console.error('Failed to get unread messages count', error);
        }
    };

    const fetchOrganizers = async () => {
        try {
            const res = await fetch(api.admin.getPendingOrganizers);
            const data = await res.json();
            if (res.ok) setPendingOrganizers(data);
        } catch (error) {
            console.error('Failed to fetch pending organizers', error);
        }
    };

    const fetchApprovedOrganizers = async () => {
        try {
            const res = await fetch(api.admin.getApprovedOrganizers);
            const data = await res.json();
            if (res.ok) setApprovedOrganizers(data);
        } catch (error) {
            console.error('Failed to fetch approved organizers', error);
        }
    };

    const fetchAllCampaigns = async () => {
        try {
            const res = await fetch(api.admin.getAllCampaigns);
            const data = await res.json();
            if (res.ok) setAllCampaigns(data);
        } catch (error) {
            console.error('Failed to fetch all campaigns', error);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const res = await fetch(api.admin.getFeedback);
            const data = await res.json();
            if (res.ok) setFeedbacks(data);
        } catch (error) {
            console.error('Failed to fetch feedback', error);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchOrganizers();
        fetchApprovedOrganizers();
        fetchAllCampaigns();
        fetchFeedbacks();
        fetchUnreadMessages();
        
        // Polling unread messages
        const interval = setInterval(() => {
            fetchUnreadMessages();
        }, 15000); // 15s

        return () => clearInterval(interval);
    }, []);

    const handleOrganizerAction = async (id: number, action: 'approve' | 'reject') => {
        if (!window.confirm(`Are you sure you want to ${action} this organizer?`)) return;

        try {
            const endpoint = action === 'approve' ? api.admin.approveOrganizer(id) : api.admin.rejectOrganizer(id);
            const res = await fetch(endpoint, { method: 'POST' });
            if (res.ok) {
                showToast(`Organizer ${action}d successfully.`, 'success');
                fetchOrganizers();
                fetchApprovedOrganizers();
                fetchStats();
            } else {
                showToast(`Failed to ${action} organizer.`, 'error');
            }
        } catch (error) {
            showToast('Network error.', 'error');
        }
    };

    const handleDisableOrganizer = async (id: number) => {
        if (!window.confirm(`Are you sure you want to disable this organizer? They will no longer be able to log in or manage campaigns.`)) return;

        try {
            const res = await fetch(api.admin.disableOrganizer(id), { method: 'POST' });
            if (res.ok) {
                showToast(`Organizer disabled successfully.`, 'success');
                fetchApprovedOrganizers();
            } else {
                showToast(`Failed to disable organizer.`, 'error');
            }
        } catch (error) {
            showToast('Network error.', 'error');
        }
    };

    const handleFeedbackAction = async (id: number, newStatus: string) => {
        try {
            const res = await fetch(api.admin.updateFeedbackStatus(id), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                showToast('Feedback status updated.', 'success');
                fetchFeedbacks();
                fetchStats();
            } else {
                showToast('Failed to update status.', 'error');
            }
        } catch (error) {
            showToast('Network error.', 'error');
        }
    };

    const openContactMessage = (id: number) => {
        setMessageContactId(id);
        setIsMessageOpen(true);
    };

    const baseUrl = API_BASE_URL.replace('/api', '');

    return (
        <Layout variant="dashboard">
            <Toast toast={toast} />
            <section className="pt-28 pb-8 bg-gray-900 text-white">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-4">Admin Control Panel</h1>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => { setMessageContactId(null); setIsMessageOpen(true); }}
                                    className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-lg font-bold flex items-center transition"
                                >
                                    <span className="material-icons mr-2">chat</span>
                                    Messages
                                    {statsUnreadMessages.unread_count > 0 && (
                                        <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                            {statsUnreadMessages.unread_count} New
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <button onClick={() => setActiveTab('approved')} className="bg-gray-800 rounded-lg px-6 py-3 text-center border border-gray-700 hover:bg-gray-700 hover:border-teal-500 transition cursor-pointer text-left focus:outline-none">
                                <div className="text-2xl font-bold text-teal-400">{stats.totalOrganizers}</div>
                                <div className="text-sm text-gray-400">Organizers</div>
                            </button>
                            <button onClick={() => setActiveTab('campaigns')} className="bg-gray-800 rounded-lg px-6 py-3 text-center border border-gray-700 hover:bg-gray-700 hover:border-teal-500 transition cursor-pointer text-left focus:outline-none">
                                <div className="text-2xl font-bold text-blue-400">{stats.totalCampaigns}</div>
                                <div className="text-sm text-gray-400">Campaigns</div>
                            </button>
                            <button onClick={() => setActiveTab('feedback')} className="bg-gray-800 rounded-lg px-6 py-3 text-center border border-gray-700 hover:bg-gray-700 hover:border-teal-500 relative transition cursor-pointer text-left focus:outline-none">
                                {stats.unreadFeedback > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">
                                        {stats.unreadFeedback}
                                    </span>
                                )}
                                <div className="text-2xl font-bold text-yellow-500">{stats.unreadFeedback}</div>
                                <div className="text-sm text-gray-400">New Feedback</div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8 bg-gray-50 min-h-[60vh]">
                <div className="container mx-auto px-6">
                    {/* Navigation Tabs */}
                    <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                        <button
                            className={`py-4 px-6 font-semibold border-b-2 whitespace-nowrap transition-colors duration-200 ${activeTab === 'approved' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            onClick={() => setActiveTab('approved')}
                        >
                            All Organizers ({approvedOrganizers.length})
                        </button>
                        <button
                            className={`py-4 px-6 font-semibold border-b-2 whitespace-nowrap transition-colors duration-200 ${activeTab === 'pending' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            onClick={() => setActiveTab('pending')}
                        >
                            Pending Configs ({pendingOrganizers.length})
                        </button>
                        <button
                            className={`py-4 px-6 font-semibold border-b-2 whitespace-nowrap transition-colors duration-200 ${activeTab === 'campaigns' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            onClick={() => setActiveTab('campaigns')}
                        >
                            All Campaigns
                        </button>
                        <button
                            className={`py-4 px-6 font-semibold border-b-2 whitespace-nowrap transition-colors duration-200 ${activeTab === 'feedback' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            onClick={() => setActiveTab('feedback')}
                        >
                            Volunteer Feedback
                        </button>
                    </div>

                    {/* All Organizers Tab */}
                    {activeTab === 'approved' && (
                        <div>
                            {approvedOrganizers.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-200">
                                    <span className="material-icons text-6xl text-gray-300 mb-4 block">people</span>
                                    <h3 className="text-xl font-bold text-gray-700">No Approved Organizers</h3>
                                    <p className="text-gray-500">Approve pending organizers to see them here.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {approvedOrganizers.map(org => {
                                        const campaigns = org.campaigns || [];
                                        return (
                                            <div key={org.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-teal-500 flex flex-col md:flex-row gap-6">
                                                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded">APPROVED</span>
                                                        <span className="text-gray-500 text-sm">Since {new Date(org.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-800">{org.name}</h3>
                                                    <div className="text-sm text-gray-600 flex items-center mt-2">
                                                        <span className="material-icons text-sm mr-1">email</span> {org.email}
                                                    </div>
                                                    <div className="text-sm text-gray-600 flex items-center mt-1">
                                                        <span className="material-icons text-sm mr-1">phone</span> {org.phone}
                                                    </div>
                                                    
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {org.organizer_id_url && (
                                                            <a 
                                                                href={`${baseUrl}${org.organizer_id_url}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="flex-1 bg-gray-50 text-gray-700 border border-gray-200 py-1.5 px-3 rounded text-sm font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-1"
                                                            >
                                                                <span className="material-icons text-sm">badge</span> ID Proof
                                                            </a>
                                                        )}
                                                        <button 
                                                            onClick={() => openContactMessage(org.id)}
                                                            className="flex-1 bg-teal-50 text-teal-700 py-1.5 px-3 rounded text-sm font-semibold hover:bg-teal-100 transition flex items-center justify-center gap-1 relative"
                                                        >
                                                            <span className="material-icons text-sm">chat</span> Message
                                                            {unreadByContact[org.id] > 0 && (
                                                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm border border-white">
                                                                    {unreadByContact[org.id]}
                                                                </span>
                                                            )}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDisableOrganizer(org.id)}
                                                            className="flex-1 bg-red-50 text-red-600 py-1.5 px-3 rounded text-sm font-semibold hover:bg-red-100 transition flex items-center justify-center gap-1"
                                                        >
                                                            <span className="material-icons text-sm">block</span> Disable
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="md:w-2/3">
                                                    <div className="flex justify-between items-end mb-3">
                                                        <h4 className="font-bold text-gray-700">Campaigns Hosted ({campaigns.length})</h4>
                                                    </div>
                                                    {campaigns.length === 0 ? (
                                                        <p className="text-sm text-gray-500 italic">This organizer hasn't created any campaigns yet.</p>
                                                    ) : (
                                                        <div className="grid sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                            {campaigns.map(camp => (
                                                                <div key={camp.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-sm flex flex-col justify-between">
                                                                    <div>
                                                                        <div className="font-bold text-gray-800 truncate" title={camp.title}>{camp.title}</div>
                                                                        <div className="text-xs text-gray-500 mt-1">
                                                                            {new Date(camp.start_date).toLocaleDateString()} - {new Date(camp.end_date).toLocaleDateString()}
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-2 text-right">
                                                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                                                            camp.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                                            camp.status === 'Completed' ? 'bg-gray-200 text-gray-600' :
                                                                            'bg-blue-100 text-blue-700'
                                                                        }`}>
                                                                            {camp.status}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pending Tab Content */}
                    {activeTab === 'pending' && (
                        <div>
                            {pendingOrganizers.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-200">
                                    <span className="material-icons text-6xl text-gray-300 mb-4 block">check_circle</span>
                                    <h3 className="text-xl font-bold text-gray-700">All Caught Up!</h3>
                                    <p className="text-gray-500">There are no pending organizers waiting for approval.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {pendingOrganizers.map(org => (
                                        <div key={org.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500 flex flex-col md:flex-row justify-between items-start md:items-center">
                                            <div className="mb-4 md:mb-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">PENDING REVIEW</span>
                                                    <span className="text-gray-500 text-sm">Joined {new Date(org.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800">{org.name}</h3>
                                                <div className="text-sm text-gray-600 flex items-center mt-2">
                                                    <span className="material-icons text-sm mr-1">email</span> {org.email}
                                                </div>
                                                <div className="text-sm text-gray-600 flex items-center mt-1">
                                                    <span className="material-icons text-sm mr-1">phone</span> {org.phone}
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <a 
                                                    href={`${baseUrl}${org.organizer_id_url}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="btn-outline flex items-center justify-center text-sm"
                                                >
                                                    <span className="material-icons text-sm mr-1">visibility</span> View ID Proof
                                                </a>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleOrganizerAction(org.id, 'reject')}
                                                        className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition font-semibold"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button 
                                                        onClick={() => handleOrganizerAction(org.id, 'approve')}
                                                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold"
                                                    >
                                                        Approve
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* All Campaigns Tab Content */}
                    {activeTab === 'campaigns' && (
                        <div>
                            {allCampaigns.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-200">
                                    <span className="material-icons text-6xl text-gray-300 mb-4 block">campaign</span>
                                    <h3 className="text-xl font-bold text-gray-700">No Campaigns Yet</h3>
                                    <p className="text-gray-500">Organizers have not created any campaigns.</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                                                    <th className="py-4 px-6 font-semibold">Campaign Details</th>
                                                    <th className="py-4 px-6 font-semibold">Organizer</th>
                                                    <th className="py-4 px-6 font-semibold">Dates & Target</th>
                                                    <th className="py-4 px-6 font-semibold text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {allCampaigns.map(camp => (
                                                    <tr key={camp.id} className="hover:bg-gray-50 transition">
                                                        <td className="py-4 px-6">
                                                            <div className="font-bold text-gray-800 text-lg mb-1">{camp.title}</div>
                                                            <div className="text-sm text-gray-500 flex items-center">
                                                                <span className="material-icons text-[14px] mr-1">location_on</span>
                                                                {camp.location}
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-2">Posted: {new Date(camp.created_at).toLocaleString()}</div>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="font-medium text-gray-800">{camp.organizer_name}</div>
                                                            <div className="text-sm text-gray-500">{camp.organizer_email}</div>
                                                            <button 
                                                                onClick={() => openContactMessage(camp.organizer_id)}
                                                                className="mt-2 text-xs text-teal-600 hover:text-teal-800 font-bold flex items-center relative inline-block"
                                                            >
                                                                <span className="material-icons text-[14px] mr-1">chat</span> Message
                                                                {unreadByContact[camp.organizer_id] > 0 && (
                                                                    <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                                                                        {unreadByContact[camp.organizer_id]}
                                                                    </span>
                                                                )}
                                                            </button>
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <div className="text-sm text-gray-700 mb-1">
                                                                <strong>Start:</strong> {new Date(camp.start_date).toLocaleDateString()}
                                                            </div>
                                                            <div className="text-sm text-gray-700 mb-2">
                                                                <strong>End:</strong> {new Date(camp.end_date).toLocaleDateString()}
                                                            </div>
                                                            <div className="text-xs bg-blue-50 text-blue-700 inline-block px-2 py-1 rounded">
                                                                <strong>{camp.volunteers_current || 0} / {camp.volunteers_target}</strong> Volunteers
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-6 text-right">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                camp.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                                camp.status === 'Completed' ? 'bg-gray-200 text-gray-600' :
                                                                'bg-blue-100 text-blue-700'
                                                            }`}>
                                                                {camp.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Feedback Tab Content */}
                    {activeTab === 'feedback' && (
                        <div>
                            {feedbacks.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-200">
                                    <span className="material-icons text-6xl text-gray-300 mb-4 block">inbox</span>
                                    <h3 className="text-xl font-bold text-gray-700">Inbox Zero</h3>
                                    <p className="text-gray-500">There is no feedback to review at this time.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {feedbacks.map(fb => (
                                        <div key={fb.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6">
                                            <div className="md:w-1/4 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
                                                <div className="font-bold text-gray-800">{fb.user_name}</div>
                                                <div className="text-sm text-gray-500 truncate">{fb.user_email}</div>
                                                <div className="text-xs text-gray-400 mt-2">{new Date(fb.created_at).toLocaleString()}</div>
                                            </div>
                                            <div className="md:w-2/4">
                                                <p className="text-gray-700 whitespace-pre-wrap">{fb.message}</p>
                                            </div>
                                            <div className="md:w-1/4 flex flex-col items-start md:items-end justify-between">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    fb.status === 'New' ? 'bg-red-100 text-red-700' :
                                                    fb.status === 'Reviewed' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {fb.status}
                                                </span>

                                                <div className="mt-4 flex gap-2">
                                                    {fb.status === 'New' && (
                                                        <button 
                                                            onClick={() => handleFeedbackAction(fb.id, 'Reviewed')}
                                                            className="text-sm text-blue-600 hover:underline font-semibold"
                                                        >
                                                            Mark Reviewed
                                                        </button>
                                                    )}
                                                    {fb.status !== 'Resolved' && (
                                                        <button 
                                                            onClick={() => handleFeedbackAction(fb.id, 'Resolved')}
                                                            className="text-sm text-teal-600 font-semibold hover:underline"
                                                        >
                                                            Resolve
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
            
            <MessagingPanel 
                isOpen={isMessageOpen} 
                onClose={() => setIsMessageOpen(false)} 
                initialContactId={messageContactId} 
            />
        </Layout>
    );
};

export default AdminDashboard;
