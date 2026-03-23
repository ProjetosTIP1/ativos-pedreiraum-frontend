import React from "react";
import { Clock, Gauge } from "lucide-react";
import type { Asset } from "../../../schemas/entities";
import style from "../AssetDetails.module.css";

interface AssetSpecsProps {
  asset: Asset;
}

/**
 * Asset specifications grid component
 * Displays brand, model, and category-specific specs (hours/mileage)
 */
export const AssetSpecs: React.FC<AssetSpecsProps> = ({ asset }) => {
  // Determine specs based on category
  const isVehicle = asset.category === "CAMINHÕES";
  const isMachine = [
    "ESCAVADEIRAS",
    "BRITADORES",
    "MOTONIVELADORAS",
    "PLANT",
  ].includes(asset.category);

  return (
    <div className={style.specsGrid}>
      <div className={style.specItem}>
        <label className={style.specLabel}>Fabricante</label>
        <span className={style.specValue}>{asset.brand}</span>
      </div>
      <div className={style.specItem}>
        <label className={style.specLabel}>Modelo</label>
        <span className={style.specValue}>{asset.model}</span>
      </div>
      {isMachine && !!asset.specifications?.hours && (
        <div className={style.specItem}>
          <label className={style.specLabel}>Horas de Uso</label>
          <span className={style.specValue}>
            <Clock size={14} className={style.specIcon} />{" "}
            {asset.specifications.hours as React.ReactNode}h
          </span>
        </div>
      )}
      {isVehicle && !!asset.specifications?.mileage && (
        <div className={style.specItem}>
          <label className={style.specLabel}>Quilometragem</label>
          <span className={style.specValue}>
            <Gauge size={14} className={style.specIcon} />{" "}
            {(asset.specifications.mileage as number).toLocaleString()} KM
          </span>
        </div>
      )}
    </div>
  );
};
