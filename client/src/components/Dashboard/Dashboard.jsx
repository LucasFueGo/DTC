// src/pages/Dashboard.jsx
import { useEffect, useState, useContext } from 'react';
import { Context } from '@/context/AuthContext';
import { statsService } from '@/services/statsService'; // Ajuste le chemin
import Layout from '@/components/Layout/Layout';
import { Clock, Shield, Swords, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

import HeroCard from '@/components/Dashboard/HeroCard';
import GameTimeCard from '@/components/Dashboard/GameTimeCard';
import CharacterCard from '@/components/Dashboard/CharacterCard';

function Dashboard() {
    const { user } = useContext(Context);
    
    const [d1Data, setD1Data] = useState(null);
    const [d2Data, setD2Data] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [activeTab, setActiveTab] = useState('D2');

    useEffect(() => {
        const fetchAllStats = async () => {
            if (!user?.destinyId || !user?.type) return;

            setIsLoading(true);
            try {
                const [resD1, resD2] = await Promise.all([
                    statsService.getD1Stats(user.destinyId, user.type),
                    statsService.getD2Stats(user.destinyId, user.type, user.token)
                ]);

                setD1Data(resD1);
                setD2Data(resD2);
            } catch (error) {
                console.error("Erreur lors de la récupération des stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllStats();
    }, [user]);

    if (isLoading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <Loader2 className="w-12 h-12 text-dtc-accent animate-spin" />
                    <p className="text-dtc-muted font-medium tracking-widest uppercase">Connexion aux archives...</p>
                </div>
            </Layout>
        );
    }

    const combinedHours = (d1Data?.global?.totalHours || 0) + (d2Data?.global?.totalHours || 0);
    const activeCharacters = activeTab === 'D2' ? (d2Data?.characters || []) : (d1Data?.characters || []);

    return (
        <Layout>            
            <div className="space-y-8">
                
                <HeroCard 
                    name={user?.name || "Gardien"}
                    triumphScore={d2Data.triumphScore}
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
                                    delay={0.1 * index}
                                />
                            ))
                        ) : (
                            <p className="text-dtc-muted">Aucun gardien trouvé pour ce jeu.</p>
                        )}
                    </div>
                </section>
            </div>
        </Layout>
    )
}

export default Dashboard;