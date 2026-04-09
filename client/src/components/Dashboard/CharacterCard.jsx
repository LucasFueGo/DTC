// src/components/Dashboard/CharacterCard.jsx
import { motion } from 'framer-motion';

const CharacterCard = ({ character, delay = 0 }) => {
    // On associe une couleur Tailwind selon la classe
    const classColors = {
        "Chasseur": "text-blue-400",
        "Titan": "text-red-400",
        "Arcaniste": "text-yellow-400"
    };
    const color = classColors[character.className] || "text-dtc-text";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="relative bg-dtc-surface border border-slate-800 hover:border-dtc-accent/50 transition-colors rounded-2xl p-6 flex flex-col justify-between overflow-hidden group"
        >
            {/* L'image de l'emblème en fond transparent */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity z-0"
                style={{ backgroundImage: `url(${character.emblemImage})` }}
            />
            
            <div className="relative z-10 flex justify-between items-start mb-4">
                <span className={`font-bold text-lg ${color}`}>{character.className}</span>
                <span className="bg-slate-900 text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/20">
                    ✦ {character.lightLevel}
                </span>
            </div>
            
            <div className="relative z-10 mt-4">
                <p className="text-4xl font-black text-dtc-text">{character.hoursPlayed} h</p>
                <p className="text-dtc-muted text-xs uppercase mt-1 tracking-wider">Temps de jeu</p>
            </div>
        </motion.div>
    );
};

export default CharacterCard;