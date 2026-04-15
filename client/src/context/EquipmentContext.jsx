import { createContext, useContext, useRef } from 'react';
import { equipmentService } from '@/services/equipmentService';

// Intervalle de rafraîchissement automatique — à ajuster selon les besoins
export const EQUIPMENT_REFRESH_MS = 5 * 60 * 1000; // 5 minutes

const EquipmentContext = createContext(null);

export const EquipmentProvider = ({ children }) => {
    // Cache par charId : { data, fetchedAt }
    const cache = useRef(new Map());

    const getEquipment = async (id, type, charId, force = false) => {
        const cached = cache.current.get(charId);
        const isStale = !cached || (Date.now() - cached.fetchedAt >= EQUIPMENT_REFRESH_MS);

        if (!force && !isStale) {
            return cached.data;
        }

        const data = await equipmentService.getEquipment(id, type, charId);
        cache.current.set(charId, { data, fetchedAt: Date.now() });
        return data;
    };

    return (
        <EquipmentContext.Provider value={{ getEquipment }}>
            {children}
        </EquipmentContext.Provider>
    );
};

export const useEquipment = () => useContext(EquipmentContext);
