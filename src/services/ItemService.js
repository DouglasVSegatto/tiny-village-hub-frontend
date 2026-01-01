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
}

export default new ItemService();