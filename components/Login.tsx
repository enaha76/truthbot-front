import React, { useState } from 'react';
import { register, login } from '../services/apiService';
import { Lock, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

interface LoginProps {
    onLoginSuccess: (token: string, username: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let data;
            if (isRegistering) {
                data = await register(username, password, fullName);
            } else {
                data = await login(username, password);
            }
            onLoginSuccess(data.access_token, username);
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-surface border border-white/5 rounded-2xl p-8 shadow-2xl animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-DEFAULT/20 text-primary-DEFAULT mb-4">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-text-main">
                        {isRegistering ? 'Join the Resistance' : 'Welcome Back'}
                    </h2>
                    <p className="text-text-muted mt-2">
                        {isRegistering ? 'Create your secure identity' : 'Sign in to access NIRD-Bot'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-4 py-2.5 text-text-main outline-none focus:border-primary-DEFAULT transition-colors"
                            required
                        />
                    </div>

                    {isRegistering && (
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-4 py-2.5 text-text-main outline-none focus:border-primary-DEFAULT transition-colors"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-surfaceHighlight border border-white/10 rounded-lg px-4 py-2.5 text-text-main outline-none focus:border-primary-DEFAULT transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-DEFAULT hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? (
                            <RefreshCw size={20} className="animate-spin" />
                        ) : (
                            <>
                                {isRegistering ? 'Create Account' : 'Sign In'}
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                        }}
                        className="text-text-muted hover:text-primary-DEFAULT text-sm transition-colors"
                    >
                        {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
};
