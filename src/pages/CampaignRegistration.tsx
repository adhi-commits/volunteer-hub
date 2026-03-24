import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { api } from '../services/api';
import type { Campaign } from '../types';

const CampaignRegistration: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast, showToast } = useToast();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [status, setStatus] = useState<'Pending' | 'Approved' | 'Rejected' | 'Participating' | null>(null);

    const userRole = sessionStorage.getItem('userRole');
    const userId = sessionStorage.getItem('userId');

    useEffect(() => {
        const fetchCampaignDetails = async () => {
            if (!id) return;
            try {
                // Fetch campaign details
                const res = await fetch(api.campaigns.getDetails(id));
                if (!res.ok) throw new Error('Campaign not found');
                const data = await res.json();

                // Map API response to Campaign type
                const mapped: Campaign = {
                    id: data.id.toString(),
                    title: data.title,
                    description: data.description,
                    organization: `Organizer #${data.organizer_id}`,
                    category: data.category as Campaign['category'],
                    location: data.location,
                    dateRange: `${new Date(data.start_date).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - ${new Date(data.end_date).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
                    volunteersTarget: data.volunteers_target,
                    volunteersCurrent: data.volunteers_current || 0,
                    status: data.status as Campaign['status'],
                };
                setCampaign(mapped);

                // Check if user is registered for this campaign
                if (userId) {
                    const regRes = await fetch(`${api.campaigns.joined}?user_id=${userId}`);
                    const regData = await regRes.json();
                    const registration = regData.find((r: any) => r.id.toString() === id.toString());

                    if (registration) {
                        setIsRegistered(true);
                        setStatus(registration.registration_status as any);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch campaign details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaignDetails();
    }, [id, userId]);

    const handleRegister = async () => {
        if (!userRole || !userId || !id) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(api.campaigns.join, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, campaign_id: id })
            });

            if (res.ok) {
                showToast('Successfully registered for campaign!', 'success');
                setIsRegistered(true);
                setStatus('Pending');
            } else {
                const data = await res.json();
                showToast(data.error || 'Failed to register', 'error');
            }
        } catch (error) {
            showToast('Failed to register. Please try again.', 'error');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="pt-28 pb-16 container mx-auto px-6 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading campaign details...</p>
                </div>
            </Layout>
        );
    }

    if (!campaign) {
        return (
            <Layout>
                <div className="pt-28 pb-16 container mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Campaign not found</h2>
                    <Link to="/campaigns" className="text-teal-600 hover:underline mt-4 block">
                        Back to Campaigns
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Toast toast={toast} />
            <section className="pt-28 pb-16">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-8 text-white">
                            <Link to="/campaigns" className="text-teal-100 hover:text-white mb-4 block flex items-center">
                                <span className="material-icons text-sm mr-1">arrow_back</span>
                                Back to Campaigns
                            </Link>
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="bg-teal-500 bg-opacity-30 text-teal-50 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                                        {campaign.category}
                                    </span>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{campaign.title}</h1>
                                    <div className="flex items-center text-teal-100 mb-4">
                                        <span className="material-icons text-sm mr-2">business</span>
                                        <span className="font-medium">{campaign.organization}</span>
                                    </div>
                                </div>
                                <div className="text-right hidden md:block">
                                    <div className="bg-white text-teal-800 px-4 py-2 rounded-lg font-bold text-center">
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Status</div>
                                        <div className="text-lg">{campaign.status}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">About the Campaign</h3>
                                        <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <div className="flex items-center text-teal-600 mb-2">
                                                <span className="material-icons mr-2">event</span>
                                                <span className="font-bold">Date</span>
                                            </div>
                                            <p className="text-gray-700">{campaign.dateRange}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <div className="flex items-center text-teal-600 mb-2">
                                                <span className="material-icons mr-2">location_on</span>
                                                <span className="font-bold">Location</span>
                                            </div>
                                            <p className="text-gray-700">{campaign.location}</p>
                                        </div>
                                    </div>

                                    {/* Additional mock details */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">Requirements</h3>
                                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                                            <li>Must be 18 years or older</li>
                                            <li>Commitment to attend all scheduled sessions</li>
                                            <li>Relevant skills in {campaign.category} are a plus</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 pt-8 md:pt-0">
                                    <div className="sticky top-24">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4">Registration</h3>

                                        {isRegistered ? (
                                            <div className={`p-6 rounded-xl border-2 ${status === 'Approved' ? 'border-green-100 bg-green-50' : 'border-yellow-100 bg-yellow-50'
                                                }`}>
                                                <div className="flex justify-center mb-4">
                                                    <span className={`material-icons text-5xl ${status === 'Approved' ? 'text-green-500' : 'text-yellow-500'
                                                        }`}>
                                                        {status === 'Approved' ? 'check_circle' : 'hourglass_empty'}
                                                    </span>
                                                </div>
                                                <h4 className="text-center font-bold text-lg mb-1">
                                                    {status === 'Approved' ? 'Application Approved!' : 'Application Pending'}
                                                </h4>
                                                <p className="text-center text-sm text-gray-600 mb-4">
                                                    {status === 'Approved'
                                                        ? 'You are all set to participate in this campaign.'
                                                        : 'Your registration is under review by the organizer.'}
                                                </p>
                                                {status === 'Approved' && (
                                                    <button className="w-full bg-white text-green-600 border border-green-200 py-2 rounded-lg font-semibold hover:bg-green-100 transition">
                                                        View Schedule
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-600">Volunteers Needed</span>
                                                        <span className="font-bold text-gray-800">{campaign.volunteersTarget}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-600">Current</span>
                                                        <span className="font-bold text-gray-800">{campaign.volunteersCurrent}</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                                                        <div
                                                            className="h-full bg-teal-500"
                                                            style={{ width: `${(campaign.volunteersCurrent / campaign.volunteersTarget) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-6">
                                                    Join this campaign to make a difference. Click below to register as a volunteer.
                                                </p>

                                                <button
                                                    onClick={handleRegister}
                                                    className="w-full btn-primary justify-center shadow-lg"
                                                >
                                                    Confirm Registration
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default CampaignRegistration;
