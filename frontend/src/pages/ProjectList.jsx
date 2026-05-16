import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { ToastContext } from '../context/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    
    const user = JSON.parse(localStorage.getItem('user'));
    const { showToast } = useContext(ToastContext);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', { name, description });
            resetForm();
            fetchProjects();
            showToast('Project created successfully', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Error creating project', 'error');
        }
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/projects/${editingProject.id}`, { name, description });
            resetForm();
            fetchProjects();
            showToast('Project updated successfully', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Error updating project', 'error');
        }
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/projects/${projectToDelete}`);
            fetchProjects();
            showToast('Project deleted successfully', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Error deleting project', 'error');
        } finally {
            setIsModalOpen(false);
            setProjectToDelete(null);
        }
    };

    const handleDeleteClick = (projectId) => {
        setProjectToDelete(projectId);
        setIsModalOpen(true);
    };

    const handleEditClick = (project) => {
        setEditingProject(project);
        setName(project.name);
        setDescription(project.description || '');
        setShowCreateForm(true);
    };

    const resetForm = () => {
        setEditingProject(null);
        setShowCreateForm(false);
        setName('');
        setDescription('');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Projects</h2>
                {user?.role === 'Admin' && !showCreateForm && (
                    <button onClick={() => setShowCreateForm(true)} className="text-white bg-black px-6 py-2 rounded-xl font-semibold transition-all hover:bg-gray-800 active:scale-95">
                        + Create New Project
                    </button>
                )}
            </div>
            
            {user?.role === 'Admin' && showCreateForm && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 transition-all mb-8 max-w-2xl relative">
                    <button onClick={resetForm} className="absolute top-6 right-6 text-gray-400 hover:text-black font-bold">✕ Close</button>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
                    <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject}>
                        <div className="mb-5">
                            <label className="block mb-2 font-semibold text-gray-700 text-sm">Project Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10"
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 font-semibold text-gray-700 text-sm">Description</label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base bg-gray-50 text-gray-800 transition-all focus:outline-none focus:border-black focus:ring-4 focus:ring-black/10"
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full mt-2 inline-block text-center text-white bg-black border border-black px-6 py-3 rounded-xl font-semibold transition-all hover:bg-gray-800 active:scale-95">
                            {editingProject ? 'Update Project' : 'Create Project'}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
                {projects.length === 0 ? <p className="text-gray-500">No projects found.</p> : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider rounded-tl-lg">Project Name</th>
                                <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider">Description</th>
                                {user?.role === 'Admin' && (
                                    <th className="p-4 font-semibold text-white bg-black text-xs uppercase tracking-wider rounded-tr-lg">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <tr key={project.id} className="transition-colors hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                    <td className="p-4 text-gray-900 font-semibold">
                                        <Link to={`/tasks?project=${project.id}`} className="hover:text-indigo-600 hover:underline transition-colors">
                                            {project.name}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm leading-relaxed max-w-lg">{project.description}</td>
                                    {user?.role === 'Admin' && (
                                        <td className="p-4">
                                            <button onClick={() => handleEditClick(project)} className="text-indigo-600 hover:text-indigo-800 font-semibold mr-4 transition-colors bg-transparent shadow-none border-none p-0 m-0 w-auto hover:bg-transparent" title="Edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            </button>
                                            <button onClick={() => handleDeleteClick(project.id)} className="text-red-600 hover:text-red-800 font-semibold transition-colors bg-transparent shadow-none border-none p-0 m-0 w-auto hover:bg-transparent" title="Delete">
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
                title="Delete Project"
                message="Are you sure you want to delete this project? This will NOT delete associated tasks but they may become unlinked. This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ProjectList;
