import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const { showToast } = useContext(ToastContext);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showToast('Logged out successfully', 'info');
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-10 py-5 flex justify-between items-center shadow-sm">
            <h2 className="m-0 font-extrabold text-black text-2xl tracking-tight ml-6">Team Task Manager</h2>
            <div className="flex items-center gap-6">
                {user ? (
                    <>
                        <Link to="/dashboard" className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-3 py-2 rounded-lg transition-colors">Dashboard</Link>
                        <Link to="/projects" className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-3 py-2 rounded-lg transition-colors">Projects</Link>
                        <Link to="/tasks" className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-3 py-2 rounded-lg transition-colors">Tasks</Link>
                        {user.role === 'Admin' && (
                            <Link to="/members" className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-3 py-2 rounded-lg transition-colors">Users</Link>
                        )}
                        <span className="ml-4 text-gray-400 font-medium">
                            {user.name}
                        </span>
                        <button onClick={handleLogout} className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-3 py-2 rounded-lg transition-colors">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-3 py-2 rounded-lg transition-colors">Dashboard</Link>
                        <Link to="/login" className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-3 py-2 rounded-lg transition-colors">Login</Link>
                        <Link to="/signup" className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-3 py-2 rounded-lg transition-colors">Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
