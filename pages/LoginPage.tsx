
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from '../components/icons';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to log in. Please check your credentials.');
            } else {
                setError('An unknown error occurred during login.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
            <header className="absolute top-0 left-0 w-full p-4 sm:p-6 lg:p-8">
                <div className="container mx-auto">
                    <Link to="/" className="text-3xl font-bold text-orange-500 hover:opacity-80 transition-opacity">
                        Career Connect
                    </Link>
                </div>
            </header>
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg opacity-0 animate-fadeInUp">
                <div className="text-center opacity-0 animate-fadeInUp animation-delay-200">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Log in to find your next opportunity.</p>
                </div>
                <form className="mt-8 space-y-6 opacity-0 animate-fadeInUp animation-delay-400" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-center bg-red-100 dark:bg-red-900 p-2 rounded-md">{error}</p>}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                             <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 z-20 px-3 flex items-center text-gray-500 hover:text-orange-500 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword 
                                    ? <EyeOff key="eye-off" className="h-5 w-5 animate-spinIn" /> 
                                    : <Eye key="eye-on" className="h-5 w-5 animate-spinIn" />
                                }
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                        >
                            Log in
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 opacity-0 animate-fadeInUp animation-delay-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-orange-500 dark:text-orange-400 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
