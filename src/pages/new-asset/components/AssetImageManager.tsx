import React, { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import Modal from "../../../components/modal/Modal";
import type { PositionedFile } from "../hooks/useImageManagement";
import style from "../AssetForm.module.css";

interface AssetImageManagerProps {
  positionedFiles: PositionedFile[];
  onFileSelect: (position: string, file: File) => void;
  onRemoveFile: (position: string) => void;
}

/**
 * Image management component with grid view and modal
 * Handles photo uploads organized by position/angle (POV)
 */
export const AssetImageManager: React.FC<AssetImageManagerProps> = ({
  positionedFiles,
  onFileSelect,
  onRemoveFile,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={style.card}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={style.cardTitle}>
            <Camera size={14} className={style.cardIcon} /> Fotos por Ângulo
            (POV)
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            Gerenciar Fotos
          </Button>
        </div>

        <div className={style.imageGrid}>
          {positionedFiles.map((pf) =>
            pf.previewUrl ? (
              <div key={pf.position} className={style.imageItem}>
                <img
                  src={pf.previewUrl}
                  alt={pf.position}
                  className={style.image}
                />
                <div className={style.imageBadge}>{pf.position}</div>
                {pf.file && (
                  <div
                    className={style.uploadPendingBadge}
                    title="Aguardando salvar para fazer upload"
                  >
                    Pendente
                  </div>
                )}
              </div>
            ) : null,
          )}

          {positionedFiles.every((pf) => !pf.previewUrl) && (
            <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">
                Nenhuma foto selecionada. Clique em "Gerenciar Fotos".
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
          {positionedFiles.map((pf) => (
            <div
              key={pf.position}
              className="flex flex-col gap-2 p-3 border rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">
                  {pf.position}
                </span>
                {pf.previewUrl && (
                  <button
                    type="button"
                    onClick={() => onRemoveFile(pf.position)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {pf.previewUrl ? (
                <div className="relative aspect-video rounded overflow-hidden border">
                  <img
                    src={pf.previewUrl}
                    alt={pf.position}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video bg-white border-2 border-dashed rounded cursor-pointer hover:bg-gray-100 transition-colors">
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-xs text-gray-500 mt-2">
                    Selecionar Foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      onFileSelect(pf.position, e.target.files[0])
                    }
                  />
                </label>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={() => setIsModalOpen(false)}>Concluído</Button>
        </div>
      </Modal>
    </>
  );
};
