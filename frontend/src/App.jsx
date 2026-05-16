import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import TaskList from './pages/TaskList';
import Members from './pages/Members';
import { ToastProvider } from './context/ToastContext';

const App = () => {
    return (
        <ToastProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-[#f9f9f9] text-[#111] font-sans">
                <Navbar />
                <div className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/projects" element={<ProjectList />} />
                        <Route path="/tasks" element={<TaskList />} />
                        <Route path="/members" element={<Members />} />
                    </Routes>
                </div>
            </div>
        </Router>
        </ToastProvider>
    );
};

export default App;
