import React from "react";
import { Button } from "../../../components/ui/Button";
import style from "../AssetDetails.module.css";

/**
 * Loading state component with skeleton screens
 * Displays placeholder content while asset data is being fetched
 */
export const AssetLoadingState: React.FC = () => {
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
};

interface AssetErrorStateProps {
  error?: string;
  onBack: () => void;
}

/**
 * Error state component
 * Displays error message when asset is not found or fetch fails
 */
export const AssetErrorState: React.FC<AssetErrorStateProps> = ({
  error,
  onBack,
}) => {
  return (
    <div className={style.errorState}>
      <h2 className={style.errorTitle}>Ativo não encontrado</h2>
      <p className={style.errorText}>
        {error || "O equipamento que você procura não está disponível."}
      </p>
      <Button onClick={onBack}>Voltar para o Catálogo</Button>
    </div>
  );
};
