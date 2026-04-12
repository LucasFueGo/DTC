import { useState } from 'react';
import { statsService } from '@/services/statsService';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/Button';
import { SearchIcon, Loader2, AlertCircle, Shield, Swords, Clock } from 'lucide-react';


import HeroCard from '@/components/Dashboard/HeroCard';
import GameTimeCard from '@/components/Dashboard/GameTimeCard';
import CharacterCard from '@/components/Dashboard/CharacterCard';

function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [playerInfo, setPlayerInfo] = useState(null);
    const [d1Data, setD1Data] = useState(null);
    const [d2Data, setD2Data] = useState(null);
    const [activeTab, setActiveTab] = useState('D2');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;

        setIsLoading(true);
        setError(null);
        setPlayerInfo(null);

        try {
            const targetPlayer = await statsService.searchPlayer(searchQuery);
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

    const combinedHours = (d1Data?.global?.totalHours || 0) + (d2Data?.global?.totalHours || 0);
    const activeCharacters = activeTab === 'D2' ? (d2Data?.characters || []) : (d1Data?.characters || []);

    return (
        <Layout>
            <div className="space-y-8">
                
                <section className="bg-dtc-surface border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-dtc-text mb-2">Rechercher un Gardien</h2>
                    <p className="text-dtc-muted mb-6">Entre un pseudo Bungie complet (ex: Gardien#1234)</p>
                    
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-dtc-muted w-5 h-5" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Nom#1234"
                                className="w-full bg-dtc-bg border border-slate-700 text-dtc-text rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-dtc-accent transition-colors"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading} className="bg-dtc-accent text-slate-900 hover:bg-dtc-accent-hover font-bold px-8">
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Scanner"}
                        </Button>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                </section>

                {playerInfo && !isLoading && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <HeroCard 
                            name={playerInfo.displayName} 
                            triumphScore="Masqué"
                            combinedTime={combinedHours} 
                        />

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <GameTimeCard title="Destiny 1" time={d1Data?.global?.totalHours || 0} Icon={Shield} iconColorClass="text-slate-400" iconBgClass="bg-slate-900" delay={0.1}/>
                            <GameTimeCard title="Destiny 2" time={d2Data?.global?.totalHours || 0} Icon={Swords} iconColorClass="text-dtc-accent" iconBgClass="bg-dtc-accent/10" delay={0.2}/>
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-xl font-bold text-dtc-text flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-dtc-accent" /> Personnages
                                </h4>
                                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('D1')} className={activeTab === 'D1' ? 'bg-dtc-surface text-dtc-text' : 'text-dtc-muted'}>D1</Button>
                                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('D2')} className={activeTab === 'D2' ? 'bg-dtc-surface text-dtc-text' : 'text-dtc-muted'}>D2</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {activeCharacters.map((char, i) => (
                                    <CharacterCard key={char.characterId} character={char} delay={0.1 * i} />
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default Search;