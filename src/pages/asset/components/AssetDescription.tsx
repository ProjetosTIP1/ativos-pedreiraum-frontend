import React from "react";
import style from "../AssetDetails.module.css";

interface AssetDescriptionProps {
  description?: string;
}

/**
 * Asset description component
 * Displays detailed description and observations
 */
export const AssetDescription: React.FC<AssetDescriptionProps> = ({
  description,
}) => {
  return (
    <div>
      <label className={style.descriptionLabel}>Descrição & Observações</label>
      <p className={style.descriptionText}>{description}</p>
    </div>
  );
};
