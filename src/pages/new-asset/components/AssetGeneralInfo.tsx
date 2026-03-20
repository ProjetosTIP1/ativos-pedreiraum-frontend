import React from "react";
import { Settings } from "lucide-react";
import { AssetCategory } from "../../../schemas/entities";
import type { Asset } from "../../../schemas/entities";
import style from "../AssetForm.module.css";

interface AssetGeneralInfoProps {
  formData: Partial<Asset>;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

/**
 * General information form section
 * Handles name, category, brand, model, year, serial number, and description
 */
export const AssetGeneralInfo: React.FC<AssetGeneralInfoProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className={style.card}>
      <h3 className={style.cardTitle}>
        <Settings size={14} className={style.cardIcon} /> Informações Gerais
      </h3>

      <div className={style.inputGrid}>
        <div className={style.inputGroupFull}>
          <label className={style.label}>Nome do Equipamento / Título</label>
          <input
            name="name"
            required
            value={formData.name}
            onChange={onChange}
            className={style.input}
          />
        </div>

        <div className={style.inputGroup}>
          <label className={style.label}>Categoria</label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className={style.input}
          >
            {AssetCategory.options.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={style.inputGroup}>
          <label className={style.label}>Subcategoria</label>
          <input
            name="subcategory"
            value={formData.subcategory}
            onChange={onChange}
            className={style.input}
            placeholder="Ex: 6x4, Basculante, etc."
          />
        </div>

        <div className={style.inputGroup}>
          <label className={style.label}>Marca / Fabricante</label>
          <input
            name="brand"
            value={formData.brand}
            onChange={onChange}
            className={style.input}
          />
        </div>

        <div className={style.inputGroup}>
          <label className={style.label}>Modelo</label>
          <input
            name="model"
            value={formData.model}
            onChange={onChange}
            className={style.input}
          />
        </div>

        <div className={style.inputGroup}>
          <label className={style.label}>Ano de Fabricação</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={onChange}
            className={style.input}
          />
        </div>

        <div className={style.inputGroup}>
          <label className={style.label}>Nº de Série / Patrimônio</label>
          <input
            name="serial_number"
            value={formData.serial_number}
            onChange={onChange}
            className={style.input}
          />
        </div>

        <div className={style.inputGroupFull}>
          <label className={style.label}>Localização (Cidade / Estado)</label>
          <input
            name="location"
            required
            value={formData.location}
            onChange={onChange}
            className={style.input}
            placeholder="Ex: Timóteo, MG"
          />
        </div>
      </div>

      <div className={style.inputGroupFull}>
        <label className={style.label}>Descrição Detalhada</label>
        <textarea
          name="description"
          rows={5}
          value={formData.description}
          onChange={onChange}
          className={`${style.input} ${style.textarea}`}
        ></textarea>
      </div>
    </div>
  );
};
