import apiClient from './apiClient';

export const statsService = {
    getD1Stats: async (destinyId, type) => {
        try {
            const response = await apiClient.post('stats/D1PlayTime', { 
                membership_id: destinyId, 
                membership_type: type 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: "Erreur D1" };
        }
    },

    getD2Stats: async (destinyId, type, token) => {
        const response = await apiClient.post('stats/D2PlayTime', { 
            membership_id: destinyId, 
            membership_type: type,
            token: token
        });
        return response.data;
    },

    searchPlayer: async (bungieName) => {
        try {
            const response = await apiClient.post('stats/search', { bungieName });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: "Erreur de recherche" };
        }
    },

    autocomplete: async (prefix) => {
        try {
            const response = await apiClient.post('stats/autocomplete', { prefix });
            return response.data;
        } catch (error) {
            return [];
        }
    }
};