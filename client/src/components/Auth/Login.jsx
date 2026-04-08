import React, { useState } from 'react';
import { useContext } from 'react';
import { Context } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const Login = () => {
    const { login } = useContext(Context);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [password, setPaswword] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();

        const success = await login(name, password);

        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Login</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Name
                        </label>
                        <input 
                            type="name"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">
                            Password
                        </label>
                        <input 
                            type="password"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            value={password}
                            onChange={(e) => setPaswword(e.target.value)}
                        />
                    </div>

                    <Button type="submit" className="w-full py-6 text-lg">
                        Se connecter
                    </Button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;