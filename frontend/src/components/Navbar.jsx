import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContext } from '../context/ToastContext';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const { showToast } = useContext(ToastContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showToast('Logged out successfully', 'info');
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 md:px-10 py-4 md:py-5 shadow-sm">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <h2 className="m-0 font-extrabold text-black text-xl md:text-2xl tracking-tight">Team Task Manager</h2>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
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

                {/* Mobile Menu Button */}
                <button 
                    onClick={toggleMenu}
                    className="md:hidden text-gray-700 hover:text-black focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-gray-100 flex flex-col gap-2 animate-slide-in-right">
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-4 py-3 rounded-lg transition-colors">Dashboard</Link>
                            <Link to="/projects" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-4 py-3 rounded-lg transition-colors">Projects</Link>
                            <Link to="/tasks" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-4 py-3 rounded-lg transition-colors">Tasks</Link>
                            {user.role === 'Admin' && (
                                <Link to="/members" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-4 py-3 rounded-lg transition-colors">Users</Link>
                            )}
                            <div className="px-4 py-2 text-gray-400 font-medium border-t border-gray-50 mt-2">
                                {user.name}
                            </div>
                            <button onClick={handleLogout} className="text-left text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-4 py-3 rounded-lg transition-colors">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-4 py-3 rounded-lg transition-colors">Dashboard</Link>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-4 py-3 rounded-lg transition-colors">Login</Link>
                            <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-semibold hover:text-black hover:bg-black/5 px-4 py-3 rounded-lg transition-colors">Signup</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
