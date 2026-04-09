import Header from '@/components/Header/Header';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-dtc-bg text-dtc-text font-sans">
            <Header />
            
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;