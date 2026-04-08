import apiClient from './apiClient';

export const authService = {
    login: async (name, password) => {
        try {
            const response = await apiClient.post('auth/login', { name, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: "Erreur de connexion" };
        }
    },

    getme: async (name, password) => {
        try {
            const response = await apiClient.get('auth/me');
            console.log(response)
            return response;
        } catch (error) {
            throw error.response?.data || { error: "Erreur de connexion" };
        }
    }
};