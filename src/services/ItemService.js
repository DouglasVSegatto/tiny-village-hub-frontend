import AuthService from "./AuthService.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_ENDPOINT = '/items';
const PAGINATED_PATH = '/paginated'; // Set to '' when ready to remove

class ItemService {
    async getAvailableItems(page = 0, size = 20) {
        try {
            const response = await fetch(`${API_BASE_URL}${ITEMS_ENDPOINT}${PAGINATED_PATH}?page=${page}&size=${size}`);

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
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}${ITEMS_ENDPOINT}`, {
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

    async getMyItems(page = 0, size = 20) {
        try {
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}${ITEMS_ENDPOINT}${PAGINATED_PATH}/my-items?page=${page}&size=${size}`);

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
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}${ITEMS_ENDPOINT}/${itemId}`, {
                method: 'PUT',
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
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}${ITEMS_ENDPOINT}/${itemId}/status?status=${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
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

    async deleteItem(itemId) {
        try {
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}${ITEMS_ENDPOINT}/${itemId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error deleting item:', error);
            throw new Error('Failed to delete item. Please try again.');
        }
    }

    async uploadImage(itemId, file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}${ITEMS_ENDPOINT}/${itemId}/images`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image. Please try again.');
        }
    }

    async deleteImage(itemId, index) {
        try {
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}${ITEMS_ENDPOINT}/${itemId}/images/${index}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new Error('Failed to delete image. Please try again.');
        }
    }

}

export default new ItemService();
