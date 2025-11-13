import { User } from '../types';

const API_BASE_URL = '/api/auth';

const handleAuthResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export const login = async (email: string, pass: string): Promise<{user: User, token: string}> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
    });
    return handleAuthResponse(response);
};

export const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<{user: User, token: string}> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleAuthResponse(response);
};

export const getLoggedInUser = async (): Promise<User | null> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return Promise.resolve(null);
    }
    try {
        const response = await fetch(`${API_BASE_URL}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) { // Token is invalid or expired
            localStorage.removeItem('authToken');
            return null;
        }
        return await handleAuthResponse(response);
    } catch (error) {
        console.error("Failed to fetch logged in user:", error);
        localStorage.removeItem('authToken');
        return null;
    }
};

export const updateUserProfile = async (updatedUser: User): Promise<User> => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Not authenticated');
    }
    const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
    });
    return handleAuthResponse(response);
}
