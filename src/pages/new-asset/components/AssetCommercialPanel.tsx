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
      <h3 className={style.cardTitle}>Comercial</h3>
      <div className={style.inputGroup}>
        <label className={style.commercialLabel}>Preço de Venda (R$)</label>
        <input
          type="number"
          name="price"
          value={formData.price || ""}
          onChange={onPriceChange}
          className={style.commercialInput}
          placeholder="0,00"
        />
      </div>
    </div>
  );
};
