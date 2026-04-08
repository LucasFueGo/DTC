import { useContext, useState } from 'react';
import { Context } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Menu, X, LogOut, PieChart, Users, Folder, Search as SearchIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

function Header() {
    const { logout } = useContext(Context);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { label: "Dashboard", icon: Users, href: "/" }
    ];

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>                
            <header className="sticky top-0 z-50 glass-effect border-b bg-white/60 backdrop-blur-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <h1 className="text-xl font-bold text-red-900 hidden sm:block">
                                DTC
                            </h1>
                        </motion.div>

                        <nav className="hidden md:flex items-center gap-6">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.href}
                                    className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
                                >
                                    <item.icon className="h-4 w-4" /> 
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            <div className="hidden md:block">
                                <Button variant="ghost" className="text-red-700 hover:text-red-900 hover:bg-red-50" onClick={handleLogout}>
                                    Se déconnecter
                                </Button>
                            </div>

                            <div className="md:hidden">
                                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                                    <Menu className="h-6 w-6 text-red-900" />
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        />

                        <motion.div
                            key="sidebar"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-3/4 max-w-sm bg-white z-50 shadow-2xl p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-lg text-red-900">Menu</span>
                                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>

                            <nav className="flex-1 space-y-2">
                                {menuItems.map((item, index) => (
                                    <Link 
                                        key={index}
                                        to={item.href} 
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-gray-700 font-medium transition-all group"
                                    >
                                        <div className="bg-gray-50 group-hover:bg-white p-2 rounded-lg transition-colors">
                                            <item.icon className="h-5 w-5 text-gray-500 group-hover:text-red-600" />
                                        </div>
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <Button 
                                    variant="destructive" 
                                    className="w-full flex items-center justify-center gap-2 py-6 rounded-xl"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Se déconnecter
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default Header;