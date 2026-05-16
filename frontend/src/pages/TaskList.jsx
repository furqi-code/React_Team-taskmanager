import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { ToastContext } from '../context/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showMyTasksOnly, setShowMyTasksOnly] = useState(false);
    const [selectedProjectFilter, setSelectedProjectFilter] = useState('');

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const { showToast } = useContext(ToastContext);

    const fetchData = async () => {
        try {
            const [taskRes, projRes, userRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/projects'),
                api.get('/tasks/users')
            ]);
            setTasks(taskRes.data);
            setProjects(projRes.data);
            setUsers(userRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        
        // Handle URL params for edit and project filter
        const searchParams = new URLSearchParams(window.location.search);
        
        const projectIdFromUrl = searchParams.get('project');
        if (projectIdFromUrl) {
            setSelectedProjectFilter(projectIdFromUrl);
            window.history.replaceState({}, '', '/tasks');
        }

        const editId = searchParams.get('edit');
        if (editId && tasks.length > 0) {
            const taskToEdit = tasks.find(t => t.id === parseInt(editId));
            if (taskToEdit) {
                handleEditClick(taskToEdit);
                // clear URL param without reloading
                window.history.replaceState({}, '', '/tasks');
            }
        }
    }, [tasks.length]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', {
                title,
                description,
                project_id: projectId,
                assigned_to: assignedTo || null,
                due_date: dueDate || null
            });
            resetForm();
            fetchData();
            showToast('Task created successfully', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Error creating task', 'error');
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/tasks/${editingTask.id}`, {
                title,
                description,
                project_id: projectId,
                assigned_to: assignedTo || null,
                due_date: dueDate || null
            });
            resetForm();
            fetchData();
            showToast('Task updated successfully', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Error updating task', 'error');
        }
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/tasks/${taskToDelete}`);
            fetchData();
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

    const handleStatusChange = async (taskId, newStatus) => {
        // Optimistic UI Update for instant feedback
        const originalTasks = [...tasks];
        setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
        
        try {
            await api.put(`/tasks/${taskId}/status`, { status: newStatus });
            // We don't need to fetch all data again here since the local state is already updated!
            showToast('Status updated', 'success');
        } catch (err) {
            // Revert back if the API call fails
            setTasks(originalTasks);
            showToast('Error updating status', 'error');
        }
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description || '');
        setProjectId(task.project_id);
        setAssignedTo(task.assigned_to || '');
        setDueDate(task.due_date ? task.due_date.split('T')[0] : '');
        setShowCreateForm(true);
    };

    const resetForm = () => {
        setEditingTask(null);
        setShowCreateForm(false);
        setTitle('');
        setDescription('');
        setAssignedTo('');
        setDueDate('');
        setProjectId('');
    };

    let displayedTasks = tasks;
    if (showMyTasksOnly) {
        displayedTasks = displayedTasks.filter(task => task.assigned_to === currentUser?.id);
    }
    if (selectedProjectFilter) {
        displayedTasks = displayedTasks.filter(task => task.project_id?.toString() === selectedProjectFilter);
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full md:w-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mr-2">Tasks</h2>
                    <select
                        value={selectedProjectFilter}
                        onChange={e => setSelectedProjectFilter(e.target.value)}
                        className="px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 border-none outline-none cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%234b5563\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[position:right_0.75rem_center] bg-[length:1em]"
                    >
                        <option value="">All Projects</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    <button 
                        onClick={() => setShowMyTasksOnly(!showMyTasksOnly)}
                        className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-colors ${showMyTasksOnly ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {showMyTasksOnly ? 'Show All Tasks' : 'My Tasks'}
                    </button>
                </div>
                {currentUser?.role === 'Admin' && !showCreateForm && (
                    <button onClick={() => setShowCreateForm(true)} className="w-full md:w-auto text-white bg-black px-6 py-2.5 rounded-xl font-semibold transition-all hover:bg-gray-800 active:scale-95 shadow-lg shadow-black/10">
                        + Create New Task
                    </button>
                )}
            </div>

            {currentUser?.role === 'Admin' && showCreateForm && (
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 transition-all mb-8 max-w-2xl relative">
                    <button onClick={resetForm} className="absolute top-4 md:top-6 right-4 md:right-6 text-gray-400 hover:text-black font-bold flex items-center gap-1 text-sm">
                        <span className="hidden md:inline">✕</span> Close
                    </button>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
                    <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="md:col-span-2">
                                <label className="block mb-2 font-semibold text-gray-700 text-sm">Title</label>
                                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-2 font-semibold text-gray-700 text-sm">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows="2" className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10"></textarea>
                            </div>
                            <div>
                                <label className="block mb-2 font-semibold text-gray-700 text-sm">Project</label>
                                {projects.length === 0 ? (
                                    <p className="text-red-500 font-medium text-sm">Please create a project first before adding a task.</p>
                                ) : (
                                    <select value={projectId} onChange={e => setProjectId(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1em] pr-10 cursor-pointer">
                                        <option value="" disabled>Select a project</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div>
                                <label className="block mb-2 font-semibold text-gray-700 text-sm">Assign To</label>
                                <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1em] pr-10 cursor-pointer">
                                    <option value="">Unassigned</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block mb-2 font-semibold text-gray-700 text-sm">Due Date</label>
                                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10" />
                            </div>
                        </div>
                        <button type="submit" disabled={projects.length === 0} className="w-full mt-2 inline-block text-center text-white bg-black border border-black px-6 py-3 rounded-xl font-semibold transition-all hover:bg-gray-800 active:scale-95 disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:active:scale-100">
                            {editingTask ? 'Update Task' : 'Create Task'}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-200 overflow-x-auto custom-scrollbar">
                {displayedTasks.length === 0 ? <p className="text-gray-500">No tasks found.</p> : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider rounded-tl-lg">Task Name</th>
                                <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider">Project</th>
                                <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider">Assignee</th>
                                <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider">Due Date</th>
                                <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider">Status</th>
                                <th className={`p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider ${currentUser?.role !== 'Admin' ? 'rounded-tr-lg' : ''}`}>Deadline</th>
                                {currentUser?.role === 'Admin' && (
                                    <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider rounded-tr-lg">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedTasks.map(task => (
                                <tr key={task.id} className="transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                    <td className="p-4 text-gray-900">
                                        <div className="font-semibold text-base mb-1">{task.title}</div>
                                        <div className="text-sm text-gray-500 line-clamp-2 max-w-sm">{task.description}</div>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm">{task.project_name}</td>
                                    <td className="p-4 text-gray-600 text-sm">{task.assigned_name || 'Unassigned'}</td>
                                    <td className="p-4 text-gray-600 text-sm font-medium">
                                        {task.due_date ? new Date(task.due_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'No Date'}
                                    </td>
                                    <td className="p-4">
                                        <select 
                                            className={`status-select ${task.status.replace(' ', '')} py-1.5 px-3 pr-8 rounded-lg border border-gray-300 text-sm font-semibold cursor-pointer outline-none transition-colors focus:ring-2 focus:ring-black/10`}
                                            value={task.status} 
                                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        {(() => {
                                            if (!task.due_date) return <span className="text-gray-400 text-sm italic">N/A</span>;
                                            
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            const dueDate = new Date(task.due_date);
                                            dueDate.setHours(0, 0, 0, 0);
                                            
                                            const diffTime = dueDate - today;
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                            
                                            let text = '';
                                            let colorClass = '';
                                            
                                            if (task.status === 'Completed') {
                                                text = 'Completed';
                                                colorClass = 'bg-green-100 text-green-800 border-green-200';
                                            } else if (diffDays < 0) {
                                                text = 'Overdue';
                                                colorClass = 'bg-red-100 text-red-800 border-red-200';
                                            } else if (diffDays === 0) {
                                                text = 'Due Today';
                                                colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                                            } else {
                                                text = 'Upcoming';
                                                colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
                                            }
                                            
                                            return (
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${colorClass}`}>
                                                    {text}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    {currentUser?.role === 'Admin' && (
                                        <td className="p-4">
                                            <button onClick={() => handleEditClick(task)} className="text-indigo-600 hover:text-indigo-800 font-semibold mr-4 transition-colors bg-transparent shadow-none border-none p-0 m-0 w-auto hover:bg-transparent" title="Edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button onClick={() => handleDeleteClick(task.id)} className="text-red-600 hover:text-red-800 font-semibold transition-colors bg-transparent shadow-none border-none p-0 m-0 w-auto hover:bg-transparent" title="Delete">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <ConfirmationModal 
                isOpen={isModalOpen}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default TaskList;
