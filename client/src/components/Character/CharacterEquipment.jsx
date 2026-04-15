import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEquipment, EQUIPMENT_REFRESH_MS } from '@/context/EquipmentContext';
import Layout from '@/components/Layout/Layout';
import { Loader2, ArrowLeft, RefreshCw } from 'lucide-react';

const ARMOR_BUCKETS = [
    { hash: 3448274439, label: 'Casque' },
    { hash: 3551918588, label: 'Gantelets' },
    { hash: 14239492,   label: 'Torse' },
    { hash: 20886954,   label: 'Jambes' },
    { hash: 1585787867, label: 'Objet de classe' },
];

const WEAPON_BUCKETS = [
    { hash: 1498876634, label: 'Cinétique' },
    { hash: 2465295065, label: 'Énergétique' },
    { hash: 953998645,  label: 'Puissante' },
];

const CLASS_COLORS = {
    Chasseur:  { text: 'text-blue-400',   border: 'border-blue-500/40',   bg: 'from-blue-900/20' },
    Titan:     { text: 'text-red-400',    border: 'border-red-500/40',    bg: 'from-red-900/20' },
    Arcaniste: { text: 'text-yellow-400', border: 'border-yellow-500/40', bg: 'from-yellow-900/20' },
};

function ItemSlot({ item, label }) {
    const isEmpty = !item;
    const isExotic = item?.tierType === 'Exotic';

    return (
        <div className={`flex items-center gap-3 rounded-xl p-3 border transition-colors
            ${isEmpty
                ? 'bg-slatec-900/30 border-slate-800 opacity-40'
                : isExotic
                    ? 'bg-slate-900 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                    : 'bg-slate-900 border-purple-500/40'
            }`}
        >
            {isEmpty ? (
                <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <span className="text-slate-600 text-xs">—</span>
                </div>
            ) : (
                <img
                    src={item.icon}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg border border-slate-700 bg-slate-800 shrink-0 object-cover"
                />
            )}
            <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium truncate ${isEmpty ? 'text-slate-600' : isExotic ? 'text-amber-400' : 'text-purple-300'}`}>
                    {isEmpty ? label : item.name}
                </p>
                {!isEmpty && (
                    <p className="text-xs text-dtc-muted truncate">{item.itemType}</p>
                )}
                {!isEmpty && (
                    <span className="inline-block mt-1 text-[10px] font-bold bg-slate-800 text-amber-200 px-1.5 py-0.5 rounded">
                        ✦ {item.lightLevel}
                    </span>
                )}
            </div>
        </div>
    );
}

function CharacterPanel({ className, emblemImage, lightLevel }) {
    const colors = CLASS_COLORS[className] || CLASS_COLORS['Chasseur'];

    return (
        <div className={`relative flex flex-col items-center justify-center rounded-2xl border ${colors.border} bg-linear-to-b ${colors.bg} to-transparent overflow-hidden h-full min-h-80`}>
            {emblemImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-15"
                    style={{ backgroundImage: `url(${emblemImage})` }}
                />
            )}
            <div className="relative z-10 flex flex-col items-center gap-4 p-6">
                {/* Silhouette placeholder — sera remplacée par le vrai rendu 3D */}
                <div className={`w-24 h-24 rounded-full border-2 ${colors.border} bg-slate-900/80 flex items-center justify-center`}>
                    <span className={`text-4xl font-black ${colors.text}`}>
                        {className?.[0] ?? '?'}
                    </span>
                </div>
                <p className={`text-lg font-black tracking-widest uppercase ${colors.text}`}>
                    {className ?? '—'}
                </p>
                {lightLevel && (
                    <span className="text-xs font-bold bg-slate-900/80 text-amber-200 px-3 py-1 rounded-full border border-amber-500/20">
                        ✦ {lightLevel}
                    </span>
                )}
            </div>
        </div>
    );
}

function CharacterEquipment() {
    const { type, id, charId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();

    const { getEquipment } = useEquipment();
    const [equipment, setEquipment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchGear = async (force = false) => {
        if (force) setIsRefreshing(true);
        try {
            const data = await getEquipment(id, type, charId, force);
            setEquipment(data);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchGear();
        const interval = setInterval(() => fetchGear(true), EQUIPMENT_REFRESH_MS);
        return () => clearInterval(interval);
    }, [id, type, charId]);

    const byBucket = (hash) => equipment.find(item => item.bucketHash === hash) ?? null;

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
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-dtc-muted hover:text-white transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5" /> Retour
                </button>

                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h2 className="text-3xl font-black text-dtc-text">Équipement Actif</h2>
                    <button
                        onClick={() => fetchGear(true)}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 text-sm font-medium text-dtc-muted hover:text-white disabled:opacity-50 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Actualisation...' : 'Actualiser'}
                    </button>
                </div>

                {/* Layout Destiny : armures | personnage | armes */}
                <div className="grid grid-cols-[1fr_160px_1fr] gap-4 items-start">

                    {/* Colonne gauche — Armes */}
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-bold text-dtc-muted uppercase tracking-widest mb-1">Armes</p>
                        {WEAPON_BUCKETS.map(({ hash, label }) => (
                            <ItemSlot key={hash} item={byBucket(hash)} label={label} />
                        ))}
                    </div>

                    {/* Centre — Personnage */}
                    <CharacterPanel
                        className={state?.className}
                        emblemImage={state?.emblemImage}
                        lightLevel={state?.lightLevel}
                    />

                    {/* Colonne droite — Armures */}
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-bold text-dtc-muted uppercase tracking-widest mb-1">Armure</p>
                        {ARMOR_BUCKETS.map(({ hash, label }) => (
                            <ItemSlot key={hash} item={byBucket(hash)} label={label} />
                        ))}
                    </div>

                </div>
            </div>
        </Layout>
    );
}

export default CharacterEquipment;
