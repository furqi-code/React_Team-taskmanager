import React, { useEffect, useState, useContext } from 'react';
import { ToastContext } from '../context/ToastContext';
import api from '../api';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const { showToast } = useContext(ToastContext);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}/status`, { status: newStatus });
            fetchTasks();
            showToast('Status updated', 'success');
        } catch (err) {
            showToast('Error updating status', 'error');
        }
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/tasks/${taskToDelete}`);
            fetchTasks();
            showToast('Task deleted successfully', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Error deleting task', 'error');
        } finally {
            setIsModalOpen(false);
            setTaskToDelete(null);
        }
    };

    const handleDeleteClick = (taskId) => {
        setTaskToDelete(taskId);
        setIsModalOpen(true);
    };

    const pending = tasks.filter(t => t.status === 'Pending').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const completed = tasks.filter(t => t.status === 'Completed').length;

    const getBadgeClass = (status) => {
        switch(status) {
            case 'Pending': return 'bg-red-100 text-red-800 border border-red-200';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'Completed': return 'bg-green-100 text-green-800 border border-green-200';
            default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 tracking-tight">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-md">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">Pending Tasks</h3>
                    <p className="text-3xl md:text-4xl font-bold text-black mt-2">{pending}</p>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-md">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">In Progress</h3>
                    <p className="text-3xl md:text-4xl font-bold text-black mt-2">{inProgress}</p>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">Completed Tasks</h3>
                    <p className="text-3xl md:text-4xl font-bold text-black mt-2">{completed}</p>
                </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-10 md:mt-12 mb-6">Recent Tasks</h3>
            <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-200 overflow-x-auto custom-scrollbar">
                {tasks.length === 0 ? <p className="text-gray-500">No tasks found.</p> : (
                    <table className="w-full text-left border-collapse mb-4">
                        <thead>
                            <tr>
                                <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider rounded-tl-lg">Task Name</th>
                                <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider">Project</th>
                                <th className={`p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider ${currentUser?.role !== 'Admin' ? 'rounded-tr-lg' : ''}`}>Status</th>
                                {currentUser?.role === 'Admin' && (
                                    <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider rounded-tr-lg">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.slice(0, 5).map(task => (
                                <tr key={task.id} className="transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                    <td className="p-4 text-gray-900 font-semibold">{task.title}</td>
                                    <td className="p-4 text-gray-600 text-sm">{task.project_name}</td>
                                    <td className="p-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${getBadgeClass(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    {currentUser?.role === 'Admin' && (
                                        <td className="p-4">
                                            <Link to={`/tasks?edit=${task.id}`} className="inline-block align-middle text-indigo-600 hover:text-indigo-800 font-semibold mr-4 transition-colors" title="Edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </Link>
                                            <button onClick={() => handleDeleteClick(task.id)} className="inline-block align-middle text-red-600 hover:text-red-800 font-semibold transition-colors bg-transparent shadow-none border-none p-0 m-0 w-auto hover:bg-transparent" title="Delete">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {currentUser ? (
                    <Link to="/tasks" className="w-full md:w-auto inline-block text-center text-white bg-black border border-black px-8 py-3.5 rounded-xl font-semibold transition-all hover:bg-gray-800 active:scale-95 mt-6 shadow-lg shadow-black/10">View All Tasks</Link>
                ) : (
                    <button onClick={() => setIsLoginPopupOpen(true)} className="w-full md:w-auto inline-block text-center text-white bg-black border border-black px-8 py-3.5 rounded-xl font-semibold transition-all hover:bg-gray-800 active:scale-95 mt-6 shadow-lg shadow-black/10">View All Tasks</button>
                )}
            </div>

            <ConfirmationModal 
                isOpen={isModalOpen}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setIsModalOpen(false)}
            />

            {isLoginPopupOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 transform transition-all scale-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed">You need to log in to view and manage all tasks.</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsLoginPopupOpen(false)}
                                className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <Link 
                                to="/login"
                                className="flex-1 inline-block text-center px-6 py-3 rounded-xl font-semibold text-white bg-black hover:bg-gray-800 transition-colors shadow-lg"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
