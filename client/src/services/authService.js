import apiClient from './apiClient';

export const authService = {
    exchangeBungieToken: async (code) => {
        try {
            const response = await apiClient.post('auth/exchangeToken', { code });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: "Erreur lors de l'échange du jeton avec Bungie" };
        }
    }
};