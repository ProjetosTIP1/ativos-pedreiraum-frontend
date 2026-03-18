import React from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import style from "../AssetForm.module.css";

interface AssetFormHeaderProps {
  isEdit: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Header component for Asset form
 * Displays title, back button, and action buttons (Cancel/Save)
 */
export const AssetFormHeader: React.FC<AssetFormHeaderProps> = ({
  isEdit,
  isSubmitting,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className={style.header}>
      <div className={style.headerLeft}>
        <button onClick={onCancel} className={style.backButton}>
          <ArrowLeft size={24} />
        </button>
        <h1 className={style.title}>
          {isEdit ? "Editar" : "Cadastrar"}{" "}
          <span className={style.highlight}>Ativo</span>
        </h1>
      </div>
      <div className={style.headerActions}>
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            "Enviando..."
          ) : (
            <>
              <Save size={18} /> Salvar Registro
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
