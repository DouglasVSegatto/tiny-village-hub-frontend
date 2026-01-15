import AuthService from "./AuthService.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_TEMP_ENDPOINT = true; // Set to false to use original endpoints
const ENDPOINT_PREFIX = USE_TEMP_ENDPOINT ? '/items/temp' : '/items';

class ItemService {
    async getAvailableItems() {
        try {
            const response = await fetch(`${API_BASE_URL}${ENDPOINT_PREFIX}/available`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching items:', error);
            throw new Error('Failed to fetch items. Please try again.');
        }
    }

    async createItem(itemData) {
        try {
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}${ENDPOINT_PREFIX}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error creating item:', error);
            throw new Error('Failed to create item. Please try again.');
        }
    }

    async getMyItems() {
        try {
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}${ENDPOINT_PREFIX}/my-items`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching my items:', error);
            throw new Error('Failed to fetch your items. Please try again.');
        }
    }

    async updateItem(itemId, itemData) {
        try {
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}${ENDPOINT_PREFIX}/${itemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error updating item:', error);
            throw new Error('Failed to update item. Please try again.');
        }
    }

    async updateItemStatus(itemId, status) {
        try {
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}${ENDPOINT_PREFIX}/${itemId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error updating item status:', error);
            throw new Error('Failed to update item status. Please try again.');
        }
    }

}

export default new ItemService();
