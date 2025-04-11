import { endpoints, getAuthHeaders } from '../api/config';

export const productService = {
    async getAllProducts() {
        const response = await fetch(endpoints.products.list, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Ошибка получения списка продуктов');
        }

        return await response.json();
    },

    async getProductById(id) {
        const response = await fetch(endpoints.products.detail(id), {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Ошибка получения продукта');
        }

        return await response.json();
    },

    async createProduct(productData) {
        const response = await fetch(endpoints.products.list, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            throw new Error('Ошибка создания продукта');
        }

        return await response.json();
    },

    async updateProduct(id, productData) {
        const response = await fetch(endpoints.products.detail(id), {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            throw new Error('Ошибка обновления продукта');
        }

        return await response.json();
    },

    async deleteProduct(id) {
        const response = await fetch(endpoints.products.detail(id), {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Ошибка удаления продукта');
        }

        return true;
    }
}; 