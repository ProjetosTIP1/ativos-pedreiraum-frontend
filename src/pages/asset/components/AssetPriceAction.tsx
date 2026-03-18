import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import type { Asset } from "../../../schemas/entities";
import style from "../AssetDetails.module.css";

interface AssetPriceActionProps {
  asset: Asset;
  onContact: () => void;
}

/**
 * Price display and contact action component
 * Shows suggested price and WhatsApp contact button
 */
export const AssetPriceAction: React.FC<AssetPriceActionProps> = ({
  asset,
  onContact,
}) => {
  return (
    <div className={style.priceActionBox}>
      <div className={style.priceWrapper}>
        <span className={style.priceLabel}>Preço Sugerido</span>
        <span className={style.priceValue}>
          {asset.price
            ? `R$ ${asset.price.toLocaleString("pt-BR")}`
            : "Consultar Valor"}
        </span>
      </div>
      <Button
        onClick={onContact}
        fullWidth
        size="lg"
        className="flex items-center justify-center gap-3 italic"
      >
        <MessageCircle size={24} />
        Tenho Interesse — Chamar no WhatsApp
      </Button>
    </div>
  );
};
