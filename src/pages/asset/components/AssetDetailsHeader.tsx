import React from "react";
import { ArrowLeft } from "lucide-react";
import style from "../AssetDetails.module.css";

interface AssetDetailsHeaderProps {
  onBack: () => void;
}

/**
 * Header component with back navigation
 * Simple focused component for breadcrumb/navigation
 */
export const AssetDetailsHeader: React.FC<AssetDetailsHeaderProps> = ({
  onBack,
}) => {
  return (
    <button onClick={onBack} className={style.backButton}>
      <ArrowLeft size={14} className="mr-2" /> Voltar ao Catálogo
    </button>
  );
};
