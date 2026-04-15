import { useEffect, useState, useContext } from 'react';
import { Context } from '@/context/AuthContext';
import { statsService } from '@/services/statsService';
import Layout from '@/components/Layout/Layout';
import { Loader2 } from 'lucide-react';
import PlayerStatsBoard from '@/components/Dashboard/PlayerStatsBoard';

function Dashboard() {
    const { user } = useContext(Context);
    const [stats, setStats] = useState({ d1: null, d2: null });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllStats = async () => {
            if (!user?.destinyId || !user?.type) return;
            setIsLoading(true);
            try {
                const [d1, d2] = await Promise.all([
                    statsService.getD1Stats(user.destinyId, user.type),
                    statsService.getD2Stats(user.destinyId, user.type, user.token)
                ]);
                setStats({ d1, d2 });
            } catch (error) {
                console.error("Erreur stats :", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllStats();
    }, [user]);

    if (isLoading) return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 text-dtc-accent animate-spin" />
                <p className="text-dtc-muted font-medium tracking-widest uppercase">Connexion aux archives...</p>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <PlayerStatsBoard 
                playerName={user?.name}
                triumphScore={new Intl.NumberFormat('fr-FR').format(stats.d2?.triumphScore || 0)}
                d1Data={stats.d1}
                d2Data={stats.d2}
                membershipId={user.destinyId}
                membershipType={user.type}
            />
        </Layout>
    );
}

export default Dashboard;