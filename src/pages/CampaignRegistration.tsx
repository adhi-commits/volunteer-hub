import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { campaigns } from '../data/campaigns';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const CampaignRegistration: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast, showToast } = useToast();
    const [isRegistered, setIsRegistered] = useState(false);
    const [status, setStatus] = useState<'Pending' | 'Approved' | 'Participating' | null>(null);

    const campaign = campaigns.find((c) => c.id === id);

    const userRole = sessionStorage.getItem('userRole');

    useEffect(() => {
        // Check sessionStorage for joined campaigns
        const joined = JSON.parse(sessionStorage.getItem('joinedCampaigns') || '[]');

        if (joined.includes(id)) {
            setIsRegistered(true);
            // For demo, if it's in localStorage, we can say it's Pending unless hardcoded otherwise
            setStatus('Pending');
        }

        // Mock data overrides for demo
        if (id === '1') {
            setIsRegistered(true);
            setStatus('Approved');
        }
    }, [id]);

    const handleRegister = () => {
        if (!userRole) {
            navigate('/login');
            return;
        }
        // Mock API call to register
        showToast('Successfully registered for campaign!', 'success');
        setIsRegistered(true);
        setStatus('Pending');
    };

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
