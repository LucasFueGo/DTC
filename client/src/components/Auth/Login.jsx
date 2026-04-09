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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-8 text-center"
            >
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isLoading ? "Connexion..." : "Bienvenue Gardien"}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {isLoading 
                            ? "Authentification avec les serveurs de Bungie en cours..." 
                            : "Connecte-toi avec ton compte Bungie pour accéder à tes statistiques."}
                    </p>
                </div>

                {!isLoading && (
                    <a href={loginUrl} className="block w-full">
                        <Button className="w-full py-6 text-lg font-semibold transition-transform hover:scale-105">
                            Se connecter à Bungie
                        </Button>
                    </a>
                )}
            </motion.div>
        </div>
    );
};

export default Login;