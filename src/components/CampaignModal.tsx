import React, { useState } from 'react';
import type { Campaign } from '../types';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Props {
    campaign: Campaign & { organizerId?: number };
    onClose: () => void;
    onMessageOrganizer?: (contactId: number) => void;
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

const CampaignModal: React.FC<Props> = ({ campaign, onClose, onMessageOrganizer }) => {
    const [step, setStep] = useState<'details' | 'form' | 'success'>('details');
    const [phone, setPhone] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const userRole = sessionStorage.getItem('userRole');

    // Filter input to only allow 10 digits
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        if (value.length <= 10) {
            setPhone(value);
        }
    };

    const handleJoinClick = () => {
        if (!userRole) {
            showToast('Please login to join campaigns', 'error');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        setStep('form');
    };

    const handleConfirmJoin = async () => {
        // Validation: Check for exactly 10 digits
        if (phone.length !== 10) {
            showToast('Please enter a valid 10-digit mobile number', 'error');
            return;
        }

        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            showToast('Please login first', 'error');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        try {
            setIsSubmitting(true);
            await new Promise(resolve => setTimeout(resolve, 800));

            const payload = {
                user_id: Number(userId),
                campaign_id: Number(campaign.id),
                phone: phone,
                skills: selectedSkills
            };

            const response = await fetch(api.campaigns.join, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Successfully joined!', 'success');
                setStep('success');
            } else {
                showToast(data.error || 'Failed to join campaign', 'error');
            }
        } catch (error) {
            showToast('Network error. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSkill = (value: string) => {
        setSelectedSkills(prev =>
            prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-teal-600 p-6 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">{campaign.title}</h2>
                        <p className="opacity-90">{campaign.organization}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 overflow-y-auto">
                    {step === 'details' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-xl flex items-center text-sm">
                                    <span className="material-icons text-teal-600 mr-2">event</span>
                                    {campaign.dateRange}
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl flex items-center text-sm">
                                    <span className="material-icons text-teal-600 mr-2">location_on</span>
                                    {campaign.location}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">About the Campaign</h3>
                                <p className="text-gray-600 leading-relaxed">{campaign.description}</p>
                            </div>

                            <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
                                <span>Volunteers Needed: <b className="text-gray-900">{campaign.volunteersTarget}</b></span>
                                <span>Currently Joined: <b className="text-gray-900">{campaign.volunteersCurrent}</b></span>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                {campaign.organizerId && onMessageOrganizer && userRole && (
                                    <button 
                                        onClick={() => onMessageOrganizer(campaign.organizerId!)} 
                                        className="px-6 py-2 text-teal-600 border border-teal-200 font-semibold hover:bg-teal-50 rounded-xl transition-colors flex items-center"
                                    >
                                        <span className="material-icons text-sm mr-2">chat</span> Message Organizer
                                    </button>
                                )}
                                <button onClick={onClose} className="px-6 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors">
                                    Close
                                </button>
                                {campaign.volunteersCurrent >= campaign.volunteersTarget ? (
                                    <button disabled className="bg-red-100 text-red-600 px-8 py-2 rounded-xl font-bold cursor-not-allowed flex items-center">
                                        <span className="material-icons mr-2 text-sm">block</span>
                                        Slots Filled
                                    </button>
                                ) : (
                                    <button onClick={handleJoinClick} className="btn-primary px-8">
                                        Join Now
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 'form' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gray-800">Complete Your Application</h3>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                                    <span className={`text-xs ${phone.length === 10 ? 'text-teal-600' : 'text-gray-400'}`}>
                                        {phone.length}/10 digits
                                    </span>
                                </div>
                                <input
                                    type="tel"
                                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${phone.length > 0 && phone.length < 10
                                        ? 'border-orange-300 focus:ring-orange-100'
                                        : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                                        }`}
                                    placeholder="Enter 10-digit mobile number"
                                    value={phone}
                                    disabled={isSubmitting}
                                    onChange={handlePhoneChange}
                                />
                                {phone.length > 0 && phone.length < 10 && (
                                    <p className="text-orange-500 text-xs mt-1">Number must be exactly 10 digits</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Relevant Skills</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {skillOptions.map(skill => (
                                        <button
                                            key={skill.value}
                                            disabled={isSubmitting}
                                            onClick={() => toggleSkill(skill.value)}
                                            className={`flex items-center p-3 rounded-xl border transition-all text-sm ${selectedSkills.includes(skill.value)
                                                ? 'border-teal-600 bg-teal-50 text-teal-700 font-bold'
                                                : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                                                }`}
                                        >
                                            <span className="material-icons text-lg mr-2">
                                                {selectedSkills.includes(skill.value) ? 'check_box' : 'check_box_outline_blank'}
                                            </span>
                                            {skill.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <button
                                    onClick={() => setStep('details')}
                                    disabled={isSubmitting}
                                    className="px-6 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl disabled:opacity-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleConfirmJoin}
                                    disabled={isSubmitting || phone.length !== 10}
                                    className={`btn-primary min-w-[140px] flex justify-center items-center ${phone.length !== 10 ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        'Confirm Join'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-icons text-4xl">check_circle</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">You're In!</h3>
                            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                                You have successfully joined the <b>{campaign.title}</b>. Keep an eye on your dashboard for updates.
                            </p>

                            <div className="flex justify-center gap-4">
                                <button onClick={onClose} className="px-6 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                                    Dismiss
                                </button>
                                <button onClick={() => navigate('/dashboard')} className="btn-primary px-6">
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