import React from "react";
import { Trash2 } from "lucide-react";
import style from "../AssetForm.module.css";

interface AssetDangerZoneProps {
  onDelete: () => void;
}

/**
 * Danger zone component for destructive actions
 * Only displayed in edit mode to allow permanent asset deletion
 */
export const AssetDangerZone: React.FC<AssetDangerZoneProps> = ({
  onDelete,
}) => {
  return (
    <div className={style.dangerZone}>
      <p className={style.dangerZoneTitle}>Zona de Perigo</p>
      <button type="button" onClick={onDelete} className={style.deleteButton}>
        <Trash2 size={16} /> Excluir Registro Permanente
      </button>
    </div>
  );
};
