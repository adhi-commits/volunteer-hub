import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../hooks/useToast';
import Toast from './Toast';

interface EditCampaignModalProps {
    campaign: any;
    onClose: () => void;
    onUpdateSuccess: () => void;
}

const EditCampaignModal: React.FC<EditCampaignModalProps> = ({ campaign, onClose, onUpdateSuccess }) => {
    const { toast, showToast } = useToast();
    
    // Parse datetimes to match input[type="date"] and input[type="time"]
    const startDateObj = new Date(campaign.start_date);
    const endDateObj = new Date(campaign.end_date);
    
    // YYYY-MM-DD
    const initStartDate = `${startDateObj.getFullYear()}-${String(startDateObj.getMonth() + 1).padStart(2, '0')}-${String(startDateObj.getDate()).padStart(2, '0')}`;
    const initEndDate = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`;
    
    // HH:MM
    const initStartTime = `${String(startDateObj.getHours()).padStart(2, '0')}:${String(startDateObj.getMinutes()).padStart(2, '0')}`;
    const initEndTime = `${String(endDateObj.getHours()).padStart(2, '0')}:${String(endDateObj.getMinutes()).padStart(2, '0')}`;

    const [form, setForm] = useState({
        title: campaign.title || '',
        description: campaign.description || '',
        category: campaign.category || '',
        location: campaign.location || '',
        startDate: initStartDate,
        startTime: initStartTime,
        endDate: initEndDate,
        endTime: initEndTime,
        volunteersTarget: campaign.volunteers_target ? String(campaign.volunteers_target) : '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const organizerId = sessionStorage.getItem('userId');

        if (!form.startDate || !form.startTime || !form.endDate || !form.endTime) {
            showToast('Please select both date and time', 'error');
            return;
        }

        const start = new Date(`${form.startDate}T${form.startTime}`);
        const end = new Date(`${form.endDate}T${form.endTime}`);

        if (end < start) {
            showToast('End date cannot be before start date', 'error');
            return;
        }

        if (!organizerId) {
            showToast('You must be logged in', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(api.campaigns.update(campaign.id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    location: form.location,
                    start_date: `${form.startDate} ${form.startTime}:00`,
                    end_date: `${form.endDate} ${form.endTime}:00`,
                    volunteers_target: parseInt(form.volunteersTarget, 10),
                    organizer_id: parseInt(organizerId, 10)
                })
            });

            if (response.ok) {
                onUpdateSuccess();
            } else {
                const data = await response.json();
                showToast(data.error || 'Failed to update campaign', 'error');
            }
        } catch (error) {
            showToast('Network error', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
            <Toast toast={toast} />
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden animate-fade-in-up">
                <div className="bg-teal-600 px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold">Edit Campaign</h2>
                    <button onClick={onClose} className="hover:bg-teal-700 p-1 rounded-full transition-colors focus:outline-none">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Campaign Title</label>
                        <input
                            type="text"
                            name="title"
                            className="input-field w-full"
                            placeholder="e.g. City Park Cleanup Drive"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Description</label>
                        <textarea
                            name="description"
                            className="input-field w-full h-32 py-2"
                            placeholder="Describe your campaign goals and what volunteers will do..."
                            value={form.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Category</label>
                            <select
                                name="category"
                                className="input-field w-full"
                                value={form.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Environment">Environment</option>
                                <option value="Education">Education</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Poverty">Poverty</option>
                                <option value="Human Rights">Human Rights</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="input-field w-full"
                                placeholder="e.g. Central Park, NY"
                                value={form.location}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                className="input-field w-full"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Start Time</label>
                            <input
                                type="time"
                                name="startTime"
                                className="input-field w-full"
                                value={form.startTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                className="input-field w-full"
                                value={form.endDate}
                                min={form.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">End Time</label>
                            <input
                                type="time"
                                name="endTime"
                                className="input-field w-full"
                                value={form.endTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Target Volunteers</label>
                        <input
                            type="number"
                            name="volunteersTarget"
                            className="input-field w-full"
                            placeholder="e.g. 50"
                            value={form.volunteersTarget}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCampaignModal;
