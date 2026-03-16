import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssetStore } from '../stores/useAssetStore';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
    Calendar, 
    MapPin, 
    Gauge, 
    Clock, 
    MessageCircle, 
    ArrowLeft, 
    ChevronLeft, 
    ChevronRight,
    ZoomIn
} from 'lucide-react';

export const AssetDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { currentAsset, fetchAssetBySlug, isLoading, error } = useAssetStore();
    const [activeImage, setActiveImage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            fetchAssetBySlug(slug);
        }
    }, [slug, fetchAssetBySlug]);

    if (isLoading && !currentAsset) {
        return (
            <div className="flex flex-col gap-8 animate-pulse">
                <div className="h-10 w-1/3 bg-[var(--color-surface)]"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="h-[500px] bg-[var(--color-surface)]"></div>
                    <div className="space-y-6">
                        <div className="h-12 w-full bg-[var(--color-surface)]"></div>
                        <div className="h-40 w-full bg-[var(--color-surface)]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !currentAsset) {
        return (
            <div className="text-center py-20 px-4 bg-[var(--color-dark-card)] border border-[var(--color-border)]">
                <h2 className="text-2xl font-black uppercase mb-4">Ativo não encontrado</h2>
                <p className="text-[var(--color-text-dim)] mb-8">{error || "O equipamento que você procura não está disponível."}</p>
                <Button onClick={() => navigate('/ativos')}>Voltar para o Catálogo</Button>
            </div>
        );
    }

    const whatsappNumber = "55319XXXXXXXX"; // This should come from a config/store
    const currentUrl = window.location.href;
    const whatsappMessage = `Olá! Tenho interesse no seguinte equipamento do catálogo Valemix Ativos:

📋 *${currentAsset.name}*
🏷️ Categoria: ${currentAsset.category}
🏭 Marca/Modelo: ${currentAsset.brand} ${currentAsset.model}
📅 Ano: ${currentAsset.year}
🔗 Link: ${currentUrl}

Poderia me passar mais informações sobre disponibilidade e valor?`;

    const handleWhatsAppClick = () => {
        const encodedMessage = encodeURIComponent(whatsappMessage);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    };

    const nextImage = () => {
        if (currentAsset.gallery.length > 0) {
            setActiveImage((prev) => (prev + 1) % currentAsset.gallery.length);
        }
    };

    const prevImage = () => {
        if (currentAsset.gallery.length > 0) {
            setActiveImage((prev) => (prev - 1 + currentAsset.gallery.length) % currentAsset.gallery.length);
        }
    };

    // Determine specs based on category
    const isVehicle = currentAsset.category === "TRUCKS";
    const isMachine = ["EXCAVATORS", "CRUSHERS", "GRADERS", "PLANT"].includes(currentAsset.category);

    return (
        <div className="flex flex-col gap-10">
            {/* Breadcrumb / Back */}
            <button 
                onClick={() => navigate('/ativos')}
                className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-dim)] hover:text-[var(--color-industrial-orange)] transition-colors"
            >
                <ArrowLeft size={14} className="mr-2" /> Voltar ao Catálogo
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Gallery Section */}
                <div className="flex flex-col gap-4">
                    <div className="relative h-[450px] bg-[var(--color-surface)] border border-[var(--color-border)] group overflow-hidden">
                        <img 
                            src={currentAsset.gallery[activeImage] || currentAsset.main_image} 
                            alt={currentAsset.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                             <Badge variant="orange">{currentAsset.condition}</Badge>
                             <Badge variant="default">{currentAsset.status}</Badge>
                        </div>
                        
                        {currentAsset.gallery.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white flex items-center justify-center hover:bg-[var(--color-industrial-orange)] transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white flex items-center justify-center hover:bg-[var(--color-industrial-orange)] transition-colors"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                        <div className="absolute bottom-4 right-4 bg-black/50 p-2 text-white/50">
                            <ZoomIn size={20} />
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-5 gap-2">
                        {currentAsset.gallery.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`h-20 border-2 transition-all ${activeImage === idx ? 'border-[var(--color-industrial-orange)] opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                            >
                                <img src={img} alt={`${currentAsset.name} thumb ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-industrial-orange)]">
                            {currentAsset.category} / {currentAsset.subcategory}
                        </span>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4 leading-tight">
                            {currentAsset.name}
                        </h1>
                        <div className="flex items-center gap-6 text-[var(--color-text-dim)] text-xs font-bold uppercase tracking-widest border-y border-[var(--color-border)] py-4">
                            <span className="flex items-center"><Calendar size={14} className="mr-2 text-[var(--color-industrial-orange)]" /> {currentAsset.year}</span>
                            <span className="flex items-center"><MapPin size={14} className="mr-2 text-[var(--color-industrial-orange)]" /> {currentAsset.location}</span>
                            <span className="text-[var(--color-border)]">|</span>
                            <span>Ref: {currentAsset.serial_number}</span>
                        </div>
                    </div>

                    {/* Price and Action */}
                    <div className="bg-[var(--color-surface)] p-8 border-l-4 border-[var(--color-industrial-orange)] mb-8">
                        <div className="flex flex-col mb-6">
                            <span className="text-[10px] uppercase font-black text-[var(--color-text-dim)] tracking-[0.2em] mb-1">Preço Sugerido</span>
                            <span className="text-4xl font-black italic">
                                {currentAsset.price ? `R$ ${currentAsset.price.toLocaleString('pt-BR')}` : "Consultar Valor"}
                            </span>
                        </div>
                        <Button onClick={handleWhatsAppClick} fullWidth size="lg" className="flex items-center justify-center gap-3 italic">
                            <MessageCircle size={24} />
                            Tenho Interesse — Chamar no WhatsApp
                        </Button>
                    </div>

                    {/* Specifications Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="text-[10px] uppercase font-black text-[var(--color-text-dim)] tracking-[0.2em] mb-2 block">Fabricante</label>
                            <span className="text-sm font-bold uppercase tracking-widest">{currentAsset.brand}</span>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-black text-[var(--color-text-dim)] tracking-[0.2em] mb-2 block">Modelo</label>
                            <span className="text-sm font-bold uppercase tracking-widest">{currentAsset.model}</span>
                        </div>
                        {isMachine && currentAsset.specifications?.hours && (
                             <div>
                                <label className="text-[10px] uppercase font-black text-[var(--color-text-dim)] tracking-[0.2em] mb-2 block">Horas de Uso</label>
                                <span className="text-sm font-bold uppercase tracking-widest flex items-center">
                                    <Clock size={14} className="mr-2" /> {currentAsset.specifications.hours}h
                                </span>
                            </div>
                        )}
                        {isVehicle && currentAsset.specifications?.mileage && (
                             <div>
                                <label className="text-[10px] uppercase font-black text-[var(--color-text-dim)] tracking-[0.2em] mb-2 block">Quilometragem</label>
                                <span className="text-sm font-bold uppercase tracking-widest flex items-center">
                                    <Gauge size={14} className="mr-2" /> {currentAsset.specifications.mileage.toLocaleString()} KM
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[10px] uppercase font-black text-[var(--color-text-dim)] tracking-[0.2em] mb-4 block border-b border-[var(--color-border)] pb-2 italic">Descrição & Observações</label>
                        <p className="text-[var(--color-text-main)] text-sm leading-relaxed whitespace-pre-line">
                            {currentAsset.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Industrial Decorator */}
            <div className="mt-12 h-20 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-2 bg-[var(--color-industrial-orange)]"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--color-border)] flex items-center gap-4">
                    QUALIDADE <span className="text-[var(--color-industrial-orange)]">●</span> PERFORMANCE <span className="text-[var(--color-industrial-orange)]">●</span> CONFIANÇA
                </p>
            </div>
        </div>
    );
};
