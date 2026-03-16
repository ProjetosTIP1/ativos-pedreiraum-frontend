import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/Button';
import { Lock, User, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import style from './Login.module.css';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email: email, password });
            navigate('/admin');
        } catch {
            // Error handling is managed by the store
        }
    };

    return (
        <div className={style.container}>
            <div className={style.loginBox}>
                {/* Background Decoration */}
                <div className={style.topBar}></div>
                
                <div className={style.header}>
                    <div className={style.logo}>
                        V
                    </div>
                    <h2 className={style.title}>
                        Acesso <span className={style.highlight}>Restrito</span>
                    </h2>
                    <p className={style.subtitle}>
                        Painel Administrativo Valemix
                    </p>
                </div>

                <form className={style.form} onSubmit={handleSubmit}>
                    {error && (
                        <div className={style.errorBox}>
                            <AlertTriangle size={18} className={style.errorIcon} />
                            <p className={style.errorText}>{error}</p>
                        </div>
                    )}
                    
                    <div className={style.inputContainer}>
                        <div className={style.inputGroup}>
                            <label className={style.label}>E-mail / Usuário</label>
                            <div className={style.inputWrapper}>
                                <User className={style.inputIcon} size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={style.input}
                                    placeholder="admin@valemix.com.br"
                                />
                            </div>
                        </div>

                        <div className={style.inputGroup}>
                            <label className={style.label}>Senha</label>
                            <div className={style.inputWrapper}>
                                <Lock className={style.inputIcon} size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={style.input}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={style.passwordToggle}
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

                <div className={style.footer}>
                    <p className={style.footerText}>
                        Este sistema é exclusivo para colaboradores autorizados.<br />
                        Tentativas de acesso não autorizado serão registradas.
                    </p>
                </div>
            </div>
        </div>
    );
};
