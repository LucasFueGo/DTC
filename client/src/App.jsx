import { useContext } from 'react'
import { Context } from '@/context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/components/Dashboard/Dashboard'
import Auth from '@/components/Auth/Login';
import Loader from '@/components/ui/Loader';
import Search from '@/components/Header/Search';

function App() {
  const { user, loading } = useContext(Context);

  if(loading){
    return <Loader />;
  }

  return (
    <Routes>
      <Route 
        path="/Auth" 
        element={user ? <Navigate to="/" /> : <Auth />}
      />
      <Route 
        path="/" 
        element={user ? <Dashboard /> : <Navigate to="/Auth" />}
      />
      <Route 
        path="/dashboard" 
        element={user ? <Dashboard /> : <Navigate to="/Auth" />}
      />
      <Route 
        path="/search" 
        element={user ? <Search /> : <Navigate to="/Auth" />}
      />
    </Routes>
  )
}

export default App
