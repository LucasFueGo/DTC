import { useState } from 'react';
import { Clock, Shield, Swords } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import HeroCard from './HeroCard';
import GameTimeCard from './GameTimeCard';
import CharacterCard from './CharacterCard';

const PlayerStatsBoard = ({ playerName, triumphScore, d1Data, d2Data, membershipId, membershipType }) => {
    const [activeTab, setActiveTab] = useState('D2');

    const combinedHours = (d1Data?.global?.totalHours || 0) + (d2Data?.global?.totalHours || 0);
    const activeCharacters = activeTab === 'D2' ? (d2Data?.characters || []) : (d1Data?.characters || []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <HeroCard 
                name={playerName}
                triumphScore={triumphScore || "Masqué"}
                combinedTime={combinedHours} 
            />

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GameTimeCard 
                    title="Destiny 1" 
                    time={d1Data?.global?.totalHours || 0} 
                    Icon={Shield} 
                    iconColorClass="text-slate-400" 
                    iconBgClass="bg-slate-900"
                    delay={0.1}
                />
                <GameTimeCard 
                    title="Destiny 2" 
                    time={d2Data?.global?.totalHours || 0} 
                    Icon={Swords} 
                    iconColorClass="text-dtc-accent" 
                    iconBgClass="bg-dtc-accent/10"
                    delay={0.2}
                />
            </section>

            <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h4 className="text-xl font-bold text-dtc-text flex items-center gap-2">
                        <Clock className="w-5 h-5 text-dtc-accent" />
                        Temps par Gardien
                    </h4>

                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setActiveTab('D1')}
                            className={`rounded-lg transition-colors ${activeTab === 'D1' ? 'bg-dtc-surface text-dtc-text shadow' : 'text-dtc-muted hover:text-white'}`}
                        >
                            Destiny 1
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setActiveTab('D2')}
                            className={`rounded-lg transition-colors ${activeTab === 'D2' ? 'bg-dtc-surface text-dtc-text shadow' : 'text-dtc-muted hover:text-white'}`}
                        >
                            Destiny 2
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {activeCharacters.length > 0 ? (
                        activeCharacters.map((char, index) => (
                            <CharacterCard 
                                key={char.characterId} 
                                character={char} 
                                membershipId={membershipId}
                                membershipType={membershipType}
                                delay={0.1 * index}
                            />
                        ))
                    ) : (
                        <p className="text-dtc-muted">Aucun gardien trouvé.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PlayerStatsBoard;