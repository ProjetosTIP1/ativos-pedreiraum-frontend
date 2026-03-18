import React from "react";
import { Calendar, MapPin } from "lucide-react";
import type { Asset } from "../../../schemas/entities";
import style from "../AssetDetails.module.css";

interface AssetInfoHeaderProps {
  asset: Asset;
}

/**
 * Asset information header component
 * Displays category, title, and metadata (year, location, serial)
 */
export const AssetInfoHeader: React.FC<AssetInfoHeaderProps> = ({ asset }) => {
  return (
    <div className={style.infoHeader}>
      <span className={style.categoryBreadcrumb}>
        {asset.category} / {asset.subcategory}
      </span>
      <h1 className={style.assetTitle}>{asset.name}</h1>
      <div className={style.metaBar}>
        <span className={style.metaItem}>
          <Calendar size={14} className={style.metaIcon} /> {asset.year}
        </span>
        <span className={style.metaItem}>
          <MapPin size={14} className={style.metaIcon} /> {asset.location}
        </span>
        <span className={style.metaSeparator}>|</span>
        <span>Ref: {asset.serial_number}</span>
      </div>
    </div>
  );
};
