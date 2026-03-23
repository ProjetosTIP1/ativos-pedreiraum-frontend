import React from "react";
import { type Asset } from "../../schemas/entities";
import { useAssetImages } from "../../hooks/useAssetImages";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { AssetImage } from "../ui/AssetImage";
import { Eye, MapPin, Calendar, Clock, Gauge } from "lucide-react";
import { Link } from "react-router-dom";
import style from "./AssetCard.module.css";

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const { mainImage } = useAssetImages(asset.id, asset.images_metadata ?? []);

  const isMachine = [
    "ESCAVADEIRAS",
    "BRITADORES",
    "MOTONIVELADORAS",
    "PÁS CARREGADEIRAS",
  ].includes(asset.category);
  const isVehicle = ["CAMINHÕES"].includes(asset.category);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "EXCELENTE":
        return "success";
      case "BOM":
        return "info";
      case "REGULAR":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DISPONÍVEL":
        return "success";
      case "RESERVADO":
        return "warning";
      case "VENDIDO":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className={style.card}>
      {/* Image Container */}
      <div className={style.imageContainer}>
        <AssetImage
          src={mainImage?.url}
          alt={asset.name}
          className={style.image}
        />
        <div className={style.badgeContainer}>
          <Badge variant={getConditionColor(asset.condition)}>
            {asset.condition}
          </Badge>
          <Badge variant={getStatusColor(asset.status)}>{asset.status}</Badge>
        </div>
        {asset.highlighted && (
          <div className={style.featuredBadge}>DESTAQUE</div>
        )}
      </div>

      {/* Content */}
      <div className={style.content}>
        <div className={style.mainInfo}>
          <div className={style.categoryGroup}>
            <span className={style.category}>
              {asset.category} / {asset.subcategory}
            </span>
            <div className={style.views}>
              <Eye size={12} className="mr-1" />
              {asset.view_count}
            </div>
          </div>

          <h3 className={style.title}>{asset.name}</h3>
        </div>

        <div className={style.specsContainer}>
          <div className={style.specs}>
            <div className={style.specItem}>
              <Calendar size={14} className={style.specIcon} />
              {asset.year}
            </div>
            <div className={style.specItem}>
              <MapPin size={14} className={style.specIcon} />
              {asset.location}
            </div>
            {isMachine && !!asset.specifications?.hours && (
              <div className={style.specItem}>
                <Clock size={14} className={style.specIcon} />
                {asset.specifications.hours as React.ReactNode}h
              </div>
            )}
            {isVehicle && !!asset.specifications?.mileage && (
              <div className={style.specItem}>
                <Gauge size={14} className={style.specIcon} />
                {(asset.specifications.mileage as number).toLocaleString()} km
              </div>
            )}
          </div>
        </div>

        <div className={style.footer}>
          <div className={style.priceContainer}>
            <span className={style.priceLabel}>Preço</span>
            <span className={style.priceValue}>
              {asset.price
                ? `R$ ${asset.price.toLocaleString("pt-BR")}`
                : "Consultar"}
            </span>
          </div>
          <Link to={`/ativos/${asset.id}`} className="flex-shrink-0">
            <Button size="sm" variant="primary">
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
