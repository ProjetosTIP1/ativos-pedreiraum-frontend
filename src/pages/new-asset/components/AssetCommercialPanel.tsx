import React from "react";
import type { Asset } from "../../../schemas/entities";
import style from "../AssetForm.module.css";

interface AssetCommercialPanelProps {
  formData: Partial<Asset>;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Commercial panel component for pricing information
 * Simple focused component for sale price input
 */
export const AssetCommercialPanel: React.FC<AssetCommercialPanelProps> = ({
  formData,
  onPriceChange,
}) => {
  return (
    <div className={style.commercialCard}>
      <h3 className={style.commercialLabel}>Valor de Venda</h3>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-800 opacity-70">R$</span>
        <input
          type="number"
          name="price"
          value={formData.price || ""}
          onChange={onPriceChange}
          className={style.commercialInput}
          placeholder="0,00"
        />
      </div>
      <p className={style.commercialHelp}>O valor será exibido no catálogo público.</p>
    </div>
  );
};

