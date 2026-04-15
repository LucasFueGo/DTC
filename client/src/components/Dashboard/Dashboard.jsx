import { useEffect, useState, useContext } from 'react';
import { Context } from '@/context/AuthContext';
import { useStats } from '@/context/StatsContext';
import Layout from '@/components/Layout/Layout';
import { Loader2, RefreshCw } from 'lucide-react';
import PlayerStatsBoard from '@/components/Dashboard/PlayerStatsBoard';

function Dashboard() {
    const { user } = useContext(Context);
    const { getStats } = useStats();
    const [stats, setStats] = useState({ d1: null, d2: null });
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAllStats = async (force = false) => {
        if (!user?.destinyId || !user?.type) return;
        if (force) setIsRefreshing(true); else setIsLoading(true);
        try {
            const result = await getStats(user.destinyId, user.type, user.token, force);
            setStats(result);
        } catch (error) {
            console.error("Erreur stats :", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { fetchAllStats(); }, [user]);

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
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => fetchAllStats(true)}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 text-sm font-medium text-dtc-muted hover:text-white disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Actualisation...' : 'Actualiser'}
                </button>
            </div>
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