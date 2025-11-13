import { Job, Resource, Match } from '../types';

const API_BASE_URL = '/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) {
        return null as T;
    }
    return response.json();
};

const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

export const getJobs = async (): Promise<Job[]> => {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    return handleResponse<Job[]>(response);
};

export const getJobById = async (id: string): Promise<Job> => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    return handleResponse<Job>(response);
};

export const getResources = async (): Promise<Resource[]> => {
    const response = await fetch(`${API_BASE_URL}/resources`);
    return handleResponse<Resource[]>(response);
};

// New recommendation endpoints that would be calculated by the backend
export const getRecommendedJobs = async (): Promise<Match<Job>[]> => {
    const response = await fetch(`${API_BASE_URL}/recommendations/jobs`, { headers: getAuthHeaders() });
    return handleResponse<Match<Job>[]>(response);
};

export const getRecommendedResources = async (): Promise<Match<Resource>[]> => {
    const response = await fetch(`${API_BASE_URL}/recommendations/resources`, { headers: getAuthHeaders() });
    return handleResponse<Match<Resource>[]>(response);
};
