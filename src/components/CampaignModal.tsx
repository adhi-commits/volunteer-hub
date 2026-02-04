import React, { useState } from 'react';
import type { Campaign } from '../types';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Props {
    campaign: Campaign;
    onClose: () => void;
}

const skillOptions = [
    { value: 'social-service', label: 'Social Service' },
    { value: 'first-aid', label: 'First Aid' },
    { value: 'healthcare-support', label: 'Healthcare Support' },
    { value: 'elderly-care', label: 'Elderly Care' },
    { value: 'child-care', label: 'Child Care' },
    { value: 'teaching', label: 'Teaching' },
    { value: 'counseling', label: 'Counseling' },
    { value: 'disaster-relief', label: 'Disaster Relief' },
];

const CampaignModal: React.FC<Props> = ({ campaign, onClose }) => {
    const [step, setStep] = useState<'details' | 'form' | 'success'>('details');
    const [phone, setPhone] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const userRole = sessionStorage.getItem('userRole');

    const handleJoinClick = () => {
        if (!userRole) {
            // If not logged in, maybe redirect to login or show alert
            // For now, let's assume they need to login, but the user asked for a popup.
            // If we redirect, we lose context. Ideally we show a "Login required" msg.
            showToast('Please login to join campaigns', 'error');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        setStep('form');
    };

    const handleConfirmJoin = async () => {
        const userId = sessionStorage.getItem('userId');

        try {
            const response = await fetch(api.campaigns.join, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    campaignId: campaign.id
                })
            });

            if (response.ok) {
                setStep('success');
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to join', 'error');
            }
        } catch (error) {
            showToast('Network error', 'error');
        }
    };

    const toggleSkill = (value: string) => {
        setSelectedSkills(prev =>
            prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="bg-teal-600 p-6 text-white flex justify-between items-start sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold">{campaign.title}</h2>
                        <p className="opacity-90">{campaign.organization}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'details' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg flex items-center text-sm">
                                    <span className="material-icons text-teal-600 mr-2">event</span>
                                    {campaign.dateRange}
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg flex items-center text-sm">
                                    <span className="material-icons text-teal-600 mr-2">location_on</span>
                                    {campaign.location}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">About</h3>
                                <p className="text-gray-600">{campaign.description}</p>
                            </div>

                            <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
                                <span>Volunteers Needed: <b>{campaign.volunteersTarget}</b></span>
                                <span>Currently Joined: <b>{campaign.volunteersCurrent}</b></span>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={onClose} className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg">
                                    Close
                                </button>
                                <button onClick={handleJoinClick} className="btn-primary">
                                    Join Now
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'form' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800">Complete Your Application</h3>
                            <p className="text-gray-600 text-sm">Please provide a few details to help the organizer.</p>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    placeholder="+91..."
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Relevant Skills</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {skillOptions.map(skill => (
                                        <label key={skill.value} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedSkills.includes(skill.value)}
                                                onChange={() => toggleSkill(skill.value)}
                                                className="rounded text-teal-600 focus:ring-teal-500"
                                            />
                                            <span className="text-sm text-gray-700">{skill.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={() => setStep('details')} className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg">
                                    Back
                                </button>
                                <button onClick={handleConfirmJoin} className="btn-primary">
                                    Confirm Join
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-icons text-3xl">check</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Successfully Joined!</h3>
                            <p className="text-gray-600 mb-6">You have been added to this campaign. You can track its status on your dashboard.</p>

                            <div className="flex justify-center gap-3">
                                <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">
                                    Close
                                </button>
                                <button onClick={() => navigate('/dashboard')} className="btn-primary">
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CampaignModal;
