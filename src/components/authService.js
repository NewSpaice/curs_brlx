import { endpoints, getAuthHeaders } from '../api/config';

export const authService = {
    async login(username, password) {
        try {
            const response = await fetch(endpoints.auth.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Login error:', error);
                throw new Error(error.error || `Ошибка авторизации: ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem('token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(userData) {
        try {
            const url = endpoints.auth.register;
            console.log('Registration URL:', url);
            console.log('Registration data:', { ...userData, password: '***' });
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const error = await response.json();
                console.error('Register error:', error);
                throw new Error(error.error || `Ошибка регистрации: ${response.status}`);
            }

            const data = await response.json();
            console.log('Success response:', { ...data, access: '***', refresh: '***' });
            
            localStorage.setItem('token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            return data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    async refreshToken() {
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) {
            throw new Error('Нет refresh token');
        }

        const response = await fetch(endpoints.auth.refresh, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refresh_token }),
        });

        if (!response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            throw new Error('Ошибка обновления токена');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access);
        return data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
}; 