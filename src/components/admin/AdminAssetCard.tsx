import React from "react";
import { type Asset } from "../../schemas/entities";
import { Badge } from "../ui/Badge";
import { AssetImage } from "../ui/AssetImage";
import { Eye, Edit, Trash2, ExternalLink, Calendar, Hash } from "lucide-react";
import style from "./AdminAssetCard.module.css";

interface AdminAssetCardProps {
  asset: Asset;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export const AdminAssetCard: React.FC<AdminAssetCardProps> = ({
  asset,
  onEdit,
  onDelete,
  onView,
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "DISPONÍVEL":
        return "success";
      case "VENDIDO":
        return "error";
      case "RESERVADO":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className={style.card}>
      {/* Visual Section */}
      <div className={style.imageSection}>
        <AssetImage
          src={asset.images_metadata?.[0]?.url}
          alt={asset.name}
          className={style.image}
        />
        <div className={style.statusOverlay}>
          <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
        </div>
      </div>

      {/* Main Info Section */}
      <div className={style.infoSection}>
        <div className={style.headerRow}>
          <div className={style.titleArea}>
            <span className={style.categoryLabel}>
              {asset.category} <span className={style.separator}>/</span>{" "}
              {asset.subcategory}
            </span>
            <h3 className={style.assetName}>{asset.name}</h3>
          </div>
          <div className={style.idBadge}>
            <Hash size={10} />
            {asset.serial_number}
          </div>
        </div>

        <div className={style.detailsGrid}>
          <div className={style.detailItem}>
            <Calendar size={14} className={style.detailIcon} />
            <span className={style.detailValue}>{asset.year}</span>
          </div>
          <div className={style.detailItem}>
            <Eye size={14} className={style.detailIcon} />
            <span className={style.detailValue}>{asset.view_count} views</span>
          </div>
          <div className={style.priceArea}>
            <span className={style.priceLabel}>Valor sugerido</span>
            <span className={style.priceValue}>
              {asset.price
                ? `R$ ${asset.price.toLocaleString("pt-BR")}`
                : "Consultar"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className={style.actionsSection}>
        <button
          onClick={() => onView(asset.id)}
          className={style.actionBtn}
          title="Ver Público"
        >
          <ExternalLink size={18} />
          <span className={style.btnText}>Ver</span>
        </button>
        <button
          onClick={() => onEdit(asset.id)}
          className={`${style.actionBtn} ${style.editBtn}`}
          title="Editar"
        >
          <Edit size={18} />
          <span className={style.btnText}>Editar</span>
        </button>
        <div className={style.divider}></div>
        <button
          onClick={() => onDelete(asset.id)}
          className={`${style.actionBtn} ${style.deleteBtn}`}
          title="Excluir"
        >
          <Trash2 size={18} />
          <span className={style.btnText}>Excluir</span>
        </button>
      </div>
    </div>
  );
};
