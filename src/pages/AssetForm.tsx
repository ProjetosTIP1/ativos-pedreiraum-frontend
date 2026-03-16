import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssetStore } from '../stores/useAssetStore';
import { Button } from '../components/ui/Button';
import imageService from '../server/imageService';
import { 
    Save, 
    ArrowLeft, 
    Camera, 
    Trash2, 
    AlertCircle,
    Settings,
    Package,
    Plus,
    X
} from 'lucide-react';
import { type Asset, AssetCategory, AssetCondition, AssetStatus } from '../schemas/entities';

export const AssetForm: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const { assets } = useAssetStore();
    
    const [formData, setFormData] = useState<Partial<Asset>>({
        name: '',
        category: "OTHER",
        subcategory: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        serial_number: '',
        location: '',
        condition: "GOOD",
        status: "PENDING",
        price: undefined,
        description: '',
        main_image: '',
        gallery: [],
        is_featured: false,
    });

    const initialized = React.useRef(false);

    useEffect(() => {
        if (id && assets.length > 0 && !initialized.current) {
            const assetToEdit = assets.find(a => a.id === id);
            if (assetToEdit) {
                // Use a microtask to avoid synchronous setState inside useEffect
                Promise.resolve().then(() => {
                    setFormData(prev => ({ ...prev, ...assetToEdit }));
                    initialized.current = true;
                });
            }
        }
    }, [id, assets]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value ? parseFloat(e.target.value) : undefined;
        setFormData(prev => ({ ...prev, price: val }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            const file = files[0];
            const { url } = await imageService.upload(file);
            
            setFormData(prev => ({
                ...prev,
                main_image: prev.main_image || url,
                gallery: [...(prev.gallery || []), url]
            }));
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    const handleRemoveImage = (url: string) => {
        setFormData(prev => ({
            ...prev,
            main_image: prev.main_image === url ? (prev.gallery?.find(img => img !== url) || '') : prev.main_image,
            gallery: prev.gallery?.filter(img => img !== url)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id) {
                await useAssetStore.getState().updateAsset(id, formData);
            } else {
                await useAssetStore.getState().createAsset(formData);
            }
            navigate('/admin');
        } catch (error) {
            console.error("Error saving asset:", error);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (window.confirm('Tem certeza que deseja excluir este ativo permanentemente?')) {
            try {
                await useAssetStore.getState().deleteAsset(id);
                navigate('/admin');
            } catch (error) {
                console.error("Error deleting asset:", error);
            }
        }
    };

    return (
        <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin')} className="p-2 hover:bg-white/10 text-[var(--color-text-dim)]">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                        {id ? 'Editar' : 'Cadastrar'} <span className="text-[var(--color-industrial-orange)]">Ativo</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => navigate('/admin')}>Cancelar</Button>
                    <Button onClick={handleSubmit} className="flex items-center gap-2">
                        <Save size={18} /> Salvar Registro
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-[var(--color-dark-card)] p-8 border border-[var(--color-border)] space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-industrial-orange)] mb-4 flex items-center">
                            <Settings size={14} className="mr-2" /> Informações Gerais
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">Nome do Equipamento / Título</label>
                                <input 
                                    name="name" 
                                    required 
                                    value={formData.name} 
                                    onChange={handleChange}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-industrial-orange)] outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">Categoria</label>
                                <select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-industrial-orange)] outline-none"
                                >
                                    {AssetCategory.options.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">Subcategoria</label>
                                <input 
                                    name="subcategory" 
                                    value={formData.subcategory} 
                                    onChange={handleChange}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-industrial-orange)] outline-none"
                                    placeholder="Ex: 6x4, Basculante, etc."
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">Marca / Fabricante</label>
                                <input 
                                    name="brand" 
                                    value={formData.brand} 
                                    onChange={handleChange}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-industrial-orange)] outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">Modelo</label>
                                <input 
                                    name="model" 
                                    value={formData.model} 
                                    onChange={handleChange}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-industrial-orange)] outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">Ano de Fabricação</label>
                                <input 
                                    type="number" 
                                    name="year" 
                                    value={formData.year} 
                                    onChange={handleChange}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-industrial-orange)] outline-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">Nº de Série / Patrimônio</label>
                                <input 
                                    name="serial_number" 
                                    value={formData.serial_number} 
                                    onChange={handleChange}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-industrial-orange)] outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">Descrição Detalhada</label>
                            <textarea 
                                name="description" 
                                rows={5}
                                value={formData.description} 
                                onChange={handleChange}
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-industrial-orange)] outline-none resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-[var(--color-dark-card)] p-8 border border-[var(--color-border)] space-y-6">
                         <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-industrial-orange)] mb-4 flex items-center">
                            <Camera size={14} className="mr-2" /> Galeria de Imagens
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.gallery?.map((url, index) => (
                                <div key={index} className="aspect-square bg-[var(--color-surface)] border border-[var(--color-border)] relative group overflow-hidden">
                                    <img src={url} alt={`Asset ${index}`} className="w-full h-full object-cover" />
                                    {url === formData.main_image && (
                                        <div className="absolute top-0 left-0 bg-[var(--color-industrial-orange)] text-black text-[8px] font-black uppercase px-2 py-0.5">Principal</div>
                                    )}
                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveImage(url)}
                                        className="absolute top-1 right-1 p-1 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-industrial-orange)] transition-colors">
                                <Plus size={24} className="text-[var(--color-text-dim)]" />
                                <span className="text-[8px] font-black uppercase tracking-widest mt-2">Adicionar</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <p className="text-[9px] text-[var(--color-text-dim)] uppercase font-bold tracking-widest italic flex items-center">
                            <AlertCircle size={10} className="mr-1" /> A primeira imagem da galeria será definida como principal automaticamente se nenhuma existir.
                        </p>
                    </div>
                </div>

                {/* Right Column: Status & Price */}
                <div className="space-y-8">
                    <div className="bg-[var(--color-dark-card)] p-8 border border-[var(--color-border)] space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-industrial-orange)] mb-4 flex items-center">
                            <Package size={14} className="mr-2" /> Status Operacional
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">Estado de Conservação</label>
                                <select 
                                    name="condition" 
                                    value={formData.condition} 
                                    onChange={handleChange}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-industrial-orange)] outline-none"
                                >
                                    {AssetCondition.options.map(cond => (
                                        <option key={cond} value={cond}>{cond}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dim)]">Status do Catálogo</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange}
                                    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] p-3 text-sm focus:border-[var(--color-industrial-orange)] outline-none"
                                >
                                    {AssetStatus.options.map(stat => (
                                        <option key={stat} value={stat}>{stat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-[var(--color-surface)] border border-[var(--color-border)]">
                                <input 
                                    type="checkbox" 
                                    name="is_featured" 
                                    id="is_featured" 
                                    checked={formData.is_featured} 
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-[var(--color-industrial-orange)]"
                                />
                                <label htmlFor="is_featured" className="text-xs font-black uppercase tracking-widest cursor-pointer">Destacar Ativo na Home</label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-surface)] p-8 border-l-4 border-[var(--color-industrial-orange)] space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-industrial-orange)] mb-4">Comercial</h3>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-white">Preço de Venda (R$)</label>
                            <input 
                                type="number" 
                                name="price" 
                                value={formData.price || ''} 
                                onChange={handlePriceChange}
                                className="w-full bg-black/20 border border-white/10 p-4 text-xl font-black italic focus:border-white outline-none"
                                placeholder="0,00"
                            />
                            <p className="text-[8px] text-black font-bold uppercase tracking-widest bg-[var(--color-industrial-orange)] px-2 py-0.5 mt-2 inline-block">
                                Deixe em branco para "Consultar"
                            </p>
                        </div>
                    </div>

                    {id && (
                        <div className="bg-[var(--color-error)]/5 p-6 border border-[var(--color-error)]/20 space-y-4">
                            <p className="text-[9px] font-bold text-[var(--color-error)] uppercase tracking-widest">Zona de Perigo</p>
                            <button 
                                type="button" 
                                onClick={handleDelete}
                                className="text-xs font-black text-[var(--color-error)] uppercase flex items-center gap-2 hover:opacity-80 transition-opacity"
                            >
                                <Trash2 size={16} /> Excluir Registro Permanente
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
