const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const endpoints = {
    auth: {
        login: `${API_BASE_URL}/users/login/`,
        register: `${API_BASE_URL}/users/register/`,
        refresh: `${API_BASE_URL}/token/refresh/`,
    },
    products: {
        list: `${API_BASE_URL}/products/`,
        detail: (id) => `${API_BASE_URL}/products/${id}/`,
    },
    orders: {
        list: `${API_BASE_URL}/orders/`,
        create: `${API_BASE_URL}/orders/`,
        detail: (id) => `${API_BASE_URL}/orders/${id}/`,
    },
    users: {
        profile: `${API_BASE_URL}/users/me/`,
        update: `${API_BASE_URL}/users/me/`,
    }
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
}; 