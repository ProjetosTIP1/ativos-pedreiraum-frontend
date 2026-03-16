import React, { useEffect } from 'react';
import { useAssetStore } from '../stores/useAssetStore';
import { AssetCard } from '../components/assets/AssetCard';
import { AssetFilters } from '../components/assets/AssetFilters';

export const AssetCatalog: React.FC = () => {
    const assets = useAssetStore((state) => state.assets);
    const isLoading = useAssetStore((state) => state.isLoading);
    const fetchAssets = useAssetStore((state) => state.fetchAssets);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                Catálogo de <span className="text-[var(--color-industrial-orange)]">Ativos</span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-10">
                <AssetFilters />

                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-[4/5] bg-[var(--color-surface)] animate-pulse border border-[var(--color-border)]"></div>
                            ))}
                        </div>
                    ) : assets.length === 0 ? (
                        <div className="text-center py-20 bg-[var(--color-surface)] border border-[var(--color-border)] flex flex-col items-center">
                            <p className="text-[var(--color-text-dim)] uppercase font-black tracking-widest">Nenhum ativo encontrado com estes filtros.</p>
                            <button 
                                onClick={() => useAssetStore.getState().clearFilters()}
                                className="mt-4 text-[var(--color-industrial-orange)] font-black uppercase text-xs hover:underline"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {assets.map((asset) => (
                                <AssetCard key={asset.id} asset={asset} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
