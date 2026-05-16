import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { ToastContext } from '../context/ToastContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Member');
    const [jobTitle, setJobTitle] = useState('');
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { name, email, password, role, job_title: jobTitle });
            showToast('Signup successful! Please login.', 'success');
            navigate('/login');
        } catch (err) {
            showToast(err.response?.data?.message || 'Signup failed', 'error');
        }
    };

    return (
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 max-w-md w-full mx-auto mt-10 mb-10">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-700 text-sm">Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10"
                    />
                </div>
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
                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-700 text-sm">Job Title</label>
                    <select 
                        value={jobTitle} 
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1em] pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select a job title</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Network Engineer">Network Engineer</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Cloud Engineer">Cloud Engineer</option>
                        <option value="AI Researcher">AI Researcher</option>
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="Sales Executive">Sales Executive</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>
                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-700 text-sm">Role</label>
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1em] pr-10 cursor-pointer"
                    >
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="w-full mt-2 inline-block text-center text-white bg-black border border-black px-6 py-3 rounded-xl font-semibold transition-all hover:bg-gray-800 active:scale-95">Sign Up</button>
            </form>
            <p className="text-center text-gray-600 mt-6 text-sm">
                Already have an account? <Link to="/login" className="text-black font-semibold hover:underline">Login</Link>
            </p>
        </div>
    );
};

export default Signup;
