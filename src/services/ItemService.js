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
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_BASE_URL}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
}

export default new ItemService();
