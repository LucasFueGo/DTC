import { createContext, useContext, useRef } from 'react';
import { statsService } from '@/services/statsService';

const StatsContext = createContext(null);

export const StatsProvider = ({ children }) => {
    // Cache par membershipId — persiste toute la session
    const cache = useRef(new Map());

    const getStats = async (membershipId, membershipType, token = null, force = false) => {
        if (!force && cache.current.has(membershipId)) {
            return cache.current.get(membershipId);
        }

        const [d1, d2] = await Promise.all([
            statsService.getD1Stats(membershipId, membershipType),
            statsService.getD2Stats(membershipId, membershipType, token)
        ]);

        const stats = { d1, d2 };
        cache.current.set(membershipId, stats);
        return stats;
    };

    return (
        <StatsContext.Provider value={{ getStats }}>
            {children}
        </StatsContext.Provider>
    );
};

export const useStats = () => useContext(StatsContext);
