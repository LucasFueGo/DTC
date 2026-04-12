import { useContext } from 'react';
import { Context } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { LogOut, Users, SearchIcon} from 'lucide-react';
import { Link } from 'react-router-dom';

function Header() {
    const { logout } = useContext(Context);

    const menuItems = [
        { label: "Dashboard", icon: Users, href: "/" },
        { label: "Search", icon: SearchIcon, href: "search" }
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-dtc-surface bg-dtc-bg/80 backdrop-blur-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <h1 className="text-xl font-bold tracking-widest text-dtc-accent">
                            DTC
                        </h1>
                    </motion.div>

                    <nav className="flex items-center gap-4 sm:gap-6">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.href}
                                className="text-sm font-medium text-dtc-muted hover:text-dtc-accent-hover transition-colors flex items-center gap-2"
                            >
                                <item.icon className="h-4 w-4" /> 
                                <span className="hidden xs:inline">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Se déconnecter" 
                            className="text-dtc-muted hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-xl" 
                            onClick={logout}
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>

                </div>
            </div>
        </header>
    );
}

export default Header;