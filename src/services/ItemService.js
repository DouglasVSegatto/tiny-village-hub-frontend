import AuthService from "./AuthService.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ItemService {
    async getAvailableItems() {
        try {
            const response = await fetch(`${API_BASE_URL}/items/available`);

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
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}/items`, {
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
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}/items/my-items`);

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
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}/items/${itemId}`, {
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

}

export default new ItemService();
