import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Context } from '../../context/AuthContext';

const Login = () => {
    const { authenticateWithBungie } = useContext(Context);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const clientId = import.meta.env.VITE_BUNGIE_CLIENT_ID; 
    const loginUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=${clientId}&response_type=code`;

    useEffect(() => {
        const code = searchParams.get('code');
        
        if (code) {
            handleBungieAuth(code);
        }
    }, [searchParams]);

    const handleBungieAuth = async (code) => {
        setIsLoading(true);
        const success = await authenticateWithBungie(code); 
        
        if (success) {
            navigate('/');
        } else {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dtc-bg p-4 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm bg-dtc-surface border border-slate-800/50 rounded-2xl shadow-2xl p-8 space-y-8 text-center"
            >
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-wide text-dtc-text">
                        {isLoading ? "Connexion..." : "Bienvenue Gardien"}
                    </h1>
                    <p className="text-dtc-muted text-sm">
                        {isLoading 
                            ? "Authentification avec les serveurs de Bungie en cours..." 
                            : "Connecte-toi avec ton compte Bungie pour accéder à tes statistiques."}
                    </p>
                </div>

                {!isLoading && (
                    <a href={loginUrl} className="block w-full">
                        <Button className="w-full py-6 text-lg font-bold transition-all hover:scale-105 bg-dtc-accent text-slate-950 hover:bg-dtc-accent-hover shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] border-none">
                            Se connecter à Bungie
                        </Button>
                    </a>
                )}
            </motion.div>
        </div>
    );
};

export default Login;