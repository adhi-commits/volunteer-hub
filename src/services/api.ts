export const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
    auth: {
        register: `${API_BASE_URL}/auth/register`,
        login: `${API_BASE_URL}/auth/login`,
    },
    campaigns: {
        list: `${API_BASE_URL}/campaigns`,
        create: `${API_BASE_URL}/campaigns/create`,
        join: `${API_BASE_URL}/campaigns/join`,
        joined: `${API_BASE_URL}/campaigns`, // Use with ?user_id=
        cancel: (id: string | number) => `${API_BASE_URL}/campaigns/${id}/cancel`,
        update: (id: string | number) => `${API_BASE_URL}/campaigns/${id}`,
        getDetails: (id: string | number) => `${API_BASE_URL}/campaigns/${id}`,
        getVolunteers: (id: string | number) => `${API_BASE_URL}/campaigns/${id}/volunteers`,
        updateStatus: (regId: string | number) => `${API_BASE_URL}/campaigns/registrations/${regId}/status`,
    },
    certificates: {
        issue: `${API_BASE_URL}/certificates/issue`,
        getUserCertificates: (userId: string | number) => `${API_BASE_URL}/certificates/user/${userId}`,
    },
    feedback: {
        submit: `${API_BASE_URL}/feedback`,
    },
    admin: {
        getPendingOrganizers: `${API_BASE_URL}/admin/organizers/pending`,
        approveOrganizer: (id: string | number) => `${API_BASE_URL}/admin/organizers/${id}/approve`,
        rejectOrganizer: (id: string | number) => `${API_BASE_URL}/admin/organizers/${id}/reject`,
        getApprovedOrganizers: `${API_BASE_URL}/admin/organizers/approved`,
        disableOrganizer: (id: string | number) => `${API_BASE_URL}/admin/organizers/${id}/disable`,
        getAllCampaigns: `${API_BASE_URL}/admin/campaigns/all`,
        getFeedback: `${API_BASE_URL}/admin/feedback`,
        updateFeedbackStatus: (id: string | number) => `${API_BASE_URL}/admin/feedback/${id}/status`,
        getStats: `${API_BASE_URL}/admin/stats`,
    },
    messages: {
        getConversations: (userId: string | number) => `${API_BASE_URL}/messages/conversations/${userId}`,
        getHistory: (userId: string | number, otherId: string | number) => `${API_BASE_URL}/messages/${userId}/${otherId}`,
        send: `${API_BASE_URL}/messages`,
        getUnreadCount: (userId: string | number) => `${API_BASE_URL}/messages/unread/${userId}`,
    }
};
