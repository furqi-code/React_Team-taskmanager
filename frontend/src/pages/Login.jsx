import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { ToastContext } from '../context/ToastContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            showToast('Login successful', 'success');
            navigate('/dashboard');
        } catch (err) {
            showToast(err.response?.data?.message || 'Login failed', 'error');
        }
    };

    return (
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full mx-auto mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-700 text-sm">Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10"
                    />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-700 text-sm">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10"
                    />
                </div>
                <button type="submit" className="w-full mt-2 inline-block text-center text-white bg-black border border-black px-6 py-3 rounded-xl font-semibold transition-all hover:bg-gray-800 active:scale-95">Login</button>
            </form>
            <p className="text-center text-gray-600 mt-6 text-sm">
                Don't have an account? <Link to="/signup" className="text-black font-semibold hover:underline">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
