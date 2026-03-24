import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { api } from '../services/api';

const CreateCampaign: React.FC = () => {
    const navigate = useNavigate();
    const { toast, showToast } = useToast();
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
        location: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        volunteersTarget: '',
    });

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
        const now = new Date();

        if (start < now) {
            showToast('Campaign cannot start in the past', 'error');
            return;
        }

        if (end < start) {
            showToast('End date cannot be before start date', 'error');
            return;
        }

        if (!organizerId) {
            showToast('You must be logged in', 'error');
            return;
        }

        try {
            const response = await fetch(api.campaigns.create, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    location: form.location,
                    start_date: `${form.startDate} ${form.startTime}:00`,
                    end_date: `${form.endDate} ${form.endTime}:00`,
                    volunteers_target: parseInt(form.volunteersTarget, 10),
                    organizer_id: organizerId
                })
            });

            if (response.ok) {
                showToast('Campaign posted successfully!', 'success');
                setTimeout(() => {
                    navigate('/organizer-dashboard');
                }, 1500);
            } else {
                showToast('Failed to create campaign', 'error');
            }
        } catch (error) {
            showToast('Network error', 'error');
        }
    };

    return (
        <Layout>
            <Toast toast={toast} />
            <section className="pt-28 pb-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-teal-600 px-8 py-6 text-white">
                            <h1 className="text-2xl font-bold">Create New Campaign</h1>
                            <p className="text-teal-100 opacity-90">Fill in the details to launch your cause</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
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
                                        min={new Date().toISOString().split('T')[0]}
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

                            <div className="pt-4 flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/organizer-dashboard')}
                                    className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Post Campaign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default CreateCampaign;
