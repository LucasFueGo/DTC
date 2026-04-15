import React, { useState, createContext, useContext } from 'react';
import { statsService } from '@/services/statsService';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [playerInfo, setPlayerInfo] = useState(null);
    const [d1Data, setD1Data] = useState(null);
    const [d2Data, setD2Data] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (targetQuery) => {
        const query = targetQuery ?? searchQuery;

        if (!query || !query.includes('#')) {
            setError("Le pseudo doit inclure le '#' et les chiffres (ex: Gardien#1234).");
            return;
        }

        setIsLoading(true);
        setError(null);
        setPlayerInfo(null);
        setSearchQuery(query);

        try {
            const targetPlayer = await statsService.searchPlayer(query);
            setPlayerInfo(targetPlayer);

            const [resD1, resD2] = await Promise.all([
                statsService.getD1Stats(targetPlayer.destinyMembershipId, targetPlayer.membershipType),
                statsService.getD2Stats(targetPlayer.destinyMembershipId, targetPlayer.membershipType, null)
            ]);

            setD1Data(resD1);
            setD2Data(resD2);
        } catch (err) {
            setError(err.error || "Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, playerInfo, d1Data, d2Data, isLoading, error, handleSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);
