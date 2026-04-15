import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { equipmentService } from '@/services/equipmentService';
import Layout from '@/components/Layout/Layout';
import { Loader2, ArrowLeft } from 'lucide-react';

function CharacterEquipment() {
    const { type, id, charId } = useParams();
    const navigate = useNavigate();
    
    const [equipment, setEquipment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGear = async () => {
            try {
                const data = await equipmentService.getEquipment(id, type, charId);
                setEquipment(data);
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGear();
    }, [id, type, charId]);

    if (isLoading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 text-dtc-accent animate-spin" />
                    <p className="mt-4 text-dtc-muted font-bold tracking-widest uppercase">Analyse de l'équipement...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-dtc-muted hover:text-white transition-colors font-medium mb-8"
                >
                    <ArrowLeft className="w-5 h-5" /> Retour
                </button>

                <h2 className="text-3xl font-black text-dtc-text mb-8 border-b border-slate-800 pb-4">
                    Équipement Actif
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {equipment.map((item, index) => (
                        <div 
                            key={index} 
                            // Bordure dorée pour les Exotiques, violette pour Légendaire
                            className={`flex items-center gap-4 bg-slate-900 border ${item.tierType === 'Exotic' ? 'border-amber-500' : 'border-purple-500'} rounded-xl p-4 shadow-lg`}
                        >
                            <img 
                                src={item.icon} 
                                alt={item.name} 
                                className="w-16 h-16 rounded border border-slate-700 bg-slate-800"
                            />
                            <div>
                                <h4 className={`font-bold text-lg leading-tight ${item.tierType === 'Exotic' ? 'text-amber-400' : 'text-purple-400'}`}>
                                    {item.name}
                                </h4>
                                <p className="text-sm text-dtc-muted">{item.itemType}</p>
                                <div className="mt-2 inline-block bg-slate-800 text-amber-200 text-xs font-bold px-2 py-1 rounded">
                                    ✦ {item.lightLevel}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default CharacterEquipment;