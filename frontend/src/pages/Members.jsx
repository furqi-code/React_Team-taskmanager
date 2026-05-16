import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const user = JSON.parse(localStorage.getItem('user'));

    // Admin only access check
    if (!user || user.role !== 'Admin') {
        return <Navigate to="/dashboard" replace />;
    }

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await api.get('/tasks/users');
                // The endpoint returns all users (id, name, email, role)
                setMembers(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load users.');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    if (loading) return <div className="text-gray-500 font-medium">Loading users...</div>;
    if (error) return <div className="text-red-500 font-medium">{error}</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Users</h2>
            </div>
            
            {members.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <p className="text-gray-500">No users found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {members.map(member => (
                        <div key={member.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-2 ${member.role === 'Admin' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-blue-400 to-cyan-400'}`}></div>
                            <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&size=128&bold=true`} 
                                alt={member.name}
                                className="w-20 h-20 rounded-full mb-4 shadow-sm object-cover mt-2 border-2 border-white ring-2 ring-gray-100"
                            />
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                            <p className="text-gray-600 font-semibold text-sm mb-1">{member.job_title || 'Not Specified'}</p>
                            <p className="text-gray-400 text-xs mb-4 truncate w-full" title={member.email}>{member.email}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${member.role === 'Admin' ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                                {member.role}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Members;
