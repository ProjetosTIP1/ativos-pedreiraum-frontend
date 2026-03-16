import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/Button';
import { Lock, User, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ username, password });
            navigate('/admin');
        } catch {
            // Error handling is managed by the store
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[var(--color-dark-card)] p-10 border border-[var(--color-border)] relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-industrial-orange)]"></div>
                
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-[var(--color-industrial-orange)] flex items-center justify-center font-black text-black text-2xl mb-4 italic">
                        V
                    </div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                        Acesso <span className="text-[var(--color-industrial-orange)]">Restrito</span>
                    </h2>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                        Painel Administrativo Valemix
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-[var(--color-error)]/10 border border-[var(--color-error)] p-4 flex items-start gap-3">
                            <AlertTriangle size={18} className="text-[var(--color-error)] flex-shrink-0" />
                            <p className="text-[var(--color-error)] text-xs font-bold uppercase tracking-widest">{error}</p>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">E-mail / Usuário</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-sm focus:border-[var(--color-industrial-orange)] outline-none transition-all"
                                    placeholder="admin@valemix.com.br"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-12 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-white text-sm focus:border-[var(--color-industrial-orange)] outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                            className="italic"
                        >
                            Entrar no Sistema
                        </Button>
                    </div>
                </form>

                <div className="mt-6 pt-6 border-t border-[var(--color-border)] text-center">
                    <p className="text-[9px] uppercase font-bold text-[var(--color-text-dim)] tracking-widest leading-relaxed">
                        Este sistema é exclusivo para colaboradores autorizados.<br />
                        Tentativas de acesso não autorizado serão registradas.
                    </p>
                </div>
            </div>
        </div>
    );
};
