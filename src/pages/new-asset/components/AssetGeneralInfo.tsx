import React from "react";
import { Settings } from "lucide-react";
import type { Asset } from "../../../schemas/entities";
import { TextField } from "../../../components/ui/TextField";
import { useCategoryStore } from "../../../stores/useCategoryStore";
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
  const { categories } = useCategoryStore();
  return (
    <div className={style.card}>
      <h3 className={style.cardTitle}>
        <Settings size={14} className={style.cardIcon} /> Informações Gerais
      </h3>

      <div className={style.inputGrid}>
        <div className="md:col-span-2">
          <TextField
            label="Nome do Equipamento / Título"
            name="name"
            required
            value={formData.name || ""}
            onChange={onChange}
            fullWidth
          />
        </div>

        <div className={style.inputGroup}>
          <label className={style.label}>Categoria</label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className={style.selectInput}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={style.inputGroup}>
          <TextField
            label="Subcategoria"
            name="subcategory"
            value={formData.subcategory || ""}
            onChange={onChange}
            placeholder="Ex: 6x4, Basculante, etc."
            fullWidth
          />
        </div>

        <div className={style.inputGroup}>
          <TextField
            label="Marca / Fabricante"
            name="brand"
            value={formData.brand || ""}
            onChange={onChange}
            fullWidth
          />
        </div>

        <div className={style.inputGroup}>
          <TextField
            label="Modelo"
            name="model"
            value={formData.model || ""}
            onChange={onChange}
            fullWidth
          />
        </div>

        <div className={style.inputGroup}>
          <TextField
            label="Ano de Fabricação"
            type="number"
            name="year"
            value={formData.year || ""}
            onChange={onChange}
            fullWidth
          />
        </div>

        <div className={style.inputGroup}>
          <TextField
            label="Nº de Série / Patrimônio"
            name="serial_number"
            value={formData.serial_number || ""}
            onChange={onChange}
            fullWidth
          />
        </div>

        <div className="md:col-span-2">
          <TextField
            label="Localização (Cidade / Estado)"
            name="location"
            required
            value={formData.location || ""}
            onChange={onChange}
            placeholder="Ex: Timóteo, MG"
            fullWidth
          />
        </div>
      </div>

      <div className="w-full">
        <TextField
          label="Descrição Detalhada"
          name="description"
          multiline
          rows={5}
          value={formData.description || ""}
          onChange={onChange}
          fullWidth
        />
      </div>
    </div>
  );
};

