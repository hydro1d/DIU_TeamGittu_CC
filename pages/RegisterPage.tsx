
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ExperienceLevel } from '../types';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        education: '',
        experienceLevel: ExperienceLevel.Fresher,
        careerTrack: 'Web Dev',
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if(formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        try {
            await register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                education: formData.education,
                experienceLevel: formData.experienceLevel,
                careerTrack: formData.careerTrack,
                skills: [],
                projects: '',
                careerInterests: '',
                cvNotes: '',
            });
            navigate('/dashboard');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to register. Please try again.');
            } else {
                setError('An unknown error occurred during registration.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
            <div className="w-full max-w-lg p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Join Career Connect and take the next step.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 rounded-md">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="fullName" type="text" required placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        <input name="email" type="email" required placeholder="Email Address" value={formData.email} onChange={handleChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        <input name="password" type="password" required placeholder="Password" value={formData.password} onChange={handleChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        <input name="confirmPassword" type="password" required placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        <input name="education" type="text" required placeholder="Education / Department" value={formData.education} onChange={handleChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                        <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                            {Object.values(ExperienceLevel).map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                        <select name="careerTrack" value={formData.careerTrack} onChange={handleChange} className="p-2 border rounded-md md:col-span-2 dark:bg-gray-700 dark:border-gray-600">
                            <option>Web Dev</option>
                            <option>Data</option>
                            <option>Design</option>
                            <option>Marketing</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Sign up
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
