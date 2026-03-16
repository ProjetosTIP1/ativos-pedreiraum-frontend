import React, { useEffect } from 'react';
import { useAssetStore } from '../stores/useAssetStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
    LayoutDashboard, 
    Plus, 
    Edit, 
    Trash2, 
    CheckCircle, 
    TrendingUp, 
    Eye,
    MessageSquare,
    ExternalLink
} from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
    const { assets, fetchAssets } = useAssetStore();
    const { isAuthenticated, user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            fetchAssets();
        }
    }, [isAuthenticated, fetchAssets]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Mock metrics based on loaded assets
    const totalViews = assets.reduce((acc, curr) => acc + curr.view_count, 0);
    const availableAssets = assets.filter(a => a.status === 'AVAILABLE').length;
    
    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-4 border-[var(--color-industrial-orange)] pb-8">
                <div>
                    <span className="text-[10px] uppercase font-black tracking-[0.4em] text-[var(--color-industrial-orange)] mb-2 block">
                        Área Restrita
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic leading-none tracking-tighter flex items-center">
                        <LayoutDashboard size={40} className="mr-4 text-[var(--color-industrial-orange)]" />
                        Admin <span className="text-[var(--color-industrial-orange)]">Dashboard</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-black uppercase text-[var(--color-text-dim)]">Logado como</p>
                        <p className="text-sm font-bold uppercase">{user?.full_name}</p>
                    </div>
                    <Button onClick={() => navigate('/admin/create')} className="flex items-center gap-2 italic">
                        <Plus size={18} /> Novo Ativo
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total de Ativos", value: assets.length, icon: <TrendingUp size={24} />, color: "var(--color-info)" },
                    { label: "Ativos Disponíveis", value: availableAssets, icon: <CheckCircle size={24} />, color: "var(--color-success)" },
                    { label: "Total de Visualizações", value: totalViews, icon: <Eye size={24} />, color: "var(--color-industrial-orange)" },
                    { label: "Interesses (WhatsApp)", value: Math.floor(totalViews * 0.1), icon: <MessageSquare size={24} />, color: "var(--color-industrial-yellow)" },
                ].map((metric, i) => (
                    <div key={i} className="bg-[var(--color-dark-card)] p-6 border border-[var(--color-border)] relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)] mb-2">{metric.label}</p>
                            <p className="text-3xl font-black italic text-white">{metric.value}</p>
                        </div>
                        <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-10 text-white group-hover:scale-125 transition-transform duration-500">
                            {metric.icon}
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-[var(--color-border)]">
                            <div className="h-full bg-[var(--color-industrial-orange)]" style={{ width: '30%', backgroundColor: metric.color }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Asset Table */}
            <div className="bg-[var(--color-dark-card)] border border-[var(--color-border)] overflow-hidden">
                <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface)]">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Gestão de Inventário</h2>
                    <div className="text-[10px] font-bold uppercase text-[var(--color-text-dim)] tracking-widest">
                        Exibindo {assets.length} registros
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-dark-bg)] text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)] border-b border-[var(--color-border)]">
                                <th className="px-6 py-4">Ativo</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Ano</th>
                                <th className="px-6 py-4">Views</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {assets.length > 0 ? (
                                assets.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-[var(--color-surface)] overflow-hidden hidden sm:block">
                                                    <img src={asset.main_image} alt={asset.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold uppercase tracking-tight text-white group-hover:text-[var(--color-industrial-orange)] transition-colors">
                                                        {asset.name}
                                                    </span>
                                                    <span className="text-[10px] text-[var(--color-text-dim)]">Ref: {asset.serial_number}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dim)]">{asset.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={asset.status === 'AVAILABLE' ? 'success' : asset.status === 'SOLD' ? 'error' : 'warning'}>
                                                {asset.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono">{asset.year}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-xs text-[var(--color-text-dim)] font-bold">
                                                <Eye size={12} className="mr-1" /> {asset.view_count}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => navigate(`/ativos/${asset.slug}`)} className="p-2 hover:bg-white/10 text-[var(--color-text-dim)] title='Ver Público'">
                                                    <ExternalLink size={16} />
                                                </button>
                                                <button onClick={() => navigate(`/admin/edit/${asset.id}`)} className="p-2 hover:bg-[var(--color-industrial-orange)]/20 text-[var(--color-industrial-orange)]" title='Editar'>
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if (window.confirm('Excluir este ativo definitivamente?')) {
                                                            useAssetStore.getState().deleteAsset(asset.id);
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-[var(--color-error)]/20 text-[var(--color-error)]" 
                                                    title='Excluir'
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                         <p className="text-[var(--color-text-dim)] uppercase font-black tracking-widest italic">Nenhum ativo cadastrado até o momento.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Industrial Texture at bottom */}
            <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,var(--color-industrial-orange),var(--color-industrial-orange)_20px,transparent_20px,transparent_40px)] opacity-10"></div>
        </div>
    );
};
