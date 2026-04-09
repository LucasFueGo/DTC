// src/components/Dashboard/GameTimeCard.jsx
import { motion } from 'framer-motion';

const GameTimeCard = ({ title, time, Icon, iconColorClass, iconBgClass, delay = 0 }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="bg-dtc-surface border border-slate-800 rounded-2xl p-6 flex items-center gap-6"
        >
            <div className={`p-4 rounded-xl ${iconBgClass}`}>
                <Icon className={`w-8 h-8 ${iconColorClass}`} />
            </div>
            <div>
                <p className="text-dtc-muted text-sm uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-bold text-dtc-text">{time} h</p>
            </div>
        </motion.div>
    );
};

export default GameTimeCard;