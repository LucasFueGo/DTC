import { useState, useEffect } from 'react';
import { statsService } from '@/services/statsService';
import Layout from '@/components/Layout/Layout';

import { Button } from '@/components/ui/Button';
import { SearchIcon, Loader2, AlertCircle, Shield, Swords, Clock } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';

import PlayerStatsBoard  from '@/components/Dashboard/PlayerStatsBoard';

function Search() {
    const { searchQuery, setSearchQuery, playerInfo, d1Data, d2Data, isLoading, error, handleSearch } = useSearch();

    const [suggestions, setSuggestions] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);


    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 3 || !searchQuery) {
                setSuggestions([]);
                setIsTyping(false);
                return;
            }

            if (searchQuery.includes('#')) {
                setSuggestions([]);
                return;
            }

            try {
                const results = await statsService.autocomplete(searchQuery);
                setSuggestions(results);
            } catch (err) {
                console.error("Erreur suggestion", err);
            } finally {
                setIsTyping(false);
            }
        };

        if (searchQuery.length >= 3 && !searchQuery.includes('#')) {
            setIsTyping(true);
            setShowSuggestions(true);
        }

        const timeoutId = setTimeout(fetchSuggestions, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const search = (targetQuery) => {
        setShowSuggestions(false);
        handleSearch(targetQuery);
    };

    return (
        <Layout>
            <div className="space-y-8">
                <section className="bg-dtc-surface border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-dtc-text mb-2">Rechercher un Gardien</h2>
                    <p className="text-dtc-muted mb-6">Entre un pseudo pour voir ses états de service.</p>
                    
                    <div className="relative text-left">
                        <form onSubmit={(e) => { e.preventDefault(); search(searchQuery); }} className="flex gap-2">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-dtc-muted w-5 h-5" />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Nom (ex: Gardien ou Gardien#1234)"
                                    className="w-full bg-dtc-bg border border-slate-700 text-dtc-text rounded-xl py-3 pl-12 pr-10 focus:outline-none focus:border-dtc-accent transition-colors relative z-20"
                                />
                                {isTyping && (
                                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dtc-accent animate-spin z-20" />
                                )}
                            </div>
                            <Button type="submit" disabled={isLoading} className="bg-dtc-accent text-slate-900 hover:bg-dtc-accent-hover font-bold px-8 relative z-20">
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Scanner"}
                            </Button>
                        </form>

                        {showSuggestions && searchQuery.length >= 3 && !searchQuery.includes('#') && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-dtc-surface border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                {suggestions.length > 0 ? (
                                    <ul>
                                        {suggestions.map((sug, index) => (
                                            <li key={index}>
                                                <button
                                                    onClick={() => search(sug.fullName)}
                                                    className="w-full text-left px-4 py-3 hover:bg-slate-800 flex items-center justify-between group transition-colors border-b border-slate-800/50 last:border-0"
                                                >
                                                    <span className="text-dtc-text font-medium group-hover:text-dtc-accent transition-colors">
                                                        {sug.displayName}
                                                    </span>
                                                    <span className="text-dtc-muted text-sm font-mono">
                                                        #{sug.code}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : !isTyping ? (
                                    <div className="px-4 py-4 text-center text-dtc-muted text-sm flex items-center justify-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> Aucun gardien trouvé avec ce nom.
                                    </div>
                                ) : null}
                            </div>
                        )}
                        
                        {showSuggestions && (
                            <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                </section>

                {playerInfo && !isLoading && (
                    <PlayerStatsBoard 
                        playerName={playerInfo.displayName}
                        triumphScore="Masqué"
                        d1Data={d1Data}
                        d2Data={d2Data}
                        membershipId={playerInfo.destinyMembershipId} 
                        membershipType={playerInfo.membershipType}
                    />
                )}
            </div>
        </Layout>
    );
}

export default Search;