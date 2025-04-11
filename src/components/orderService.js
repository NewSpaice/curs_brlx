import { endpoints, getAuthHeaders } from '../api/config';

export const orderService = {
    async getAllOrders() {
        const response = await fetch(endpoints.orders.list, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Ошибка получения списка заказов');
        }

        return await response.json();
    },

    async getOrderById(id) {
        const response = await fetch(endpoints.orders.detail(id), {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Ошибка получения заказа');
        }

        return await response.json();
    },

    async createOrder(orderData) {
        const response = await fetch(endpoints.orders.create, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error('Ошибка создания заказа');
        }

        return await response.json();
    },

    async updateOrderStatus(id, status) {
        const response = await fetch(endpoints.orders.detail(id), {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Ошибка обновления статуса заказа');
        }

        return await response.json();
    }
}; 