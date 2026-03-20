import React from "react";
import { Package } from "lucide-react";
import { AssetCondition, AssetStatus } from "../../../schemas/entities";
import type { Asset } from "../../../schemas/entities";
import style from "../AssetForm.module.css";

interface AssetStatusPanelProps {
  formData: Partial<Asset>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

/**
 * Status panel component for operational status and featured flag
 * Displays condition, catalog status, and featured checkbox
 */
export const AssetStatusPanel: React.FC<AssetStatusPanelProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className={style.card}>
      <h3 className={style.cardTitle}>
        <Package size={14} className={style.cardIcon} /> Status Operacional
      </h3>

      <div className="flex flex-col gap-6">
        <div className={style.inputGroup}>
          <label className={style.label}>Estado de Conservação</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={onChange}
            className={style.input}
          >
            {AssetCondition.options.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        <div className={style.inputGroup}>
          <label className={style.label}>Status do Catálogo</label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className={style.input}
          >
            {AssetStatus.options.map((stat) => (
              <option key={stat} value={stat}>
                {stat}
              </option>
            ))}
          </select>
        </div>

        <div className={style.checkboxWrapper}>
          <input
            type="checkbox"
            name="highlighted"
            id="highlighted"
            checked={formData.highlighted}
            onChange={onChange}
            className={style.checkbox}
          />
          <label htmlFor="highlighted" className={style.checkboxLabel}>
            Destacar Ativo na Home
          </label>
        </div>
      </div>
    </div>
  );
};

