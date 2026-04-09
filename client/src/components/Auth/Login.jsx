import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const Login = () => {
    const clientId = import.meta.env.VITE_BUNGIE_CLIENT_ID || 'TON_CLIENT_ID_ICI'; 
    
    const loginUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=${clientId}&response_type=code`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 space-y-8 text-center"
            >
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">Bienvenue Gardien</h1>
                    <p className="text-gray-500 text-sm">
                        Connecte-toi avec ton compte Bungie pour accéder à tes statistiques complètes.
                    </p>
                </div>

                <a href={loginUrl} className="block w-full">
                    <Button className="w-full py-6 text-lg font-semibold transition-transform hover:scale-105">
                        Se connecter à Bungie
                    </Button>
                </a>
            </motion.div>
        </div>
    );
};

export default Login;