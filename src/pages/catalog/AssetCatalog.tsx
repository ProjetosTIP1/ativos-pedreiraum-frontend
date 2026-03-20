import React from "react";
import { useAssetStore } from "../../stores/useAssetStore";
import { AssetCard } from "../../components/assets/AssetCard";
import { AssetFilters } from "../../components/assets/AssetFilters";
import style from "./AssetCatalog.module.css";

export const AssetCatalog: React.FC = () => {
  const assets = useAssetStore((state) => state.assets);
  const isLoading = useAssetStore((state) => state.isLoading);

  return (
    <div className={style.container}>
      <h1 className={style.title}>
        Catálogo de <span className={style.highlight}>Ativos</span>
      </h1>

      <div className={style.content}>
        <AssetFilters />

        <div className={style.mainContent}>
          {isLoading ? (
            <div className={style.assetsGrid}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={style.skeletonCard}></div>
              ))}
            </div>
          ) : assets.length === 0 ? (
            <div className={style.emptyState}>
              <p className={style.emptyStateText}>
                Nenhum ativo encontrado com estes filtros.
              </p>
              <button
                onClick={() => useAssetStore.getState().clearFilters()}
                className={style.clearFiltersButton}
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            <div className={style.assetsGrid}>
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
