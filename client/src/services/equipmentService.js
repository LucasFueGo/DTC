import apiClient from './apiClient';

export const equipmentService = {
    getEquipment: async (destinyId, type, characterId) => {
        try {
            const response = await apiClient.post('equipment/', { 
                membership_id: destinyId, 
                membership_type: type,
                character_id: characterId
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: "Erreur équipement" };
        }
    }
};