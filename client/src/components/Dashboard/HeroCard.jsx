// src/components/Dashboard/HeroCard.jsx
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const HeroCard = ({ name, triumphScore, combinedTime }) => {
    return (
        <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dtc-surface border border-slate-800 rounded-3xl p-8 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-dtc-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-sm font-bold tracking-widest text-dtc-accent uppercase mb-1">Dashboard</h2>
                    <h3 className="text-3xl font-bold text-dtc-text">{name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-dtc-muted">
                        <Trophy className="w-4 h-4" />
                        <span>Score de Triomphe : {triumphScore}</span>
                    </div>
                </div>

                <div className="text-left md:text-right">
                    <p className="text-dtc-muted text-sm uppercase tracking-wider mb-1">Temps de jeu total</p>
                    <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-dtc-text to-dtc-muted">
                        {combinedTime} <span className="text-2xl text-dtc-muted font-bold">heures</span>
                    </p>
                </div>
            </div>
        </motion.section>
    );
};

export default HeroCard;