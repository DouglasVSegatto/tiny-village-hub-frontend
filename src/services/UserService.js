import AuthService from "./AuthService.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class UserService {
    async updateAddress(addressData) {
        try {
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}/users/address`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addressData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error updating address:', error);
            throw new Error('Failed to update address. Please try again.');
        }
    }

    async changePassword(currentPassword, newPassword, confirmPassword) {
        try {
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}/users/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.fieldErrors) {
                    const errors = Object.values(errorData.fieldErrors).join('. ');
                    throw new Error(errors);
                }
                throw new Error(errorData.message || 'Failed to change password');
            }

            return { success: true };
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }

    async logoutAllDevices(password) {
        try {
            const response = await AuthService.makeAuthenticatedRequest(`${API_BASE_URL}/auth/logout-all-devices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Error logging out all devices:', error);
            throw new Error('Failed to logout all devices. Please try again.');
        }
    }
}

export default new UserService();
