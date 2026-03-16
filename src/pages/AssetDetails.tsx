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
import style from './AssetDetails.module.css';

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
            <div className={style.loadingContainer}>
                <div className={style.loadingBreadcrumb}></div>
                <div className={style.mainGrid}>
                    <div className={style.loadingGallery}></div>
                    <div className={style.loadingInfo}>
                        <div className={style.loadingTitle}></div>
                        <div className={style.loadingDescription}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !currentAsset) {
        return (
            <div className={style.errorState}>
                <h2 className={style.errorTitle}>Ativo não encontrado</h2>
                <p className={style.errorText}>{error || "O equipamento que você procura não está disponível."}</p>
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
        <div className={style.container}>
            {/* Breadcrumb / Back */}
            <button 
                onClick={() => navigate('/ativos')}
                className={style.backButton}
            >
                <ArrowLeft size={14} className="mr-2" /> Voltar ao Catálogo
            </button>

            <div className={style.mainGrid}>
                {/* Gallery Section */}
                <div className={style.galleryWrapper}>
                    <div className={style.mainImageWrapper}>
                        <img 
                            src={currentAsset.gallery[activeImage] || currentAsset.main_image} 
                            alt={currentAsset.name}
                            className={style.mainImage}
                        />
                        <div className={style.badgesWrapper}>
                             <Badge variant="orange">{currentAsset.condition}</Badge>
                             <Badge variant="default">{currentAsset.status}</Badge>
                        </div>
                        
                        {currentAsset.gallery.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    className={`${style.galleryNav} ${style.galleryNavPrev}`}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className={`${style.galleryNav} ${style.galleryNavNext}`}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                        <div className={style.zoomIndicator}>
                            <ZoomIn size={20} />
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className={style.thumbnailsGrid}>
                        {currentAsset.gallery.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`${style.thumbnailButton} ${activeImage === idx ? style.thumbnailButtonActive : style.thumbnailButtonInactive}`}
                            >
                                <img src={img} alt={`${currentAsset.name} thumb ${idx}`} className={style.thumbnailImage} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className={style.infoWrapper}>
                    <div className={style.infoHeader}>
                        <span className={style.categoryBreadcrumb}>
                            {currentAsset.category} / {currentAsset.subcategory}
                        </span>
                        <h1 className={style.assetTitle}>
                            {currentAsset.name}
                        </h1>
                        <div className={style.metaBar}>
                            <span className={style.metaItem}><Calendar size={14} className={style.metaIcon} /> {currentAsset.year}</span>
                            <span className={style.metaItem}><MapPin size={14} className={style.metaIcon} /> {currentAsset.location}</span>
                            <span className={style.metaSeparator}>|</span>
                            <span>Ref: {currentAsset.serial_number}</span>
                        </div>
                    </div>

                    {/* Price and Action */}
                    <div className={style.priceActionBox}>
                        <div className={style.priceWrapper}>
                            <span className={style.priceLabel}>Preço Sugerido</span>
                            <span className={style.priceValue}>
                                {currentAsset.price ? `R$ ${currentAsset.price.toLocaleString('pt-BR')}` : "Consultar Valor"}
                            </span>
                        </div>
                        <Button onClick={handleWhatsAppClick} fullWidth size="lg" className="flex items-center justify-center gap-3 italic">
                            <MessageCircle size={24} />
                            Tenho Interesse — Chamar no WhatsApp
                        </Button>
                    </div>

                    {/* Specifications Grid */}
                    <div className={style.specsGrid}>
                        <div className={style.specItem}>
                            <label className={style.specLabel}>Fabricante</label>
                            <span className={style.specValue}>{currentAsset.brand}</span>
                        </div>
                        <div className={style.specItem}>
                            <label className={style.specLabel}>Modelo</label>
                            <span className={style.specValue}>{currentAsset.model}</span>
                        </div>
                        {isMachine && currentAsset.specifications?.hours && (
                             <div className={style.specItem}>
                                <label className={style.specLabel}>Horas de Uso</label>
                                <span className={style.specValue}>
                                    <Clock size={14} className={style.specIcon} /> {currentAsset.specifications.hours}h
                                </span>
                            </div>
                        )}
                        {isVehicle && currentAsset.specifications?.mileage && (
                             <div className={style.specItem}>
                                <label className={style.specLabel}>Quilometragem</label>
                                <span className={style.specValue}>
                                    <Gauge size={14} className={style.specIcon} /> {currentAsset.specifications.mileage.toLocaleString()} KM
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className={style.descriptionLabel}>Descrição & Observações</label>
                        <p className={style.descriptionText}>
                            {currentAsset.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Industrial Decorator */}
            <div className={style.bottomDecorator}>
                <div className={style.decoratorLine}></div>
                <p className={style.decoratorText}>
                    QUALIDADE <span className={style.decoratorBullet}>●</span> PERFORMANCE <span className={style.decoratorBullet}>●</span> CONFIANÇA
                </p>
            </div>
        </div>
    );
};
