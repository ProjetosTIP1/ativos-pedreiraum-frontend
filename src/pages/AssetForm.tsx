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
import style from './AssetForm.module.css';

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
        <div className={style.container}>
            {/* Header */}
            <div className={style.header}>
                <div className={style.headerLeft}>
                    <button onClick={() => navigate('/admin')} className={style.backButton}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className={style.title}>
                        {id ? 'Editar' : 'Cadastrar'} <span className={style.highlight}>Ativo</span>
                    </h1>
                </div>
                <div className={style.headerActions}>
                    <Button variant="ghost" onClick={() => navigate('/admin')}>Cancelar</Button>
                    <Button onClick={handleSubmit} className="flex items-center gap-2">
                        <Save size={18} /> Salvar Registro
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className={style.formGrid}>
                {/* Left Column: Main Info */}
                <div className={style.mainColumn}>
                    <div className={style.card}>
                        <h3 className={style.cardTitle}>
                            <Settings size={14} className={style.cardIcon} /> Informações Gerais
                        </h3>
                        
                        <div className={style.inputGrid}>
                            <div className={style.inputGroupFull}>
                                <label className={style.label}>Nome do Equipamento / Título</label>
                                <input 
                                    name="name" 
                                    required 
                                    value={formData.name} 
                                    onChange={handleChange}
                                    className={style.input}
                                />
                            </div>

                            <div className={style.inputGroup}>
                                <label className={style.label}>Categoria</label>
                                <select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange}
                                    className={style.input}
                                >
                                    {AssetCategory.options.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={style.inputGroup}>
                                <label className={style.label}>Subcategoria</label>
                                <input 
                                    name="subcategory" 
                                    value={formData.subcategory} 
                                    onChange={handleChange}
                                    className={style.input}
                                    placeholder="Ex: 6x4, Basculante, etc."
                                />
                            </div>

                            <div className={style.inputGroup}>
                                <label className={style.label}>Marca / Fabricante</label>
                                <input 
                                    name="brand" 
                                    value={formData.brand} 
                                    onChange={handleChange}
                                    className={style.input}
                                />
                            </div>

                            <div className={style.inputGroup}>
                                <label className={style.label}>Modelo</label>
                                <input 
                                    name="model" 
                                    value={formData.model} 
                                    onChange={handleChange}
                                    className={style.input}
                                />
                            </div>

                            <div className={style.inputGroup}>
                                <label className={style.label}>Ano de Fabricação</label>
                                <input 
                                    type="number" 
                                    name="year" 
                                    value={formData.year} 
                                    onChange={handleChange}
                                    className={style.input}
                                />
                            </div>

                            <div className={style.inputGroup}>
                                <label className={style.label}>Nº de Série / Patrimônio</label>
                                <input 
                                    name="serial_number" 
                                    value={formData.serial_number} 
                                    onChange={handleChange}
                                    className={style.input}
                                />
                            </div>
                        </div>

                        <div className={style.inputGroupFull}>
                            <label className={style.label}>Descrição Detalhada</label>
                            <textarea 
                                name="description" 
                                rows={5}
                                value={formData.description} 
                                onChange={handleChange}
                                className={`${style.input} ${style.textarea}`}
                            ></textarea>
                        </div>
                    </div>

                    <div className={style.card}>
                         <h3 className={style.cardTitle}>
                            <Camera size={14} className={style.cardIcon} /> Galeria de Imagens
                        </h3>
                        <div className={style.imageGrid}>
                            {formData.gallery?.map((url, index) => (
                                <div key={index} className={style.imageItem}>
                                    <img src={url} alt={`Asset ${index}`} className={style.image} />
                                    {url === formData.main_image && (
                                        <div className={style.imageBadge}>Principal</div>
                                    )}
                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveImage(url)}
                                        className={style.removeImageButton}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            <label className={style.addImageButton}>
                                <Plus size={24} className={style.addImageIcon} />
                                <span className={style.addImageText}>Adicionar</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <p className={style.helpText}>
                            <AlertCircle size={10} className="mr-1" /> A primeira imagem da galeria será definida como principal automaticamente se nenhuma existir.
                        </p>
                    </div>
                </div>

                {/* Right Column: Status & Price */}
                <div className={style.sideColumn}>
                    <div className={style.card}>
                        <h3 className={style.cardTitle}>
                            <Package size={14} className={style.cardIcon} /> Status Operacional
                        </h3>

                        <div className="flex flex-col gap-4">
                            <div className={style.inputGroup}>
                                <label className={style.label}>Estado de Conservação</label>
                                <select 
                                    name="condition" 
                                    value={formData.condition} 
                                    onChange={handleChange}
                                    className={style.input}
                                >
                                    {AssetCondition.options.map(cond => (
                                        <option key={cond} value={cond}>{cond}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={style.inputGroup}>
                                <label className={style.label}>Status do Catálogo</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleChange}
                                    className={style.input}
                                >
                                    {AssetStatus.options.map(stat => (
                                        <option key={stat} value={stat}>{stat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={style.checkboxWrapper}>
                                <input 
                                    type="checkbox" 
                                    name="is_featured" 
                                    id="is_featured" 
                                    checked={formData.is_featured} 
                                    onChange={handleChange}
                                    className={style.checkbox}
                                />
                                <label htmlFor="is_featured" className={style.checkboxLabel}>Destacar Ativo na Home</label>
                            </div>
                        </div>
                    </div>

                    <div className={style.commercialCard}>
                        <h3 className={style.cardTitle}>Comercial</h3>
                        <div className={style.inputGroup}>
                            <label className={style.commercialLabel}>Preço de Venda (R$)</label>
                            <input 
                                type="number" 
                                name="price" 
                                value={formData.price || ''} 
                                onChange={handlePriceChange}
                                className={style.commercialInput}
                                placeholder="0,00"
                            />
                            <div className="mt-2">
                                <p className={style.commercialHelp}>
                                    Deixe em branco para "Consultar"
                                </p>
                            </div>
                        </div>
                    </div>

                    {id && (
                        <div className={style.dangerZone}>
                            <p className={style.dangerZoneTitle}>Zona de Perigo</p>
                            <button 
                                type="button" 
                                onClick={handleDelete}
                                className={style.deleteButton}
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
