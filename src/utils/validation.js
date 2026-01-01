export const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    if (!email.includes('@')) return 'Email must contain @';
    return null;
};

export const validatePassword = (password) => {
    if (!password.trim()) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
};

// Single field validation
export const validateRequired = (value, fieldName) => {
    if (!value.trim()) return `${fieldName} is required`;
    return null;
};

// Multiple fields validation
export const validateForm = (fields) => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value.trim()) {
            // Capitalize first letter
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
            return `${fieldName} is required`;
        }
    }
    return null;
};


