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
    }
};
